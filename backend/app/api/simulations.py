"""
VIRALYTIX — Simulations API
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Simulation, VideoFeatures

router = APIRouter(prefix="/simulations", tags=["Simulations"])


@router.get("/{video_id}")
def get_simulation(video_id: int, db: Session = Depends(get_db)):
    """Get simulation results for a video."""
    sim = db.query(Simulation).filter(Simulation.video_id == video_id).first()
    if not sim:
        raise HTTPException(status_code=404, detail="Simulation not found. Run /api/videos/{id}/process first.")

    return {
        "video_id": video_id,
        "persona_count": sim.persona_count,
        "aggregate": {
            "watched": sim.watched,
            "completed": sim.completed,
            "liked": sim.liked,
            "commented": sim.commented,
            "shared": sim.shared,
            "saved": sim.saved,
            "skipped": sim.skipped,
        },
        "rates": {
            "watch_rate": sim.watch_rate,
            "completion_rate": sim.completion_rate,
            "like_rate": sim.like_rate,
            "comment_rate": sim.comment_rate,
            "share_rate": sim.share_rate,
            "save_rate": sim.save_rate,
        },
        "estimated_reach": sim.estimated_reach,
        "persona_breakdown": sim.persona_breakdown,
        "created_at": sim.created_at,
    }


@router.get("/personas/list")
def list_personas(db: Session = Depends(get_db)):
    """List all defined audience personas."""
    from app.database.models import Persona
    personas = db.query(Persona).filter(Persona.is_active == True).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "interest_level": p.interest_level,
            "attention_span": p.attention_span,
            "share_tendency": p.share_tendency,
            "comment_tendency": p.comment_tendency,
            "skip_probability": p.skip_probability,
        }
        for p in personas
    ]
