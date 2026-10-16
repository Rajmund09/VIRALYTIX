"""
VIRALYTIX — Video Upload & Management API
"""
import os
import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Video
from app.config import settings

router = APIRouter(prefix="/videos", tags=["Videos"])


# Maximum allowed video upload size: 50MB
MAX_FILE_SIZE = 50 * 1024 * 1024
CHUNK_SIZE = 64 * 1024
ALLOWED_EXTENSIONS = {".mp4", ".mov", ".webm", ".avi"}
ALLOWED_MIME_TYPES = {"video/mp4", "video/quicktime", "video/x-msvideo", "video/webm", "application/octet-stream"}


def is_valid_video_header(header: bytes) -> bool:
    """
    Validate binary magic signatures for legitimate video containers.
    Prevents executable scripts/shells disguised as video files.
    """
    if len(header) < 12:
        return False
    # MP4 / MOV container: 'ftyp' box in first 32 bytes
    if b"ftyp" in header[:32]:
        return True
    # WebM / MKV container: EBML header ID
    if header.startswith(b"\x1a\x45\xdf\xa3"):
        return True
    # AVI container: 'RIFF' + 'AVI '
    if header.startswith(b"RIFF") and header[8:12] == b"AVI ":
        return True
    return False


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Securely upload a short-form video file.
    Enforces MIME check, binary magic signature verification, strict 50MB size limit,
    and UUID file path isolation.
    """
    # 1. Validate extension
    raw_ext = Path(file.filename or "").suffix.lower()
    if raw_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension: '{raw_ext}'. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )

    # 2. Validate declared MIME type
    if file.content_type and file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid MIME type: {file.content_type}. Allowed: mp4, mov, avi, webm"
        )

    # 3. Read first chunk & inspect binary magic signature
    first_chunk = await file.read(CHUNK_SIZE)
    if not first_chunk or not is_valid_video_header(first_chunk):
        raise HTTPException(
            status_code=400,
            detail="Invalid video file: corrupted or prohibited binary signature."
        )

    # 4. Ensure upload directory exists
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    # 5. Secure UUID file name and path traversal prevention
    safe_original_name = os.path.basename(file.filename or "video.mp4")
    unique_filename = f"{uuid.uuid4().hex}{raw_ext}"
    file_path = upload_dir / unique_filename

    # 6. Stream and enforce strict 50MB size guard
    total_size = len(first_chunk)
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(first_chunk)
            while True:
                chunk = await file.read(CHUNK_SIZE)
                if not chunk:
                    break
                total_size += len(chunk)
                if total_size > MAX_FILE_SIZE:
                    buffer.close()
                    if file_path.exists():
                        file_path.unlink()
                    raise HTTPException(
                        status_code=413,
                        detail=f"Payload too large: video exceeds maximum limit of {MAX_FILE_SIZE // (1024 * 1024)}MB."
                    )
                buffer.write(chunk)
    except HTTPException:
        raise
    except Exception as e:
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail="Failed to securely store uploaded video.")

    file_size_mb = total_size / (1024 * 1024)

    # 7. Create DB record
    video = Video(
        filename=str(file_path),
        original_filename=safe_original_name,
        file_size_mb=round(file_size_mb, 2),
        status="uploaded",
    )
    db.add(video)
    db.commit()
    db.refresh(video)

    return {
        "id": video.id,
        "filename": video.original_filename,
        "file_size_mb": video.file_size_mb,
        "status": video.status,
        "created_at": video.created_at,
        "message": "Video uploaded successfully. Use /api/videos/{id}/process to begin analysis."
    }


@router.get("/{video_id}")
def get_video(video_id: int, db: Session = Depends(get_db)):
    """Retrieve video record and its current processing status."""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    return {
        "id": video.id,
        "original_filename": video.original_filename,
        "duration": video.duration,
        "fps": video.fps,
        "resolution": f"{video.resolution_w}x{video.resolution_h}" if video.resolution_w else None,
        "aspect_ratio": video.aspect_ratio,
        "has_audio": video.has_audio,
        "file_size_mb": video.file_size_mb,
        "status": video.status,
        "created_at": video.created_at,
    }


@router.post("/{video_id}/process")
def process_video(video_id: int, db: Session = Depends(get_db)):
    """
    Trigger the full analysis pipeline for an uploaded video:
    1. Video processing (metadata + frames + audio)
    2. Feature extraction
    3. Persona simulation
    4. ML prediction + SHAP
    Returns the complete prediction result.
    """
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    if video.status == "processing":
        raise HTTPException(status_code=409, detail="Video is already being processed")

    # Mark as processing
    video.status = "processing"
    db.commit()

    try:
        from app.services.video_processor import VideoProcessor
        from app.services.feature_extractor import FeatureExtractor
        from app.services.persona_engine import PersonaEngine
        from app.services.simulator import Simulator
        from app.ml.predict import Predictor

        # Step 1: Extract video metadata and process file tracks
        processor = VideoProcessor()
        metadata = processor.extract_metadata(video.filename)
        video.duration = metadata.get("duration")
        video.fps = metadata.get("fps")
        video.resolution_w = metadata.get("width")
        video.resolution_h = metadata.get("height")
        video.aspect_ratio = metadata.get("aspect_ratio")
        video.frame_count = metadata.get("frame_count")
        video.has_audio = metadata.get("has_audio", True)
        
        # Define output paths for frames and audio
        upload_dir = Path(settings.UPLOAD_DIR)
        frames_dir = upload_dir / f"{video.id}_frames"
        audio_path = upload_dir / f"{video.id}_audio.wav"
        
        # Sample frames and separate audio track
        sampled_frames = processor.extract_frames(video.filename, str(frames_dir))
        extracted_audio = None
        if video.has_audio:
            extracted_audio = processor.extract_audio(video.filename, str(audio_path))
            
        # Attach paths to metadata for downstream use
        metadata["frames_dir"] = str(frames_dir)
        metadata["sampled_frames"] = sampled_frames
        metadata["audio_path"] = extracted_audio
        db.commit()

        # Step 2: Extract features (upsert — delete old record first)
        extractor = FeatureExtractor()
        features = extractor.extract(video.filename, metadata)

        from app.database.models import VideoFeatures, Simulation, Prediction
        existing_vf = db.query(VideoFeatures).filter(VideoFeatures.video_id == video.id).first()
        if existing_vf:
            db.delete(existing_vf)
            db.commit()
        vf = VideoFeatures(video_id=video.id, **features)
        db.add(vf)
        db.commit()
        db.refresh(vf)

        # Step 3: Run persona simulation (upsert)
        engine = PersonaEngine()
        simulator = Simulator(engine)
        sim_result = simulator.run(features)

        existing_sim = db.query(Simulation).filter(Simulation.video_id == video.id).first()
        if existing_sim:
            db.delete(existing_sim)
            db.commit()
        sim = Simulation(video_id=video.id, **sim_result)
        db.add(sim)
        db.commit()

        # Step 4: Predict virality (upsert)
        predictor = Predictor()
        prediction = predictor.predict(features, sim_result)

        existing_pred = db.query(Prediction).filter(Prediction.video_id == video.id).first()
        if existing_pred:
            db.delete(existing_pred)
            db.commit()
        pred = Prediction(video_id=video.id, **prediction)
        db.add(pred)
        db.commit()

        # Mark done
        video.status = "done"
        db.commit()

        return {
            "video_id": video.id,
            "status": "done",
            "virality_score": prediction.get("virality_score"),
            "performance_category": prediction.get("performance_category"),
            "predicted_reach": prediction.get("predicted_reach"),
            "predicted_engagement": prediction.get("predicted_engagement"),
            "predicted_retention": prediction.get("predicted_retention"),
            "shap_values": prediction.get("shap_values"),
            "recommendations": prediction.get("recommendations"),
            "features": features,
        }

    except Exception as e:
        video.status = "error"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@router.get("/")
def list_videos(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """List all uploaded videos with their status."""
    videos = db.query(Video).offset(skip).limit(limit).all()
    return [
        {
            "id": v.id,
            "original_filename": v.original_filename,
            "duration": v.duration,
            "status": v.status,
            "created_at": v.created_at,
        }
        for v in videos
    ]
