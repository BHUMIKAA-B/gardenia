from pydantic_settings import BaseSettings
import os

def _resolve_database_url() -> str:
    """Resolve the database URL, using /tmp on Vercel serverless."""
    env_url = os.environ.get("DATABASE_URL")
    if env_url:
        return env_url
    if os.environ.get("VERCEL") or os.environ.get("VERCEL_ENV"):
        return "sqlite:////tmp/proofweave.db"
    return "sqlite:///./proofweave.db"

class Settings(BaseSettings):
    PROJECT_NAME: str = "PROOFWEAVE API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "proofweave_super_secret_hackathon_key_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = _resolve_database_url()

    class Config:
        env_file = ".env"

settings = Settings()
