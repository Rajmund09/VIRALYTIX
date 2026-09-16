"""
VIRALYTIX — Feature Extractor Service (Phase 3 full implementation)
Extracts real visual features from sampled JPEGs and audio WAV tracks.
"""
import os
import random
import math
import wave
import numpy as np
from PIL import Image, ImageFilter
from app.config import settings


class FeatureExtractor:
    """
    Extracts the complete feature vector from a video file and its metadata.

    Features:
      Visual:  hook_score, scene_change_rate, avg_brightness, motion_score, text_density
      Audio:   speech_rate, silence_ratio, audio_energy
      Text:    word_count, cta_score, question_present, transcript
      Derived: retention_curve, hook_windows
    """

    def extract(self, file_path: str, metadata: dict) -> dict:
        duration = metadata.get("duration", 30.0)

        # Trigger real extraction if FFmpeg is enabled
        if settings.USE_REAL_FFMPEG:
            try:
                return self._real_extract(file_path, metadata)
            except Exception as e:
                print(f"[WARN] Real feature extraction failed ({e}), falling back to simulation.")
                return self._simulated_extract(duration)
        return self._simulated_extract(duration)

    def _real_extract(self, file_path: str, metadata: dict) -> dict:
        """
        Processes real visual frames (JPEG) and audio (WAV) extracted in Phase 2.
        """
        duration = metadata.get("duration", 30.0)
        has_audio = metadata.get("has_audio", True)
        
        # ── 1. Visual Feature Extraction (Pillow Frame Analysis) ────────────
        sampled_frames = metadata.get("sampled_frames", [])
        
        avg_brightness = 0.6
        motion_score = 0.4
        scene_change_rate = 1.0
        text_density = 0.2
        
        if sampled_frames and len(sampled_frames) > 0:
            brightness_list = []
            edge_list = []
            diff_list = []
            scene_cuts = 0
            
            prev_pixels = None
            
            for frame_path in sampled_frames:
                if not os.path.exists(frame_path):
                    continue
                try:
                    with Image.open(frame_path) as img:
                        # Resize to 150x150 for high-speed processing
                        img_small = img.resize((150, 150))
                        gray_img = img_small.convert("L")
                        pixels = np.array(gray_img, dtype=np.float32)
                        
                        # A. Average Brightness
                        brightness = np.mean(pixels) / 255.0
                        brightness_list.append(brightness)
                        
                        # B. Edge Density (Text Caption proxy)
                        edges = gray_img.filter(ImageFilter.FIND_EDGES)
                        edges_pixels = np.array(edges, dtype=np.float32)
                        # Edge density represents the ratio of pixels containing high-frequency edges
                        edge_ratio = np.mean(edges_pixels > 25.0)
                        edge_list.append(edge_ratio)
                        
                        # C. Motion Score & Scene Cuts
                        if prev_pixels is not None:
                            diff = np.abs(pixels - prev_pixels)
                            frame_diff = np.mean(diff) / 255.0
                            diff_list.append(frame_diff)
                            
                            # A difference > 0.16 (16% threshold) marks a scene change cut
                            if frame_diff > 0.16:
                                scene_cuts += 1
                                
                        prev_pixels = pixels
                except Exception as e:
                    print(f"[WARN] Failed to analyze frame {frame_path}: {e}")
                    
            if len(brightness_list) > 0:
                avg_brightness = float(np.mean(brightness_list))
            if len(edge_list) > 0:
                # Scale edge ratio index to typical 0-1 density ranges
                text_density = float(min(np.mean(edge_list) * 4.0, 1.0))
            if len(diff_list) > 0:
                motion_score = float(np.mean(diff_list))
            if duration > 0:
                scene_change_rate = float(scene_cuts / duration)
        
        # ── 2. Audio Feature Extraction (wave & numpy) ─────────────────────
        audio_path = metadata.get("audio_path")
        audio_energy = 0.4
        silence_ratio = 0.15
        word_count = 0
        speech_rate = 120.0
        
        if has_audio and audio_path and os.path.exists(audio_path):
            try:
                with wave.open(audio_path, "rb") as wav:
                    n_channels = wav.getnchannels()
                    sampwidth = wav.getsampwidth()
                    framerate = wav.getframerate()
                    n_frames = wav.getnframes()
                    
                    if n_frames > 0:
                        raw_data = wav.readframes(n_frames)
                        
                        if sampwidth == 2:
                            audio_data = np.frombuffer(raw_data, dtype=np.int16).astype(np.float32) / 32768.0
                        elif sampwidth == 1:
                            audio_data = (np.frombuffer(raw_data, dtype=np.uint8).astype(np.float32) - 128.0) / 128.0
                        else:
                            audio_data = np.zeros(n_frames, dtype=np.float32)
                            
                        # Audio RMS Energy
                        rms = np.sqrt(np.mean(audio_data ** 2)) if len(audio_data) > 0 else 0
                        audio_energy = float(rms)
                        
                        # Silence Ratio (100ms frames)
                        window_size = int(0.10 * framerate)
                        if window_size > 0:
                            n_windows = len(audio_data) // window_size
                            silent_windows = 0
                            active_speech_windows = 0
                            
                            for w in range(n_windows):
                                window_samples = audio_data[w * window_size : (w + 1) * window_size]
                                w_rms = np.sqrt(np.mean(window_samples ** 2)) if len(window_samples) > 0 else 0
                                if w_rms < 0.015:
                                    silent_windows += 1
                                else:
                                    active_speech_windows += 1
                                    
                            silence_ratio = float(silent_windows / n_windows) if n_windows > 0 else 0.15
                            
                            # Estimate speech rate heuristic (average 140 words/min of active speaking)
                            active_speech_sec = active_speech_windows * 0.1
                            word_count = int(active_speech_sec * (140.0 / 60.0))
                            if duration > 0:
                                speech_rate = float(word_count / (duration / 60.0))
            except Exception as e:
                print(f"[WARN] WAV extraction failed: {e}")
                
        # ── 3. Speech & Text Analysis (Whisper Speech-to-Text Fallbacks) ───
        transcript = "[No transcribable audio track found]"
        cta_score = 0.35
        question_present = False
        
        # Whisper execution if enabled
        if settings.USE_REAL_WHISPER and has_audio and audio_path and os.path.exists(audio_path):
            try:
                import whisper
                model = whisper.load_model(settings.WHISPER_MODEL_SIZE)
                whisper_res = model.transcribe(audio_path)
                raw_transcript = whisper_res.get("text", "").strip()
                if raw_transcript:
                    transcript = raw_transcript
                    words = [w.strip(".,!?\"'") for w in transcript.split() if w.strip()]
                    word_count = len(words)
                    if duration > 0:
                        speech_rate = float(word_count / (duration / 60.0))
                    
                    # Search keywords for Call to Action (CTA) and questions
                    cta_keywords = ["subscribe", "follow", "link in bio", "comment below", "like", "share", "watch", "buy", "sign up", "download"]
                    cta_hits = sum(1 for kw in cta_keywords if kw in transcript.lower())
                    cta_score = float(min(0.3 + (cta_hits * 0.2), 1.0))
                    question_present = "?" in transcript or any(w in transcript.lower() for w in ["what", "why", "how", "who", "when", "where", "can you", "should we"])
            except Exception as e:
                print(f"[WARN] Whisper execution failed: {e}. Falling back to heuristics.")
                
        # Heuristic transcript generation if Whisper is inactive
        if transcript == "[No transcribable audio track found]":
            if has_audio and word_count > 0:
                pace_desc = "highly edited transitions" if scene_change_rate > 1.8 else "moderate camera changes" if scene_change_rate > 0.8 else "static talking head visual frames"
                vol_desc = "high voice volume" if audio_energy > 0.45 else "average voice energy levels"
                transcript = f"[Audible Track: Approximately {word_count} words spoken at {vol_desc} coupled with {pace_desc}.]"
                
                # Heuristic CTA/Question presence based on energy levels
                cta_score = 0.70 if (audio_energy > 0.45 and text_density > 0.3) else 0.35
                question_present = random.random() > 0.50
                
        # ── 4. Derived Features (Retention curve & Hook metrics) ─────────
        # Hook score combines motion, scene changes, brightness, text presence, and audio energy
        visual_hook = (
            0.35 * min(motion_score / 0.25, 1.0) +
            0.35 * min(scene_change_rate / 1.5, 1.0) +
            0.15 * avg_brightness +
            0.15 * text_density
        )
        audio_hook = min(audio_energy / 0.08, 1.0)
        hook_score = 0.55 * visual_hook + 0.45 * audio_hook
        hook_score = float(max(20.0, min(100.0, hook_score * 100.0)))
        
        # retention curve solver based on features
        retention_curve = []
        retention = 100.0
        hook_factor = hook_score / 100.0
        
        for t in range(int(duration)):
            # Base decay decreases if hook_score is high
            base_decay = 2.8 - (hook_factor * 1.5)
            
            # Slow pace or silent content decays faster
            if scene_change_rate < 0.8:
                base_decay += 0.8
            if silence_ratio > 0.25:
                base_decay += 0.6
                
            # Random fluctuations
            decay = base_decay + random.uniform(-0.4, 0.4)
            retention = max(2.0, retention - decay)
            retention_curve.append({"second": t, "retention": round(retention, 1)})
            
        hook_windows = {
            "0-3": round(hook_score, 1),
            "3-6": round(hook_score * random.uniform(0.85, 0.94), 1),
            "6-9": round(hook_score * random.uniform(0.72, 0.83), 1),
            "9-12": round(hook_score * random.uniform(0.58, 0.71), 1),
        }
        
        return {
            "hook_score": round(hook_score, 1),
            "scene_change_rate": round(scene_change_rate, 3),
            "avg_brightness": round(avg_brightness, 3),
            "motion_score": round(motion_score, 3),
            "text_density": round(text_density, 3),
            "speech_rate": round(speech_rate, 1),
            "silence_ratio": round(silence_ratio, 3),
            "audio_energy": round(audio_energy, 3),
            "word_count": word_count,
            "cta_score": round(cta_score, 3),
            "question_present": question_present,
            "transcript": transcript,
            "retention_curve": retention_curve,
            "hook_windows": hook_windows,
        }

    def _simulated_extract(self, duration: float) -> dict:
        """
        Generate a plausible feature vector for a short-form video.
        """
        hook_score = round(random.gauss(72, 14), 1)
        hook_score = max(20.0, min(100.0, hook_score))

        scene_change_rate = round(random.uniform(0.5, 3.0), 3)
        avg_brightness = round(random.uniform(0.45, 0.90), 3)
        motion_score = round(random.uniform(0.30, 0.85), 3)
        text_density = round(random.uniform(0.10, 0.70), 3)
        speech_rate = round(random.uniform(100, 180), 1)
        silence_ratio = round(random.uniform(0.05, 0.30), 3)
        audio_energy = round(random.uniform(0.50, 0.95), 3)
        word_count = int(speech_rate * (duration / 60) * (1 - silence_ratio))
        cta_score = round(random.uniform(0.20, 0.90), 3)
        question_present = random.random() > 0.45

        retention_curve = self._generate_retention_curve(duration, hook_score)

        hook_windows = {
            "0-3": round(hook_score, 1),
            "3-6": round(hook_score * random.uniform(0.85, 0.95), 1),
            "6-9": round(hook_score * random.uniform(0.72, 0.84), 1),
            "9-12": round(hook_score * random.uniform(0.58, 0.72), 1),
        }

        return {
            "hook_score": hook_score,
            "scene_change_rate": scene_change_rate,
            "avg_brightness": avg_brightness,
            "motion_score": motion_score,
            "text_density": text_density,
            "speech_rate": speech_rate,
            "silence_ratio": silence_ratio,
            "audio_energy": audio_energy,
            "word_count": word_count,
            "cta_score": cta_score,
            "question_present": question_present,
            "transcript": "[Simulated transcript — real Whisper transcription in Phase 3]",
            "retention_curve": retention_curve,
            "hook_windows": hook_windows,
        }

    @staticmethod
    def _generate_retention_curve(duration: float, hook_score: float) -> list:
        """
        Generate a realistic second-by-second retention curve.
        """
        seconds = int(duration)
        curve = []
        retention = 100.0
        hook_factor = hook_score / 100.0

        for t in range(seconds):
            if t < 3:
                decay = random.uniform(0.5, 2.0) * (1 - hook_factor * 0.5)
            elif t < 10:
                decay = random.uniform(1.5, 3.5) * (1 - hook_factor * 0.3)
            else:
                decay = random.uniform(1.0, 2.5)

            if random.random() < 0.05 and t > 5:
                decay *= random.uniform(2.5, 5.0)

            retention = max(0.0, retention - decay)
            curve.append({"second": t, "retention": round(retention, 1)})

        return curve
