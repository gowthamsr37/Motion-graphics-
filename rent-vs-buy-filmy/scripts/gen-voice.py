"""Dialogue + scene timeline for the Bollywood-drama cut of Money Stories Ep 01.

Usage (venv with kokoro-onnx + soundfile):
    python scripts/gen-voice.py --model <dir with model.onnx + voices.npz>

Every line has a speaker ("who"); each speaker is a Kokoro voice or a blend of voices, with its own speed.
Writes public/vo/<scene>.wav and src/timeline.json: per scene its start/duration, each line's speaker and
time span, estimated word timings (by phoneme share), and a 30 fps loudness envelope used for lip-sync.
"""
import argparse
import json
import pathlib
import re

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent
FPS = 30


def trim(audio, sr, thresh=0.01, pad=0.04):
    idx = np.where(np.abs(audio) > thresh)[0]
    if len(idx) == 0:
        return audio
    return audio[max(0, idx[0] - int(pad * sr)): min(len(audio), idx[-1] + int(pad * sr))]


def word_times(caption, dur):
    words = caption.split()
    weights = [len(re.sub(r"[^A-Za-z0-9]", "", w)) * (2.2 if re.search(r"\d", w) else 1) + 1.5 + (2 if re.search(r"[,.:;?!]$", w) else 0) for w in words]
    total = sum(weights)
    t, out = 0.0, []
    for w, k in zip(words, weights):
        d = dur * k / total
        out.append({"w": w, "s": round(t, 3), "e": round(t + d * 0.92, 3)})
        t += d
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    args = ap.parse_args()
    script = json.loads((ROOT / "scripts" / "voiceover.json").read_text())
    model = pathlib.Path(args.model)
    tts = Kokoro(str(model / "model.onnx"), str(model / "voices.npz"))
    styles = {}
    for who, spec in script["cast"].items():
        styles[who] = sum(w * tts.get_voice_style(v) for v, w in spec["mix"].items()).astype(np.float32)
    out = ROOT / "public" / "vo"
    out.mkdir(parents=True, exist_ok=True)

    cursor, scenes = 0.0, []
    for sc in script["scenes"]:
        parts, segs, words, t, sr = [], [], [], 0.0, 24000
        for seg in sc["segments"]:
            who = seg["who"]
            ph = tts.tokenizer.phonemize(seg["text"], script["lang"])
            for a_, b_ in script.get("fix", []):
                ph = ph.replace(a_, b_)
            a, sr = tts.create(ph, voice=styles[who], speed=seg.get("speed", script["cast"][who]["speed"]), is_phonemes=True)
            clip = trim(np.asarray(a, dtype=np.float32), sr)
            clip = clip * (0.9 / max(1e-6, np.abs(clip).max()))  # level each speaker
            d = len(clip) / sr
            parts.append(clip)
            segs.append({"who": who, "caption": seg["caption"], "s": round(t, 3), "e": round(t + d, 3)})
            words += [{**w, "s": round(w["s"] + t, 3), "e": round(w["e"] + t, 3), "who": who} for w in word_times(seg["caption"], d)]
            pause = seg.get("pause", 0.35)
            parts.append(np.zeros(int(pause * sr), dtype=np.float32))
            t += d + int(pause * sr) / sr
        audio = np.concatenate(parts[:-1])
        sf.write(out / f"{sc['id']}.wav", audio, sr, subtype="PCM_16")
        dur = len(audio) / sr
        hop = sr // FPS
        env = [float(np.sqrt(np.mean(audio[i:i + hop] ** 2))) for i in range(0, len(audio), hop)]
        peak = max(env) or 1
        env = [round(min(1.0, e / (peak * 0.6)), 2) for e in env]
        length = sc["lead"] + dur + sc["hold"]
        scenes.append({"id": sc["id"], "start": round(cursor, 3), "duration": round(length, 3),
                       "vo": {"at": round(cursor + sc["lead"], 3), "duration": round(dur, 3), "words": words, "segments": segs, "env": env}})
        cursor += length
        print(f"{sc['id']}: {dur:5.2f}s speech, scene {length:5.2f}s")
    (ROOT / "src" / "timeline.json").write_text(json.dumps({"total": round(cursor, 3), "scenes": scenes}))
    print(f"total {cursor:.1f}s")


if __name__ == "__main__":
    main()
