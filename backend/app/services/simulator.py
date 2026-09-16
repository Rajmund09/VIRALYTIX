"""
VIRALYTIX — Simulator Service
Aggregates persona interactions across 100 simulated viewers.
"""
import random
import math
from app.services.persona_engine import PersonaEngine


class Simulator:
    """
    Runs a video through a simulated population of N personas
    and aggregates engagement outcomes.
    """

    POPULATION_SIZE = 100

    def __init__(self, engine: PersonaEngine):
        self.engine = engine

    def run(self, features: dict) -> dict:
        personas = self.engine.get_personas()
        persona_results = {}

        total_watched = 0
        total_completed = 0
        total_liked = 0
        total_commented = 0
        total_shared = 0
        total_saved = 0
        total_skipped = 0

        # Distribute population across personas (roughly equal share)
        per_persona = self.POPULATION_SIZE // len(personas)

        for persona in personas:
            probs = persona.compute_engagement(features)

            # Simulate `per_persona` viewers with this persona profile
            watched = sum(1 for _ in range(per_persona)
                         if random.random() < probs["watch_probability"])
            completed = sum(1 for _ in range(watched)
                           if random.random() < probs["completion_probability"])
            liked = sum(1 for _ in range(watched)
                       if random.random() < probs["like_probability"])
            commented = sum(1 for _ in range(watched)
                           if random.random() < probs["comment_probability"])
            shared = sum(1 for _ in range(watched)
                        if random.random() < probs["share_probability"])
            saved = sum(1 for _ in range(liked)
                       if random.random() < 0.40)  # 40% of likers save
            skipped = per_persona - watched

            total_watched += watched
            total_completed += completed
            total_liked += liked
            total_commented += commented
            total_shared += shared
            total_saved += saved
            total_skipped += skipped

            persona_results[persona.category] = {
                "watch_rate": round(watched / per_persona, 4) if per_persona else 0,
                "completion_rate": round(completed / watched, 4) if watched else 0,
                "like_rate": round(liked / watched, 4) if watched else 0,
                "comment_rate": round(commented / watched, 4) if watched else 0,
                "share_rate": round(shared / watched, 4) if watched else 0,
            }

        # Compute aggregate rates
        safe_watched = max(total_watched, 1)

        watch_rate = round(total_watched / self.POPULATION_SIZE, 4)
        completion_rate = round(total_completed / safe_watched, 4)
        like_rate = round(total_liked / safe_watched, 4)
        comment_rate = round(total_commented / safe_watched, 4)
        share_rate = round(total_shared / safe_watched, 4)
        save_rate = round(total_saved / safe_watched, 4)

        # Composite engagement score for reach amplification
        engagement_score = (
            0.30 * completion_rate +
            0.25 * watch_rate +
            0.20 * share_rate +
            0.15 * like_rate +
            0.10 * comment_rate
        )

        # Estimated relative reach (seed 100, amplified by engagement score)
        estimated_reach = self._compute_reach(engagement_score)

        return {
            "persona_count": self.POPULATION_SIZE,
            "watched": total_watched,
            "completed": total_completed,
            "liked": total_liked,
            "commented": total_commented,
            "shared": total_shared,
            "saved": total_saved,
            "skipped": total_skipped,
            "watch_rate": watch_rate,
            "completion_rate": completion_rate,
            "like_rate": like_rate,
            "comment_rate": comment_rate,
            "share_rate": share_rate,
            "save_rate": save_rate,
            "estimated_reach": estimated_reach,
            "persona_breakdown": persona_results,
        }

    @staticmethod
    def _compute_reach(engagement_score: float) -> int:
        """
        Estimate relative reach from seed 100 viewers.
        Higher engagement = exponential reach amplification (distribution proxy model).
        Academic note: always report as 'estimated relative reach', not a platform guarantee.
        """
        # Amplification tiers
        if engagement_score >= 0.70:
            multiplier = random.uniform(150, 300)
        elif engagement_score >= 0.50:
            multiplier = random.uniform(50, 150)
        elif engagement_score >= 0.30:
            multiplier = random.uniform(15, 50)
        else:
            multiplier = random.uniform(3, 15)

        reach = int(100 * multiplier)
        return reach
