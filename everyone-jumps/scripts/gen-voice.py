"""Narration + scene timeline for "What if everyone on Earth jumped at once?".

Usage (venv with kokoro-onnx, soundfile, onnx):
    python scripts/gen-voice.py --model <dir with kokoro-v1.0.onnx + voices-v1.0.bin>

Word timings come straight from Kokoro's own duration predictor: the script exposes the
model's per-phoneme durations (an internal tensor) as an extra ONNX output, so every word's
start/end is exact (one duration unit = 600 samples at 24 kHz). No speech recogniser needed.

Each scene lasts lead-in + narration + hold. Writes public/vo/<scene>.wav and src/timeline.json.
"""
import argparse
import json
import pathlib
import re

import numpy as np
import soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 24000
HOP = 600  # samples per predicted duration unit
DUR_TENSOR = "/encoder/Clip_output_0"


def ensure_duration_model(model_dir: pathlib.Path) -> pathlib.Path:
    out = model_dir / "kokoro-v1.0-dur.onnx"
    if out.exists():
        return out
    import onnx

    m = onnx.load(str(model_dir / "kokoro-v1.0.onnx"))
    m.graph.output.append(onnx.helper.make_tensor_value_info(DUR_TENSOR, onnx.TensorProto.FLOAT, None))
    onnx.save(m, str(out))
    return out


def parse(text):
    """'{8.3|Eight point three} billion' -> spoken text + [(display, n_spoken_words)]."""
    spoken, words = [], []
    for m in re.finditer(r"\{([^|}]+)\|([^}]+)\}|(\S+)", text):
        if m.group(3):
            spoken.append(m.group(3))
            words.append((m.group(3), 1))
        else:
            sw = m.group(2).split()
            # keep trailing punctuation of the spoken form on the display form
            spoken.extend(sw)
            words.append((m.group(1), len(sw)))
    return " ".join(spoken), words


def synth(kokoro, sess, text, voice, speed, lang):
    """Returns audio, the token time spans of each phoneme word, and the phoneme string."""
    ph = kokoro.tokenizer.phonemize(text, lang)
    vocab = kokoro.tokenizer.vocab
    toks, tok_word = [], []
    w = 0
    prev_space = True
    for c in ph:
        if c == " ":
            if not prev_space:
                w += 1
            prev_space = True
        else:
            prev_space = False
        if c in vocab:
            toks.append(vocab[c])
            tok_word.append(-1 if (c == " " or c in _PUNCT) else w)
    style = kokoro.get_voice_style(voice)[len(toks)]
    audio, dur = sess.run(None, {"tokens": [[0, *toks, 0]], "style": style, "speed": np.array([speed], dtype=np.float32)})
    dur = dur.ravel()
    assert abs(len(audio) - dur.sum() * HOP) < HOP, (len(audio), dur.sum())
    edges = np.concatenate([[0], np.cumsum(dur)]) * HOP  # token k spans edges[k]..edges[k+1] (k=0 is BOS)
    groups = {}
    for j, wi in enumerate(tok_word):
        if wi >= 0:
            groups.setdefault(wi, []).append((edges[j + 1], edges[j + 2]))
    return np.asarray(audio, dtype=np.float32), [groups[i] for i in sorted(groups)], ph


_PUNCT = set(';:,.!?¡¿—…"«»“”()')


def align(kokoro, lang, spoken_words, ph_groups):
    """Map spoken words onto phoneme words. espeak sometimes merges ("out of" -> one word) or
    splits words, so align by phoneme length with a small DP; merged groups are split in
    proportion to each word's own phoneme count."""
    vocab = kokoro.tokenizer.vocab
    lens = []
    for wd in spoken_words:
        core = re.sub(r"[^\w'-]", "", wd) or wd
        lens.append(max(1, sum(1 for c in kokoro.tokenizer.phonemize(core, lang) if c in vocab and c != " " and c not in _PUNCT)))
    qlens = [len(g) for g in ph_groups]
    n, m = len(lens), len(qlens)
    INF = 1e9
    cost = [[INF] * (m + 1) for _ in range(n + 1)]
    back = [[None] * (m + 1) for _ in range(n + 1)]
    cost[0][0] = 0
    moves = [(1, 1), (2, 1), (3, 1), (1, 2), (1, 3)]
    for i in range(n + 1):
        for j in range(m + 1):
            if cost[i][j] >= INF:
                continue
            for di, dj in moves:
                a, b = i + di, j + dj
                if a > n or b > m:
                    continue
                c = cost[i][j] + abs(sum(lens[i:a]) - sum(qlens[j:b])) + (0 if (di, dj) == (1, 1) else 1.5)
                if c < cost[a][b]:
                    cost[a][b], back[a][b] = c, (i, j)
    if cost[n][m] >= INF:
        raise SystemExit(f"cannot align {spoken_words} with {qlens}")
    spans = [None] * n
    a, b = n, m
    while (a, b) != (0, 0):
        i, j = back[a][b]
        toks = [t for g in ph_groups[j:b] for t in g]
        if a - i == 1:
            spans[i] = (toks[0][0], toks[-1][1])
        else:  # several words share one phoneme group: split it by their own lengths
            share = np.array(lens[i:a], dtype=float)
            cuts = np.round(np.cumsum(share) / share.sum() * len(toks)).astype(int)
            k0 = 0
            for k, cut in enumerate(cuts):
                cut = max(cut, k0 + 1)
                spans[i + k] = (toks[min(k0, len(toks) - 1)][0], toks[min(cut, len(toks)) - 1][1])
                k0 = cut
        a, b = i, j
    return spans


def trim_bounds(audio, thresh=0.008, pad=0.03):
    idx = np.where(np.abs(audio) > thresh)[0]
    if len(idx) == 0:
        return 0, len(audio)
    return max(0, idx[0] - int(pad * SR)), min(len(audio), idx[-1] + int(pad * SR))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    args = ap.parse_args()
    from kokoro_onnx import Kokoro

    model_dir = pathlib.Path(args.model)
    kokoro = Kokoro(str(ensure_duration_model(model_dir)), str(model_dir / "voices-v1.0.bin"))
    sess = kokoro.sess
    script = json.loads((ROOT / "scripts" / "voiceover.json").read_text())
    out = ROOT / "public" / "vo"
    out.mkdir(parents=True, exist_ok=True)

    rendered = []
    for sc in script["scenes"]:
        parts, words, segs = [], [], []
        t = 0  # samples
        for seg in sc["segments"]:
            spoken, disp = parse(seg["text"])
            audio, groups, ph = synth(kokoro, sess, spoken, script["voice"], seg.get("speed", script["speed"]), script["lang"])
            spans = align(kokoro, script["lang"], spoken.split(), groups)
            if len(groups) != len(spans):
                print(f"  note {sc['id']}: aligned {len(spans)} words onto {len(groups)} phoneme words: {ph}")
            a, b = trim_bounds(audio)
            clip = audio[a:b]
            k = 0
            seg_words = []
            for d, n in disp:
                s, e = spans[k][0], spans[k + n - 1][1]
                k += n
                seg_words.append({"w": d, "s": round((t + s - a) / SR, 3), "e": round((t + e - a) / SR, 3)})
            words.extend(seg_words)
            caption = " ".join(d for d, _ in disp)
            segs.append({"caption": caption, "s": round(t / SR, 3), "e": round((t + len(clip)) / SR, 3)})
            parts.append(clip)
            gap = int(seg.get("pause", 0.35) * SR)
            parts.append(np.zeros(gap, dtype=np.float32))
            t += len(clip) + gap
        audio = np.concatenate(parts[:-1])
        rendered.append((sc, audio, words, segs))

    peak = max(np.abs(a).max() for _, a, _, _ in rendered)
    cursor = 0.0
    scenes = []
    for sc, audio, words, segs in rendered:
        audio = audio * (0.9 / peak)
        sf.write(out / f"{sc['id']}.wav", audio, SR, subtype="PCM_16")
        dur = len(audio) / SR
        length = sc["lead"] + dur + sc["hold"]
        scenes.append({"id": sc["id"], "start": round(cursor, 3), "duration": round(length, 3),
                       "vo": {"at": round(cursor + sc["lead"], 3), "duration": round(dur, 3), "words": words, "segments": segs}})
        print(f"{sc['id']}: {dur:5.2f}s speech, scene {length:5.2f}s @ {cursor:5.2f} | " + " ".join(f"{w['w']}@{w['s']:.2f}" for w in words))
        cursor += length
    (ROOT / "src" / "timeline.json").write_text(json.dumps({"total": round(cursor, 3), "scenes": scenes}, indent=1))
    print(f"total {cursor:.2f}s")


if __name__ == "__main__":
    main()
