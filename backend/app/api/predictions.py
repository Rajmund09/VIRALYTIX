"""
VIRALYTIX — Predictions API
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Prediction, VideoFeatures, Simulation

router = APIRouter(prefix="/predictions", tags=["Predictions"])


@router.get("/{video_id}")
def get_prediction(video_id: int, db: Session = Depends(get_db)):
    """Get the full prediction result for a video."""
    pred = db.query(Prediction).filter(Prediction.video_id == video_id).first()
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found. Run /api/videos/{id}/process first.")

    vf = db.query(VideoFeatures).filter(VideoFeatures.video_id == video_id).first()
    features_dict = {}
    if vf:
        features_dict = {
            "hook_score": vf.hook_score,
            "scene_change_rate": vf.scene_change_rate,
            "avg_brightness": vf.avg_brightness,
            "motion_score": vf.motion_score,
            "text_density": vf.text_density,
            "speech_rate": vf.speech_rate,
            "silence_ratio": vf.silence_ratio,
            "audio_energy": vf.audio_energy,
            "word_count": vf.word_count,
            "cta_score": vf.cta_score,
            "question_present": vf.question_present,
            "transcript": vf.transcript,
            "retention_curve": vf.retention_curve,
            "hook_windows": vf.hook_windows,
        }

    return {
        "video_id": video_id,
        "virality_score": pred.virality_score,
        "confidence_low": pred.confidence_low,
        "confidence_high": pred.confidence_high,
        "performance_category": pred.performance_category,
        "predicted_reach": pred.predicted_reach,
        "predicted_engagement": pred.predicted_engagement,
        "predicted_retention": pred.predicted_retention,
        "shap_values": pred.shap_values,
        "recommendations": pred.recommendations,
        "model_version": pred.model_version,
        "model_type": pred.model_type,
        "created_at": pred.created_at,
        "features": features_dict,
    }


@router.get("/{video_id}/explain")
def get_explanation(video_id: int, db: Session = Depends(get_db)):
    """Get SHAP explanations and recommendations for a prediction."""
    pred = db.query(Prediction).filter(Prediction.video_id == video_id).first()
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found.")

    return {
        "video_id": video_id,
        "virality_score": pred.virality_score,
        "shap_values": pred.shap_values,
        "recommendations": pred.recommendations,
    }


@router.post("/compare")
def compare_videos(
    video_id_a: int,
    video_id_b: int,
    db: Session = Depends(get_db)
):
    """Compare two videos: return per-factor deltas (Phase 9 A/B)."""
    pred_a = db.query(Prediction).filter(Prediction.video_id == video_id_a).first()
    pred_b = db.query(Prediction).filter(Prediction.video_id == video_id_b).first()

    if not pred_a:
        raise HTTPException(status_code=404, detail=f"Prediction not found for video {video_id_a}")
    if not pred_b:
        raise HTTPException(status_code=404, detail=f"Prediction not found for video {video_id_b}")

    score_delta = round((pred_b.virality_score or 0) - (pred_a.virality_score or 0), 2)
    reach_delta = (pred_b.predicted_reach or 0) - (pred_a.predicted_reach or 0)
    engagement_delta = round((pred_b.predicted_engagement or 0) - (pred_a.predicted_engagement or 0), 4)
    retention_delta = round((pred_b.predicted_retention or 0) - (pred_a.predicted_retention or 0), 4)

    return {
        "video_a": {"id": video_id_a, "virality_score": pred_a.virality_score},
        "video_b": {"id": video_id_b, "virality_score": pred_b.virality_score},
        "deltas": {
            "virality_score": score_delta,
            "predicted_reach": reach_delta,
            "predicted_engagement": round(engagement_delta * 100, 2),  # as %
            "predicted_retention": round(retention_delta * 100, 2),   # as %
        },
        "summary": (
            f"Video B has {'higher' if score_delta > 0 else 'lower'} predicted performance "
            f"({abs(score_delta):.1f} pts difference in Virality Score)."
        )
    }
