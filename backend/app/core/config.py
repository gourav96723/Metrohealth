import os
from pydantic import BaseModel

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEFAULT_DB_PATH = os.path.join(BACKEND_DIR, "healthsense.db").replace("\\", "/")

class Settings(BaseModel):
    PROJECT_NAME: str = "HealthSense AI"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "healthsense-insecure-dev-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # SQLite default anchored to backend directory, can be overridden with postgresql://...
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")
    
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    # Emergency screening helpline defaults (Configurable)
    EMERGENCY_PHONE: str = os.getenv("EMERGENCY_PHONE", "100 / 112 / 108")

settings = Settings()
