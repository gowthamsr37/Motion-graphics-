"""Narration + scene timeline for "Myth Busters #01: the toss".

Usage (venv with kokoro-onnx soundfile faster-whisper):
    python scripts/gen-voice.py --model <dir with model.onnx + voices.npz> --whisper <faster-whisper dir>

Each scene lasts: lead-in (board opens) + narration + hold (reading time / dramatic pause).
Writes public/vo/<scene>.wav and src/timeline.json (seconds, plus word timings for syncing numbers to speech).
"""
import argparse
import json
import pathlib

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent


def trim(audio, sr, thresh=0.01, pad=0.04):
    idx = np.where(np.abs(audio) > thresh)[0]
    if len(idx) == 0:
        return audio
    return audio[max(0, idx[0] - int(pad * sr)): min(len(audio), idx[-1] + int(pad * sr))]


def _norm(w):
    return "".join(ch for ch in w.lower() if ch.isalnum())


def align_caption(caption, ws, s0, e0):
    """Give every caption token (as displayed, e.g. "1,244") a start/end time from whisper's words."""
    toks = caption.split()
    if not ws:
        step = (e0 - s0) / max(1, len(toks))
        return [{"t": t, "s": round(s0 + i * step, 3), "e": round(s0 + (i + 1) * step, 3)} for i, t in enumerate(toks)]
    A = [_norm(t) for t in toks]
    B = [_norm(w["w"]) for w in ws]
    n, m = len(A), len(B)
    eq = lambda a, b: a == b or (len(a) >= 2 and len(b) >= 2 and (a.startswith(b) or b.startswith(a))) or (a[:1].isdigit() and b[:1].isdigit() and a.startswith(b))
    isnum = lambda a: a[:1].isdigit()
    sub = lambda a, b: 0 if eq(a, b) else (1.2 if isnum(a) != isnum(b) else 1)
    D = [[0.0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1): D[i][0] = i
    for j in range(1, m + 1): D[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            D[i][j] = min(D[i - 1][j - 1] + sub(A[i - 1], B[j - 1]), D[i - 1][j] + 1, D[i][j - 1] + 1)
    i, j, pairs = n, m, {}
    extra = {}
    while i > 0 or j > 0:
        if i > 0 and j > 0 and abs(D[i][j] - (D[i - 1][j - 1] + sub(A[i - 1], B[j - 1]))) < 1e-9:
            pairs.setdefault(i - 1, []).append(j - 1); i -= 1; j -= 1
        elif j > 0 and abs(D[i][j] - (D[i][j - 1] + 1)) < 1e-9:
            extra.setdefault(max(0, i - 1), []).append(j - 1); j -= 1
        else:
            i -= 1
    out = []
    for k, t in enumerate(toks):
        js = pairs.get(k, []) + extra.get(k, [])
        if js:
            out.append({"t": t, "s": min(ws[x]["s"] for x in js), "e": max(ws[x]["e"] for x in js)})
        else:
            out.append({"t": t, "s": None, "e": None})
    # fill gaps by interpolation
    for k, o in enumerate(out):
        if o["s"] is None:
            prev = next((out[q]["e"] for q in range(k - 1, -1, -1) if out[q]["s"] is not None), s0)
            nxt = next((out[q]["s"] for q in range(k + 1, len(out)) if out[q]["s"] is not None), e0)
            o["s"], o["e"] = prev, max(prev + 0.05, nxt)
    for k in range(len(out) - 1):  # monotonic, no overlaps
        out[k + 1]["s"] = max(out[k + 1]["s"], out[k]["s"] + 0.04)
    return [{"t": o["t"], "s": round(o["s"], 3), "e": round(o["e"], 3)} for o in out]


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
        parts = []
        seg_times = []
        t = 0.0
        for seg in sc["segments"]:  # segments let us place natural pauses between sentences
            ph = seg.get("phonemes")
            if ph is None and script.get("fix"):
                # auto-phonemize, then patch words the G2P gets wrong (ODIs, IPL, Dubai...)
                auto = tts.tokenizer.phonemize(seg["text"], seg.get("lang", script.get("lang", "en-us")))
                patched = auto
                for a_, b_ in script["fix"]:
                    patched = patched.replace(a_, b_)
                ph = patched if patched != auto else None
            if ph is not None:
                a, sr = tts.create(ph, voice=script["voice"], speed=sc.get("speed", script["speed"]), is_phonemes=True)
            else:
                a, sr = tts.create(seg["text"], voice=script["voice"], speed=sc.get("speed", script["speed"]), lang=seg.get("lang", script.get("lang", "en-us")))
            clip = trim(np.asarray(a, dtype=np.float32), sr)
            parts.append(clip)
            seg_times.append({"caption": seg["caption"], "s": round(t, 3), "e": round(t + len(clip) / sr, 3)})
            t += len(clip) / sr + int(seg.get("pause", 0.35) * sr) / sr
            parts.append(np.zeros(int(seg.get("pause", 0.35) * sr), dtype=np.float32))
        audio = np.concatenate(parts[:-1])
        audio = audio * (0.9 / max(1e-6, np.abs(audio).max()))
        sf.write(out / f"{sc['id']}.wav", audio, sr, subtype="PCM_16")
        dur = len(audio) / sr
        n = int(len(audio) * 16000 / sr)
        a16 = np.interp(np.linspace(0, len(audio) - 1, n), np.arange(len(audio)), audio).astype(np.float32)
        segs, _ = asr.transcribe(a16, language="en", word_timestamps=True, beam_size=5)
        words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
        # each whisper word belongs to the segment nearest its midpoint
        buckets = [[] for _ in seg_times]
        for w in words:
            mid = (w["s"] + w["e"]) / 2
            k = min(range(len(seg_times)), key=lambda q: 0 if seg_times[q]["s"] <= mid <= seg_times[q]["e"] else min(abs(mid - seg_times[q]["s"]), abs(mid - seg_times[q]["e"])))
            buckets[k].append(w)
        for g, b in zip(seg_times, buckets):
            g["words"] = align_caption(g["caption"], b, g["s"], g["e"])
        start = cursor
        length = sc["lead"] + dur + sc["hold"]
        scenes.append({"id": sc["id"], "start": round(start, 3), "duration": round(length, 3),
                       "vo": {"at": round(start + sc["lead"], 3), "duration": round(dur, 3), "words": words, "segments": seg_times}})
        cursor += length
        print(f"{sc['id']}: {dur:5.2f}s speech, scene {length:5.2f}s | {' '.join(w['w'] for w in words)}")
    (ROOT / "src" / "timeline.json").write_text(json.dumps({"total": round(cursor, 3), "scenes": scenes}, indent=1))
    print(f"total {cursor:.1f}s")


if __name__ == "__main__":
    main()
