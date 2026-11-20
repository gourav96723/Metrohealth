from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from .core.config import settings
from .core.database import Base, engine
from .api import api_router

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("healthsense-ai")

def auto_init_db():
    """Auto-create tables, check column migrations, and seed default test accounts on startup."""
    try:
        from .core.database import SessionLocal, Base, engine
        from .models.user import User
        from .core.security import hash_password
        from sqlalchemy import text

        Base.metadata.create_all(bind=engine)
        
        # SQLite schema safety check
        if settings.DATABASE_URL.startswith("sqlite"):
            with engine.connect() as conn:
                try:
                    res = conn.execute(text("PRAGMA table_info(users)")).fetchall()
                    existing_cols = [r[1] for r in res]
                    for col_name, col_type in [
                        ("role", "VARCHAR(50) DEFAULT 'patient'"),
                        ("specialization", "VARCHAR(255)"),
                        ("license_number", "VARCHAR(100)"),
                        ("clinic_hospital", "VARCHAR(255)"),
                        ("experience_years", "INTEGER")
                    ]:
                        if col_name not in existing_cols:
                            conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                    conn.commit()
                except Exception:
                    pass

        db = SessionLocal()
        try:
            if not db.query(User).filter(User.email == "dr.rajesh@metrohealth.ai").first():
                db.add(User(
                    email="dr.rajesh@metrohealth.ai",
                    hashed_password=hash_password("Doctor2026!"),
                    full_name="Dr. Rajesh Sharma, MS (Ortho)",
                    role="therapist",
                    specialization="Chief Orthopaedic & Sports Physical Rehabilitation Specialist",
                    license_number="MCI-84729-D / DPT-9921",
                    clinic_hospital="MetroHealth Super Speciality Hospital, New Delhi",
                    experience_years=14,
                    phone_number="+91 96537 66889",
                    is_active=True
                ))
            if not db.query(User).filter(User.email == "demo@healthsense.ai").first():
                db.add(User(
                    email="demo@healthsense.ai",
                    hashed_password=hash_password("HealthSense2026!"),
                    full_name="Aarav Sharma",
                    age=28,
                    gender="Male",
                    phone_number="+91 96537 66889",
                    role="patient",
                    is_active=True
                ))
            db.commit()
        finally:
            db.close()
        logger.info("Database initialized and default accounts verified.")
    except Exception as err:
        logger.warning(f"Auto DB init: {err}")

auto_init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "HealthSense AI: An AI-Based Visual Health and Physiotherapy Assistance System. "
        "Provides educational posture observations, structured symptom evaluation, "
        "clinical red-flag safety screening, and physiotherapy guidance."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local Vite frontend & testing clients
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

# Mount API routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/", tags=["Health"])
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "healthy",
        "message": "HealthSense AI API is operational. Visit /docs for OpenAPI documentation.",
        "disclaimer": "Educational and movement-assistance tool only. Not a medical diagnostic system."
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
