"""
VIRALYTIX — FastAPI Application Entry Point
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from app.config import settings
from app.database.database import engine, Base
from app.middleware.rate_limiter import RateLimitMiddleware

# Import all models so SQLAlchemy knows about them before creating tables
import app.database.models  # noqa: F401

# Import routers
from app.api import videos, predictions, simulations


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Create all DB tables on startup (idempotent)
    Base.metadata.create_all(bind=engine)

    # Seed default personas if not already present
    from app.database.database import SessionLocal
    from app.database.models import Persona
    db = SessionLocal()
    try:
        if db.query(Persona).count() == 0:
            _seed_personas(db)
    finally:
        db.close()

    # Create upload directory
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    print(f"[OK] VIRALYTIX Backend started -- ENV: {settings.APP_ENV}")
    print(f"   DB: {settings.DATABASE_URL}")
    print(f"   FFmpeg mode: {'REAL' if settings.USE_REAL_FFMPEG else 'SIMULATION'}")
    print(f"   Whisper mode: {'REAL' if settings.USE_REAL_WHISPER else 'SIMULATION'}")

    yield
    print("VIRALYTIX Backend shutting down...")


def _seed_personas(db):
    """Seed the 6 default audience personas."""
    from app.database.models import Persona
    default_personas = [
        Persona(
            name="Alex — Tech Enthusiast",
            category="Tech Enthusiast",
            interest_level=0.92,
            attention_span=0.76,
            share_tendency=0.71,
            comment_tendency=0.54,
            skip_probability=0.21,
            interest_vector=["AI", "ML", "programming", "startups", "tech"]
        ),
        Persona(
            name="Sam — Student",
            category="Student",
            interest_level=0.68,
            attention_span=0.58,
            share_tendency=0.55,
            comment_tendency=0.42,
            skip_probability=0.35,
            interest_vector=["education", "career", "technology", "productivity"]
        ),
        Persona(
            name="Jordan — Founder",
            category="Founder",
            interest_level=0.84,
            attention_span=0.62,
            share_tendency=0.48,
            comment_tendency=0.32,
            skip_probability=0.38,
            interest_vector=["SaaS", "business", "AI", "startups", "growth"]
        ),
        Persona(
            name="Casey — Content Creator",
            category="Creator",
            interest_level=0.78,
            attention_span=0.70,
            share_tendency=0.82,
            comment_tendency=0.65,
            skip_probability=0.28,
            interest_vector=["content", "video", "social media", "marketing", "trends"]
        ),
        Persona(
            name="Morgan — Designer",
            category="Designer",
            interest_level=0.72,
            attention_span=0.67,
            share_tendency=0.60,
            comment_tendency=0.45,
            skip_probability=0.30,
            interest_vector=["UI", "UX", "creative tools", "design", "aesthetics"]
        ),
        Persona(
            name="Riley — General Viewer",
            category="General Viewer",
            interest_level=0.42,
            attention_span=0.45,
            share_tendency=0.22,
            comment_tendency=0.15,
            skip_probability=0.58,
            interest_vector=["entertainment", "trending", "general"]
        ),
    ]
    db.add_all(default_personas)
    db.commit()
    print(f"[OK] Seeded {len(default_personas)} default personas")


# ── Create FastAPI app (Docs Disabled in Production) ──────────────────────────
is_prod = settings.APP_ENV.lower() == "production"

app = FastAPI(
    title="VIRALYTIX API",
    description="Machine Learning–Based Social Media Virality Prediction System",
    version="1.0.0",
    docs_url=None if is_prod else "/docs",
    redoc_url=None if is_prod else "/redoc",
    openapi_url=None if is_prod else "/openapi.json",
    lifespan=lifespan,
)

# ── Global Exception Masking (Zero Traceback Leakage) ─────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception):
    import traceback
    print(f"[SECURITY ALERT] Unhandled exception on {request.method} {request.url.path}: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal processing error occurred. Security team has been notified."}
    )

# ── Rate Limiting (DoS Protection) ───────────────────────────────────────────
app.add_middleware(RateLimitMiddleware)

# ── CORS Whitelist ────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(videos.router, prefix="/api")
app.include_router(predictions.router, prefix="/api")
app.include_router(simulations.router, prefix="/api")


# ── Root Endpoints ────────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
def root():
    resp = {
        "app": "VIRALYTIX API",
        "version": "1.0.0",
        "status": "running",
    }
    if not is_prod:
        resp["docs"] = "/docs"
        resp["redoc"] = "/redoc"
    return resp


@app.get("/health", tags=["Root"])
def health():
    return JSONResponse({"status": "healthy", "env": settings.APP_ENV})
