"""
VIRALYTIX — Persona Engine (Phase 5 full implementation)
Phase 1: Mathematical persona definitions ready to use.
"""
import random
import math
from dataclasses import dataclass, field
from typing import List, Dict


@dataclass
class Persona:
    name: str
    category: str
    interest_level: float      # 0-1
    attention_span: float      # 0-1
    share_tendency: float      # 0-1
    comment_tendency: float    # 0-1
    skip_probability: float    # 0-1
    interest_vector: List[str] = field(default_factory=list)

    def compute_engagement(self, features: dict) -> dict:
        """
        Compute engagement probabilities for this persona given a video's feature vector.
        Uses explicit weighted formulas — NOT LLM judgement.

        Returns probabilities for: watch, completion, like, comment, share
        """
        hook_norm = features.get("hook_score", 70) / 100.0
        motion = features.get("motion_score", 0.5)
        brightness = features.get("avg_brightness", 0.6)
        cta = features.get("cta_score", 0.4)
        speech_rate = features.get("speech_rate", 140) / 200.0  # normalize
        audio_energy = features.get("audio_energy", 0.7)
        scene_rate = min(features.get("scene_change_rate", 1.5) / 4.0, 1.0)

        # Watch probability = f(hook, persona interest, skip_probability)
        watch_prob = (
            0.40 * hook_norm +
            0.35 * self.interest_level +
            0.25 * (1 - self.skip_probability)
        )
        watch_prob = self._clamp(watch_prob + random.gauss(0, 0.04))

        # Completion probability = f(attention span, hook, motion/pacing)
        completion_prob = (
            0.45 * self.attention_span +
            0.30 * hook_norm +
            0.15 * scene_rate +
            0.10 * (1 - self.skip_probability)
        )
        completion_prob = self._clamp(completion_prob * watch_prob + random.gauss(0, 0.03))

        # Like probability = f(completion, interest, cta)
        like_prob = (
            0.50 * completion_prob +
            0.30 * self.interest_level +
            0.20 * cta
        )
        like_prob = self._clamp(like_prob * 0.9 + random.gauss(0, 0.04))

        # Comment probability = f(comment_tendency, engagement quality)
        comment_prob = (
            0.60 * self.comment_tendency +
            0.25 * completion_prob +
            0.15 * cta
        )
        comment_prob = self._clamp(comment_prob * like_prob + random.gauss(0, 0.02))

        # Share probability = f(share_tendency, virality signals)
        share_prob = (
            0.50 * self.share_tendency +
            0.30 * like_prob +
            0.20 * hook_norm
        )
        share_prob = self._clamp(share_prob * 0.85 + random.gauss(0, 0.03))

        return {
            "watch_probability": round(watch_prob, 4),
            "completion_probability": round(completion_prob, 4),
            "like_probability": round(like_prob, 4),
            "comment_probability": round(comment_prob, 4),
            "share_probability": round(share_prob, 4),
        }

    @staticmethod
    def _clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
        return max(low, min(high, value))


class PersonaEngine:
    """Manages the set of audience personas used for engagement simulation."""

    DEFAULT_PERSONAS = [
        Persona("Alex", "Tech Enthusiast", 0.92, 0.76, 0.71, 0.54, 0.21,
                ["AI", "ML", "programming", "startups"]),
        Persona("Sam", "Student", 0.68, 0.58, 0.55, 0.42, 0.35,
                ["education", "career", "technology", "productivity"]),
        Persona("Jordan", "Founder", 0.84, 0.62, 0.48, 0.32, 0.38,
                ["SaaS", "business", "AI", "startups"]),
        Persona("Casey", "Creator", 0.78, 0.70, 0.82, 0.65, 0.28,
                ["content", "video", "social media", "marketing"]),
        Persona("Morgan", "Designer", 0.72, 0.67, 0.60, 0.45, 0.30,
                ["UI", "UX", "creative tools", "design"]),
        Persona("Riley", "General Viewer", 0.42, 0.45, 0.22, 0.15, 0.58,
                ["entertainment", "trending", "general"]),
    ]

    def __init__(self):
        self.personas = self.DEFAULT_PERSONAS

    def get_personas(self) -> List[Persona]:
        return self.personas

    def run_all(self, features: dict) -> Dict[str, dict]:
        """Run engagement computation for all personas."""
        return {
            p.category: p.compute_engagement(features)
            for p in self.personas
        }
