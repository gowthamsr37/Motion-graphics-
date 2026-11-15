"""Narration + scene timeline for "Types of Data Explained in 2 Minutes".

Usage (venv with kokoro-onnx soundfile faster-whisper):
    python scripts/gen-voice.py --model <dir with model.onnx + voices.npz> --whisper <faster-whisper model dir>

Each scene lasts: lead-in + narration + hold. Every segment is synthesized on its own so natural pauses
(and the 5-second quiz countdown) sit exactly where the script puts them.

Writes public/vo/<scene>.wav and src/timeline.json with, per scene:
  vo.words     Whisper word timings (used to sync visuals to spoken words)
  vo.segments  sentence start/end + caption text
  vo.captions  subtitle pages (2-5 words) whose words carry their own timings, aligned to the script text
"""
import argparse
import difflib
import json
import pathlib
import re

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent


def trim(audio, sr, thresh=0.01, pad=0.04):
    idx = np.where(np.abs(audio) > thresh)[0]
    if len(idx) == 0:
        return audio
    return audio[max(0, idx[0] - int(pad * sr)): min(len(audio), idx[-1] + int(pad * sr))]


NUM = {"0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine"}


def norm(w):
    w = w.lower().replace("’", "'")
    w = re.sub(r"[^a-z0-9']", "", w)
    return NUM.get(w, w)


def align(tokens, words, s, e):
    """Give every caption token a (start, end) using matching Whisper words; interpolate the rest."""
    a = [norm(t) for t in tokens]
    b = [norm(w["w"]) for w in words]
    times = [None] * len(tokens)
    for blk in difflib.SequenceMatcher(a=a, b=b, autojunk=False).get_matching_blocks():
        for k in range(blk.size):
            times[blk.a + k] = (words[blk.b + k]["s"], words[blk.b + k]["e"])
    i = 0
    while i < len(tokens):
        if times[i] is not None:
            i += 1
            continue
        j = i
        while j < len(tokens) and times[j] is None:
            j += 1
        t0 = times[i - 1][1] if i > 0 else s
        t1 = times[j][0] if j < len(tokens) else e
        t1 = max(t1, t0 + 0.12 * (j - i))
        weights = [max(2, len(tokens[k])) for k in range(i, j)]
        tot = sum(weights)
        acc = t0
        for k, wt in zip(range(i, j), weights):
            d = (t1 - t0) * wt / tot
            times[k] = (round(acc, 3), round(acc + d, 3))
            acc += d
        i = j
    return times


WEAK = {"a", "an", "the", "in", "into", "of", "to", "is", "and", "or", "for", "from", "with", "your", "can't"}


def pages(tokens, times, seg_end, max_chars=28):
    """Subtitle pages chosen by dynamic programming: one line each, sentence ends always break,
    breaks prefer punctuation, lines stay near max_chars, and single orphan words are penalised."""
    m = len(tokens)
    INF = float("inf")
    dp = [0.0] + [INF] * m
    back = [0] * (m + 1)
    for j in range(1, m + 1):
        for i in range(j - 1, -1, -1):
            chunk = tokens[i:j]
            if any(t[-1] in ".!?…" for t in chunk[:-1]):
                break  # never run a page across a sentence end
            L = len(" ".join(chunk))
            if L > max_chars + 8 and len(chunk) > 1:
                break
            cost = 12 + max(0, L - max_chars) * 6
            if j < m:
                last = chunk[-1]
                cost += 0 if last[-1] in ":;" else 1.5 if last[-1] == "," else 5
                if last.lower() in WEAK:
                    cost += 6  # never end a line on "a", "the", "into"...
            if len(chunk) == 1 and m > 1:
                cost += 14  # orphan word
            if dp[i] + cost < dp[j]:
                dp[j] = dp[i] + cost
                back[j] = i
    out, j = [], m
    while j > 0:
        out.append(list(range(back[j], j)))
        j = back[j]
    out.reverse()
    res = []
    for p_i, p in enumerate(out):
        start = times[p[0]][0]
        end = times[out[p_i + 1][0]][0] if p_i + 1 < len(out) else seg_end + 0.2
        res.append({"s": round(start, 3), "e": round(end, 3),
                    "words": [{"w": tokens[x], "s": times[x][0], "e": times[x][1]} for x in p]})
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    ap.add_argument("--whisper", required=True)
    args = ap.parse_args()
    script = json.loads((ROOT / "scripts" / "voiceover.json").read_text())
    model = pathlib.Path(args.model)
    tts = Kokoro(str(model / "model.onnx"), str(model / "voices.npz"))
    from faster_whisper import WhisperModel

    asr = WhisperModel(args.whisper, device="cpu", compute_type="int8")
    out = ROOT / "public" / "vo"
    out.mkdir(parents=True, exist_ok=True)

    cursor = 0.0
    scenes = []
    for sc in script["scenes"]:
        parts, seg_times = [], []
        t = 0.0
        speed = sc.get("speed", script["speed"])
        sr = 24000
        for seg in sc["segments"]:
            if "fix" in seg:  # patch a word's pronunciation inside the phonemized sentence
                ph = tts.tokenizer.phonemize(seg["text"], script["lang"])
                for a, b in seg["fix"]:
                    if a not in ph:
                        raise SystemExit(f"fix '{a}' not found in: {ph}")
                    ph = ph.replace(a, b)
                audio, sr = tts.create(ph, voice=script["voice"], speed=speed, is_phonemes=True)
            else:
                audio, sr = tts.create(seg["text"], voice=script["voice"], speed=speed, lang=script["lang"])
            clip = trim(np.asarray(audio, dtype=np.float32), sr)
            seg_times.append({"caption": seg["caption"], "s": round(t, 3), "e": round(t + len(clip) / sr, 3)})
            pause = seg.get("pause", 0.35)
            parts += [clip, np.zeros(int(pause * sr), dtype=np.float32)]
            t += len(clip) / sr + int(pause * sr) / sr
        audio = np.concatenate(parts[:-1])
        audio = audio * (0.9 / max(1e-6, np.abs(audio).max()))
        sf.write(out / f"{sc['id']}.wav", audio, sr, subtype="PCM_16")
        dur = len(audio) / sr
        n = int(len(audio) * 16000 / sr)
        a16 = np.interp(np.linspace(0, len(audio) - 1, n), np.arange(len(audio)), audio).astype(np.float32)
        segs, _ = asr.transcribe(a16, language="en", word_timestamps=True, beam_size=5, initial_prompt=" ".join(s["caption"] for s in sc["segments"]))
        words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]

        captions = []
        for g in seg_times:
            inside = [w for w in words if w["s"] >= g["s"] - 0.2 and w["e"] <= g["e"] + 0.25]
            toks = g["caption"].split()
            captions += pages(toks, align(toks, inside, g["s"], g["e"]), g["e"])

        length = sc["lead"] + dur + sc["hold"]
        scenes.append({"id": sc["id"], "title": sc["title"], "start": round(cursor, 3), "duration": round(length, 3),
                       "vo": {"at": round(cursor + sc["lead"], 3), "duration": round(dur, 3), "words": words,
                              "segments": seg_times, "captions": captions}})
        print(f"{sc['id']} @ {cursor:6.2f}s: {dur:5.2f}s speech, scene {length:5.2f}s | {' '.join(w['w'] for w in words)}")
        cursor += length
    (ROOT / "src" / "timeline.json").write_text(json.dumps({"total": round(cursor, 3), "scenes": scenes}, indent=1))
    print(f"total {cursor:.1f}s")


if __name__ == "__main__":
    main()
