from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    videos = relationship("Video", back_populates="user")


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    filename = Column(String(500), nullable=False)
    original_filename = Column(String(500), nullable=True)
    duration = Column(Float, nullable=True)          # seconds
    fps = Column(Float, nullable=True)
    resolution_w = Column(Integer, nullable=True)
    resolution_h = Column(Integer, nullable=True)
    aspect_ratio = Column(String(20), nullable=True)  # e.g. "9:16"
    frame_count = Column(Integer, nullable=True)
    has_audio = Column(Boolean, default=True)
    file_size_mb = Column(Float, nullable=True)
    status = Column(String(50), default="uploaded")   # uploaded, processing, done, error
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="videos")
    features = relationship("VideoFeatures", back_populates="video", uselist=False)
    simulation = relationship("Simulation", back_populates="video", uselist=False)
    prediction = relationship("Prediction", back_populates="video", uselist=False)


class VideoFeatures(Base):
    __tablename__ = "video_features"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), unique=True, nullable=False)

    # Visual features
    hook_score = Column(Float, nullable=True)           # 0-100
    scene_change_rate = Column(Float, nullable=True)    # changes per second
    avg_brightness = Column(Float, nullable=True)       # 0-1
    motion_score = Column(Float, nullable=True)         # 0-1
    text_density = Column(Float, nullable=True)         # 0-1 (on-screen text presence)

    # Audio features
    speech_rate = Column(Float, nullable=True)          # words per minute
    silence_ratio = Column(Float, nullable=True)        # 0-1
    audio_energy = Column(Float, nullable=True)         # 0-1

    # Speech / text features
    word_count = Column(Integer, nullable=True)
    cta_score = Column(Float, nullable=True)            # 0-1 (call-to-action presence)
    question_present = Column(Boolean, default=False)
    transcript = Column(Text, nullable=True)

    # Retention risk curve (second-by-second, stored as JSON array)
    retention_curve = Column(JSON, nullable=True)

    # Hook window scores (JSON: {"0-3": 91, "3-6": 84, ...})
    hook_windows = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    video = relationship("Video", back_populates="features")


class Persona(Base):
    __tablename__ = "personas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)     # e.g. "Tech Enthusiast"
    interest_level = Column(Float, nullable=False)     # 0-1
    attention_span = Column(Float, nullable=False)     # 0-1
    share_tendency = Column(Float, nullable=False)     # 0-1
    comment_tendency = Column(Float, nullable=False)   # 0-1
    skip_probability = Column(Float, nullable=False)   # 0-1
    interest_vector = Column(JSON, nullable=True)      # list of interest tags

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), unique=True, nullable=False)

    persona_count = Column(Integer, default=100)

    # Aggregate simulation results
    watched = Column(Integer, nullable=True)
    completed = Column(Integer, nullable=True)
    liked = Column(Integer, nullable=True)
    commented = Column(Integer, nullable=True)
    shared = Column(Integer, nullable=True)
    saved = Column(Integer, nullable=True)
    skipped = Column(Integer, nullable=True)

    # Derived rates (0-1)
    watch_rate = Column(Float, nullable=True)
    completion_rate = Column(Float, nullable=True)
    like_rate = Column(Float, nullable=True)
    comment_rate = Column(Float, nullable=True)
    share_rate = Column(Float, nullable=True)
    save_rate = Column(Float, nullable=True)

    # Estimated relative reach
    estimated_reach = Column(Integer, nullable=True)

    # Per-persona breakdown (JSON: {"Tech Enthusiast": {"watch": 0.89, ...}, ...})
    persona_breakdown = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    video = relationship("Video", back_populates="simulation")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), unique=True, nullable=False)

    # Primary outputs
    virality_score = Column(Float, nullable=True)           # 0-100
    performance_category = Column(String(20), nullable=True) # Low / Medium / High

    # Sub-predictions
    predicted_reach = Column(Integer, nullable=True)
    predicted_engagement = Column(Float, nullable=True)      # 0-1
    predicted_retention = Column(Float, nullable=True)       # 0-1

    # SHAP values (JSON: [{"feature": "hook_score", "impact": 11.2, "direction": "positive"}, ...])
    shap_values = Column(JSON, nullable=True)

    # Recommendations (JSON list of strings)
    recommendations = Column(JSON, nullable=True)

    # Confidence interval (from bootstrap noise, Upgrade 2.3)
    confidence_low = Column(Float, nullable=True)
    confidence_high = Column(Float, nullable=True)

    # Model metadata
    model_version = Column(String(50), default="v2")
    model_type = Column(String(50), default="xgboost")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    video = relationship("Video", back_populates="prediction")
