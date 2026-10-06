from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "PROOFWEAVE API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "proofweave_super_secret_hackathon_key_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    @property
    def DATABASE_URL(self) -> str:
        # On Vercel (serverless), only /tmp is writable
        env_url = os.environ.get("DATABASE_URL")
        if env_url:
            return env_url
        if os.environ.get("VERCEL") or os.environ.get("VERCEL_ENV"):
            return "sqlite:////tmp/proofweave.db"
        return "sqlite:///./proofweave.db"

    class Config:
        env_file = ".env"

settings = Settings()
