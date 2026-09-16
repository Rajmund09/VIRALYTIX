"""
VIRALYTIX — ML Predictor (v2.0 Upgrade)
- Real SHAP TreeExplainer attribution (Upgrade 2.1)
- Virality confidence interval via bootstrap noise (Upgrade 2.3)
- Formula fallback if models not loaded
"""
import os
import math
import random
import numpy as np
from app.config import settings

FEATURES_LIST = [
    "hook_score", "scene_change_rate", "avg_brightness", "motion_score",
    "text_density", "speech_rate", "silence_ratio", "audio_energy",
    "word_count", "cta_score", "question_present",
    "completion_rate", "watch_rate", "like_rate", "share_rate", "comment_rate"
]

FEATURE_LABELS = {
    "hook_score":        "Hook Score",
    "scene_change_rate": "Scene Change Rate",
    "avg_brightness":    "Avg Brightness",
    "motion_score":      "Motion Intensity",
    "text_density":      "Text / Caption Density",
    "speech_rate":       "Speech Rate (WPM)",
    "silence_ratio":     "Silence Ratio",
    "audio_energy":      "Audio Energy (RMS)",
    "word_count":        "Word Count",
    "cta_score":         "Call-to-Action Score",
    "question_present":  "Question Detected",
    "completion_rate":   "Completion Rate",
    "watch_rate":        "Watch Rate",
    "like_rate":         "Like Rate",
    "share_rate":        "Share Rate",
    "comment_rate":      "Comment Rate",
}


class Predictor:
    """
    Predicts Virality Score and Performance Category for a video.
    v2.0: Uses real SHAP TreeExplainer + confidence intervals.
    """

    def __init__(self):
        self.model = None
        self.classifier = None
        self._shap_explainer = None

        if os.path.exists(settings.MODEL_PATH):
            try:
                import joblib
                self.model = joblib.load(settings.MODEL_PATH)
                self.classifier = joblib.load(settings.CLASSIFIER_PATH)
                print("[OK] Loaded trained ML models from disk")

                # Pre-build SHAP explainer on load (fast at inference time)
                try:
                    import shap
                    self._shap_explainer = shap.TreeExplainer(self.model)
                    print("[OK] SHAP TreeExplainer initialized")
                except Exception as e:
                    print(f"[WARN] SHAP init failed ({e}), using approximation fallback")

            except Exception as e:
                print(f"[WARN] Could not load ML models ({e}), using formula fallback")

    def predict(self, features: dict, sim_result: dict) -> dict:
        predicted_reach = sim_result.get("estimated_reach", 5000)

        x_dict = {
            "hook_score":        features.get("hook_score", 70.0),
            "scene_change_rate": features.get("scene_change_rate", 1.0),
            "avg_brightness":    features.get("avg_brightness", 0.6),
            "motion_score":      features.get("motion_score", 0.4),
            "text_density":      features.get("text_density", 0.2),
            "speech_rate":       features.get("speech_rate", 120.0),
            "silence_ratio":     features.get("silence_ratio", 0.15),
            "audio_energy":      features.get("audio_energy", 0.4),
            "word_count":        features.get("word_count", 50),
            "cta_score":         features.get("cta_score", 0.35),
            "question_present":  int(features.get("question_present", False)),
            "completion_rate":   sim_result.get("completion_rate", 0.4),
            "watch_rate":        sim_result.get("watch_rate", 0.5),
            "like_rate":         sim_result.get("like_rate", 0.2),
            "share_rate":        sim_result.get("share_rate", 0.05),
            "comment_rate":      sim_result.get("comment_rate", 0.02),
        }

        virality_score = self._compute_virality_score(sim_result)
        performance_category = self._categorize(virality_score)
        confidence_low = virality_score
        confidence_high = virality_score

        if self.model is not None and self.classifier is not None:
            try:
                import pandas as pd
                df = pd.DataFrame([x_dict])

                # --- Primary Prediction ---
                pred_val = self.model.predict(df)[0]
                virality_score = round(float(max(0.0, min(100.0, pred_val))), 1)

                pred_cat_idx = self.classifier.predict(df)[0]
                performance_category = ["Low", "Medium", "High"][int(pred_cat_idx)]

                # --- Confidence Interval via Bootstrap Noise (Upgrade 2.3) ---
                bootstrap_scores = []
                for _ in range(15):
                    noisy = df.copy()
                    noisy += np.random.normal(0, 0.015, noisy.shape)
                    s = float(self.model.predict(noisy)[0])
                    bootstrap_scores.append(max(0.0, min(100.0, s)))

                std = float(np.std(bootstrap_scores))
                confidence_low  = round(max(0.0,   virality_score - 1.5 * std), 1)
                confidence_high = round(min(100.0, virality_score + 1.5 * std), 1)

                print(f"[ML Inference] Virality: {virality_score} [{confidence_low}–{confidence_high}], Category: {performance_category}")

            except Exception as e:
                print(f"[WARN] ML Inference failed ({e}), falling back to formula")
                virality_score = self._compute_virality_score(sim_result)
                performance_category = self._categorize(virality_score)

        shap_values = self._compute_shap(x_dict, virality_score)
        recommendations = self._generate_recommendations(features, sim_result, shap_values)

        return {
            "virality_score":       virality_score,
            "confidence_low":       confidence_low,
            "confidence_high":      confidence_high,
            "performance_category": performance_category,
            "predicted_reach":      predicted_reach,
            "predicted_engagement": round(
                sim_result.get("watch_rate", 0.5) * sim_result.get("completion_rate", 0.4), 4
            ),
            "predicted_retention":  round(sim_result.get("completion_rate", 0.4), 4),
            "shap_values":          shap_values,
            "recommendations":      recommendations,
        }

    def _compute_shap(self, x_dict: dict, virality_score: float) -> list:
        """Real SHAP TreeExplainer values, falls back to approximation if unavailable."""
        if self._shap_explainer is not None:
            try:
                import pandas as pd
                df = pd.DataFrame([x_dict])
                raw_shap = self._shap_explainer.shap_values(df)[0]  # shape: (n_features,)

                result = []
                for i, feature in enumerate(FEATURES_LIST):
                    val = float(raw_shap[i])
                    result.append({
                        "feature":   feature,
                        "label":     FEATURE_LABELS.get(feature, feature),
                        "impact":    round(abs(val), 3),
                        "direction": "positive" if val >= 0 else "negative",
                    })

                result.sort(key=lambda x: x["impact"], reverse=True)
                return result

            except Exception as e:
                print(f"[WARN] SHAP inference failed ({e}), using approximation")

        return self._approximate_shap(x_dict)

    def _approximate_shap(self, x_dict: dict) -> list:
        """Rule-based SHAP approximation when TreeExplainer is unavailable."""
        contributions = [
            {"feature": "completion_rate",   "label": "Completion Rate",  "impact": round(x_dict.get("completion_rate", 0) * 30, 2)},
            {"feature": "watch_rate",        "label": "Watch Rate",       "impact": round(x_dict.get("watch_rate", 0) * 25, 2)},
            {"feature": "share_rate",        "label": "Share Rate",       "impact": round(x_dict.get("share_rate", 0) * 20, 2)},
            {"feature": "hook_score",        "label": "Hook Score",       "impact": round((x_dict.get("hook_score", 70) - 50) / 10, 2)},
            {"feature": "like_rate",         "label": "Like Rate",        "impact": round(x_dict.get("like_rate", 0) * 15, 2)},
            {"feature": "comment_rate",      "label": "Comment Rate",     "impact": round(x_dict.get("comment_rate", 0) * 10, 2)},
            {"feature": "cta_score",         "label": "Call-to-Action",   "impact": round((x_dict.get("cta_score", 0.4) - 0.5) * 8, 2)},
            {"feature": "audio_energy",      "label": "Audio Energy",     "impact": round((x_dict.get("audio_energy", 0.7) - 0.5) * 6, 2)},
            {"feature": "scene_change_rate", "label": "Visual Variety",   "impact": round((x_dict.get("scene_change_rate", 1.5) - 1.0) * 3, 2)},
        ]
        for c in contributions:
            c["direction"] = "positive" if c["impact"] >= 0 else "negative"
            c["impact"] = abs(c["impact"])
        contributions.sort(key=lambda x: x["impact"], reverse=True)
        return contributions

    def _compute_virality_score(self, sim_result: dict) -> float:
        R = sim_result.get("completion_rate", 0)
        W = sim_result.get("watch_rate", 0)
        S = sim_result.get("share_rate", 0)
        L = sim_result.get("like_rate", 0)
        C = sim_result.get("comment_rate", 0)
        raw = 0.30 * R + 0.25 * W + 0.20 * S + 0.15 * L + 0.10 * C
        return round(max(0.0, min(100.0, raw * 100)), 1)

    @staticmethod
    def _categorize(score: float) -> str:
        if score >= 65:
            return "High"
        elif score >= 35:
            return "Medium"
        return "Low"

    def _generate_recommendations(self, features: dict, sim_result: dict, shap_values: list) -> list:
        recs = []
        hook = features.get("hook_score", 70)
        if hook < 60:
            recs.append(
                f"Your Hook Score is {hook:.0f}/100. Open with a bold claim, question, or "
                "fast visual change in the first 3 seconds to dramatically improve retention."
            )
        completion = sim_result.get("completion_rate", 0)
        if completion < 0.45:
            recs.append(
                f"Estimated completion rate is {completion*100:.0f}%. Consider shortening the "
                "video or moving your most compelling content to the first 10 seconds."
            )
        share = sim_result.get("share_rate", 0)
        if share < 0.10:
            recs.append(
                "Share rate is low. Add a clear, emotionally resonant moment or a CTA like "
                "'Share this with someone who needs to see it' near the end."
            )
        cta = features.get("cta_score", 0.4)
        if cta < 0.35:
            recs.append(
                "No strong call-to-action detected. Include a direct CTA (like, follow, comment, share) "
                "within the last 5 seconds to improve engagement signals."
            )
        scene_rate = features.get("scene_change_rate", 1.5)
        if scene_rate < 0.8:
            recs.append(
                "Low visual variety detected (slow scene change rate). "
                "Add cuts, text overlays, or B-roll to maintain viewer attention."
            )
        if not recs:
            recs.append(
                "Strong overall signals detected! Focus on consistency — "
                "posting at peak times and using trending audio can further boost reach."
            )
        return recs
