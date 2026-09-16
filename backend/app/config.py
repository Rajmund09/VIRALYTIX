from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    APP_ENV: str = "development"
    SECRET_KEY: str = "viralytix-dev-secret-key"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Database
    DATABASE_URL: str = "sqlite:///./viralytix.db"

    # File Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 200

    # ML Model
    MODEL_PATH: str = "./app/models/viral_model.pkl"
    CLASSIFIER_PATH: str = "./app/models/viral_classifier.pkl"

    # Feature Flags
    USE_REAL_FFMPEG: bool = False
    USE_REAL_WHISPER: bool = False
    WHISPER_MODEL_SIZE: str = "tiny"

    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
