"""Narration + scene timeline for the cinematic toss documentary.

Usage (venv with kokoro-onnx soundfile sherpa-onnx numpy):
    python scripts/gen-voice.py --kokoro <dir with kokoro-v1.0.onnx + voices-v1.0.bin> --asr <sherpa-onnx parakeet-tdt dir>

Each scene lasts: lead-in + narration + hold. Every sentence is synthesised on its own (so pauses are exact),
then a speech recogniser listens back to it: that (a) checks the words came out right and (b) gives per-word
timings, which drive the karaoke subtitles and let the visuals land on the spoken numbers.

Writes public/vo/<scene>.wav, public/vo/narration.wav (the full dry narration track, timeline-aligned)
and src/timeline.json.
"""
import argparse
import json
import pathlib
import re

import numpy as np
import sherpa_onnx
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent


def trim(audio, sr, thresh=0.006, pad=0.06):
    idx = np.where(np.abs(audio) > thresh)[0]
    if len(idx) == 0:
        return audio
    a = audio[max(0, idx[0] - int(pad * sr)): min(len(audio), idx[-1] + int(pad * sr))].copy()
    f = int(0.008 * sr)
    a[:f] *= np.linspace(0, 1, f)
    a[-f:] *= np.linspace(1, 0, f)
    return a


def norm(w):
    return re.sub(r"[^a-z0-9]", "", w.lower())


def align(tokens, words, dur):
    """tokens: caption tokens; words: [(text, start)] heard by the recogniser. Returns a start time per token."""
    n, m = len(tokens), len(words)
    a, b = [norm(t) for t in tokens], [norm(w[0]) for w in words]
    score = [[0.0] * (m + 1) for _ in range(n + 1)]
    back = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            same = a[i - 1] == b[j - 1] or (len(a[i - 1]) > 3 and (a[i - 1].startswith(b[j - 1]) or b[j - 1].startswith(a[i - 1])))
            opts = [(score[i - 1][j - 1] + (2 if same else -1), 0), (score[i - 1][j] - 0.6, 1), (score[i][j - 1] - 0.6, 2)]
            score[i][j], back[i][j] = max(opts)
    i, j, pairs = n, m, {}
    while i > 0 and j > 0:
        k = back[i][j]
        if k == 0:
            if a[i - 1] == b[j - 1] or (len(a[i - 1]) > 3 and (a[i - 1].startswith(b[j - 1]) or b[j - 1].startswith(a[i - 1]))):
                pairs[i - 1] = j - 1
            i, j = i - 1, j - 1
        elif k == 1:
            i -= 1
        else:
            j -= 1
    times = [None] * n
    for i_, j_ in pairs.items():
        times[i_] = words[j_][1]
    # unmatched tokens: take the first unheard word between the neighbours, else spread evenly
    i = 0
    while i < n:
        if times[i] is not None:
            i += 1
            continue
        j = i
        while j < n and times[j] is None:
            j += 1
        lo_j = (pairs[i - 1] + 1) if i > 0 else 0
        hi_j = pairs[j] if j < n else m
        t0 = times[i - 1] if i > 0 else 0.0
        t1 = times[j] if j < n else dur
        gap = [words[q][1] for q in range(lo_j, hi_j)]
        for q in range(i, j):
            r = q - i
            if r < len(gap) and (j - i) <= len(gap):
                # map proportionally into the unheard words
                times[q] = gap[int(r * len(gap) / (j - i))]
            else:
                times[q] = t0 + (t1 - t0) * (r + 1) / (j - i + 1)
        i = j
    out, last = [], 0.0
    for t in times:
        last = max(last, t)
        out.append(round(last, 3))
    return out, len(pairs) / max(1, n)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--kokoro", required=True)
    ap.add_argument("--asr", required=True)
    args = ap.parse_args()
    script = json.loads((ROOT / "scripts" / "voiceover.json").read_text())
    kd = pathlib.Path(args.kokoro)
    tts = Kokoro(str(kd / "kokoro-v1.0.onnx"), str(kd / "voices-v1.0.bin"))
    ad = args.asr
    rec = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f"{ad}/encoder.int8.onnx", decoder=f"{ad}/decoder.int8.onnx", joiner=f"{ad}/joiner.int8.onnx", tokens=f"{ad}/tokens.txt", num_threads=4, model_type="nemo_transducer")

    def hear(audio, sr):
        n = int(len(audio) * 16000 / sr)
        a16 = np.interp(np.linspace(0, len(audio) - 1, n), np.arange(len(audio)), audio).astype(np.float32)
        s = rec.create_stream()
        s.accept_waveform(16000, a16)
        rec.decode_stream(s)
        words = []
        for tok, t in zip(s.result.tokens, s.result.timestamps):
            if tok.startswith(" ") or not words:
                words.append([tok.strip(), float(t)])
            else:
                words[-1][0] += tok
        return s.result.text, [w for w in words if norm(w[0])]

    out = ROOT / "public" / "vo"
    out.mkdir(parents=True, exist_ok=True)
    cursor = 0.0
    scenes = []
    sr = 24000
    for sc in script["scenes"]:
        parts, segs, t = [], [], 0.0
        for seg in sc["segments"]:
            lang = seg.get("lang", script["lang"])
            ph = seg.get("phonemes") or tts.tokenizer.phonemize(seg["text"], lang)
            for a_, b_ in script.get("fix", []):  # pronunciation patches; "re:" marks a regular expression
                ph = re.sub(a_[3:], b_, ph) if a_.startswith("re:") else ph.replace(a_, b_)
            a, sr = tts.create(ph, voice=script["voice"], speed=seg.get("speed", sc.get("speed", script["speed"])), is_phonemes=True)
            clip = trim(np.asarray(a, dtype=np.float32), sr)
            if seg.get("fit"):  # time-stretch (pitch kept) to an exact length, so a re-take never moves the timeline
                import subprocess, tempfile
                with tempfile.TemporaryDirectory() as td:
                    sf.write(f"{td}/in.wav", clip, sr)
                    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{td}/in.wav", "-af", f"atempo={len(clip) / sr / seg['fit']:.6f}", f"{td}/out.wav"], check=True)
                    clip, _ = sf.read(f"{td}/out.wav", dtype="float32")
                want = int(round(seg["fit"] * sr))
                clip = np.pad(clip, (0, max(0, want - len(clip))))[:want]
            d = len(clip) / sr
            heard, words = hear(clip, sr)
            chunks = [c.strip() for c in seg["caption"].split("|")]
            tokens = [w for c in chunks for w in c.split()]
            times, hit = align(tokens, words, d)
            ws, q = [], 0
            for ci, c in enumerate(chunks):
                for w in c.split():
                    ws.append({"w": w, "s": round(t + times[q], 3), "c": ci})
                    q += 1
            for q in range(len(ws)):
                ws[q]["e"] = ws[q + 1]["s"] if q + 1 < len(ws) else round(t + d, 3)
            segs.append({"s": round(t, 3), "e": round(t + d, 3), "chunks": chunks, "words": ws})
            flag = "" if hit > 0.8 else "   <-- CHECK"
            print(f"   [{sc['id']}] {d:5.2f}s match {hit:4.0%}{flag} | heard: {heard}")
            parts.append(clip)
            gap = int(seg.get("pause", 0.35) * sr)
            if seg.get("slot"):  # a re-take keeps the timeline: sentence + pause fill the same slot as before
                gap = max(int(0.12 * sr), int(round(seg["slot"] * sr)) - len(clip))
            parts.append(np.zeros(gap, dtype=np.float32))
            t += d + gap / sr
        audio = np.concatenate(parts[:-1])
        dur = len(audio) / sr
        start = cursor
        length = sc["lead"] + dur + sc["hold"]
        scenes.append({"id": sc["id"], "start": round(start, 3), "duration": round(length, 3), "audio": audio,
                       "vo": {"at": round(start + sc["lead"], 3), "duration": round(dur, 3), "segments": segs}})
        cursor += length
        print(f"{sc['id']}: {dur:5.2f}s speech, scene {length:5.2f}s")
    peak = max(np.abs(s["audio"]).max() for s in scenes)
    full = np.zeros(int(round(cursor * sr)) + sr // 10, dtype=np.float32)
    for s in scenes:
        a = s.pop("audio") * (0.89 / peak)
        sf.write(out / f"{s['id']}.wav", a, sr, subtype="PCM_16")
        i = int(round(s["vo"]["at"] * sr))
        full[i:i + len(a)] += a
    sf.write(out / "narration.wav", full[: int(round(cursor * sr))], sr, subtype="PCM_16")
    (ROOT / "src" / "timeline.json").write_text(json.dumps({"total": round(cursor, 3), "scenes": scenes}, indent=1))
    print(f"total {cursor:.2f}s")


if __name__ == "__main__":
    main()
