"""
VIRALYTIX — Video Processor Service
Phase 2: Real FFmpeg implementation.

Responsibilities:
  - Extract video metadata (duration, FPS, resolution, aspect ratio, frame count)
  - Sample frames (1 per second) and save to a temp directory
  - Extract audio track as a separate .wav file for Phase 3 audio analysis
  - Graceful fallback to simulation if FFmpeg binary is missing

Requires: ffmpeg binary on system PATH, ffmpeg-python package
"""

import os
import json
import subprocess
import shutil
import random
import tempfile
from pathlib import Path
from math import gcd
from app.config import settings


class VideoProcessor:
    """
    Extracts video metadata, samples frames, and separates audio using FFmpeg.

    Modes:
      - REAL (USE_REAL_FFMPEG=true in .env): Uses FFmpeg binary
      - SIMULATION (default): Generates plausible metadata from file size
    """

    def extract_metadata(self, file_path: str) -> dict:
        """Extract core video metadata. Returns a metadata dict."""
        if settings.USE_REAL_FFMPEG:
            return self._real_extract_metadata(file_path)
        return self._simulated_extract(file_path)

    def extract_frames(self, file_path: str, output_dir: str, fps: float = 1.0) -> list:
        """
        Sample frames at `fps` frames per second.
        Returns list of saved frame file paths.
        """
        if settings.USE_REAL_FFMPEG:
            return self._real_extract_frames(file_path, output_dir, fps)
        return []  # simulation mode: no frames needed

    def extract_audio(self, file_path: str, output_path: str) -> str | None:
        """
        Extract audio track as a 16kHz mono WAV file (optimal for Whisper).
        Returns path to the audio file, or None if no audio / FFmpeg unavailable.
        """
        if settings.USE_REAL_FFMPEG:
            return self._real_extract_audio(file_path, output_path)
        return None

    # ── Real FFmpeg Implementation ────────────────────────────────────────────

    def _real_extract_metadata(self, file_path: str) -> dict:
        """
        Use ffprobe (bundled with FFmpeg) to probe video metadata.
        Falls back to simulation on any error.
        """
        try:
            cmd = [
                "ffprobe",
                "-v", "quiet",
                "-print_format", "json",
                "-show_format",
                "-show_streams",
                file_path,
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)

            if result.returncode != 0:
                raise RuntimeError(f"ffprobe error: {result.stderr}")

            probe = json.loads(result.stdout)

            # Find video and audio streams
            video_stream = next(
                (s for s in probe.get("streams", []) if s.get("codec_type") == "video"),
                None,
            )
            audio_stream = next(
                (s for s in probe.get("streams", []) if s.get("codec_type") == "audio"),
                None,
            )

            if not video_stream:
                raise ValueError("No video stream found in file")

            # Duration: prefer format-level, fall back to stream-level
            duration = float(
                probe.get("format", {}).get("duration")
                or video_stream.get("duration")
                or 30.0
            )

            # FPS: stored as "30000/1001" fraction string
            fps_str = video_stream.get("r_frame_rate", "30/1")
            try:
                num, den = fps_str.split("/")
                fps = float(num) / float(den)
            except Exception:
                fps = 30.0

            width = int(video_stream.get("width", 1080))
            height = int(video_stream.get("height", 1920))
            frame_count = int(video_stream.get("nb_frames") or (duration * fps))

            return {
                "duration": round(duration, 3),
                "fps": round(fps, 3),
                "width": width,
                "height": height,
                "aspect_ratio": self._aspect_ratio(width, height),
                "frame_count": frame_count,
                "has_audio": audio_stream is not None,
                "codec": video_stream.get("codec_name", "unknown"),
                "bit_rate": int(probe.get("format", {}).get("bit_rate", 0)),
            }

        except Exception as e:
            print(f"[WARN] ffprobe failed ({e}), using simulation fallback")
            return self._simulated_extract(file_path)

    def _real_extract_frames(
        self, file_path: str, output_dir: str, fps: float = 1.0
    ) -> list:
        """
        Extract one frame per second using FFmpeg.
        Frames saved as frame_001.jpg, frame_002.jpg, ...
        """
        try:
            os.makedirs(output_dir, exist_ok=True)
            output_pattern = os.path.join(output_dir, "frame_%04d.jpg")

            cmd = [
                "ffmpeg",
                "-i", file_path,
                "-vf", f"fps={fps}",         # 1 frame per second
                "-q:v", "2",                  # JPEG quality (2=high)
                "-vsync", "vfr",
                output_pattern,
                "-y",                         # overwrite
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

            if result.returncode != 0:
                raise RuntimeError(f"FFmpeg frame extraction error: {result.stderr[-500:]}")

            frames = sorted(Path(output_dir).glob("frame_*.jpg"))
            return [str(f) for f in frames]

        except Exception as e:
            print(f"[WARN] Frame extraction failed ({e})")
            return []

    def _real_extract_audio(self, file_path: str, output_path: str) -> str | None:
        """
        Extract audio as 16kHz mono WAV — optimised for Whisper transcription.
        """
        try:
            cmd = [
                "ffmpeg",
                "-i", file_path,
                "-ac", "1",              # mono
                "-ar", "16000",          # 16kHz sample rate (Whisper requirement)
                "-vn",                   # no video
                "-acodec", "pcm_s16le", # PCM WAV format
                output_path,
                "-y",
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

            if result.returncode != 0:
                raise RuntimeError(f"FFmpeg audio extraction error: {result.stderr[-300:]}")

            if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                return output_path
            return None

        except Exception as e:
            print(f"[WARN] Audio extraction failed ({e})")
            return None

    # ── Simulation Fallback ───────────────────────────────────────────────────

    def _simulated_extract(self, file_path: str) -> dict:
        """
        Generate plausible video metadata from file size.
        Used when FFmpeg is unavailable.
        """
        size_mb = (
            os.path.getsize(file_path) / (1024 * 1024)
            if os.path.exists(file_path)
            else 10.0
        )
        # Typical short-form video bitrate ~5–15 Mbps → ~0.6–1.8 MB/s
        duration = min(max(size_mb / 1.2 + random.uniform(-3, 5), 8), 90)
        fps = float(random.choice([24, 30, 60]))
        width, height = 1080, 1920

        return {
            "duration": round(duration, 3),
            "fps": fps,
            "width": width,
            "height": height,
            "aspect_ratio": "9:16",
            "frame_count": int(duration * fps),
            "has_audio": True,
            "codec": "h264 (simulated)",
            "bit_rate": 8_000_000,
        }

    # ── Helpers ───────────────────────────────────────────────────────────────

    @staticmethod
    def _aspect_ratio(width: int, height: int) -> str:
        g = gcd(width, height)
        return f"{width // g}:{height // g}"
