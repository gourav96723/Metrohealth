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
            doctors = [
                {
                    "email": "dr.rajesh@metrohealth.ai",
                    "password": "Doctor2026!",
                    "full_name": "Dr. Rajesh Kumar Sharma",
                    "specialization": "Senior Orthopaedic & Sports Physiotherapy Specialist",
                    "license_number": "MCI-84729-D",
                    "clinic_hospital": "MetroHealth Super Speciality Hospital, New Delhi",
                    "experience_years": 16,
                    "phone_number": "+91 96537 66889"
                },
                {
                    "email": "dr.rashmi@metrohealth.ai",
                    "password": "Doctor2026!",
                    "full_name": "Dr. Rashmi Sharma",
                    "specialization": "Chief Spine Rehabilitation & Posture Specialist",
                    "license_number": "DPT-99412-M",
                    "clinic_hospital": "MetroHealth Super Speciality Hospital, New Delhi",
                    "experience_years": 14,
                    "phone_number": "+91 98112 34567"
                },
                {
                    "email": "dr.ganpat@metrohealth.ai",
                    "password": "Doctor2026!",
                    "full_name": "Dr. Ganpat Yadav",
                    "specialization": "Consultant Joint Mobility & Musculoskeletal Rehab",
                    "license_number": "MCI-55214-G",
                    "clinic_hospital": "MetroHealth Super Speciality Hospital, New Delhi",
                    "experience_years": 12,
                    "phone_number": "+91 99201 88341"
                }
            ]

            for doc_info in doctors:
                doc = db.query(User).filter(User.email == doc_info["email"]).first()
                if not doc:
                    db.add(User(
                        email=doc_info["email"],
                        hashed_password=hash_password(doc_info["password"]),
                        full_name=doc_info["full_name"],
                        role="therapist",
                        specialization=doc_info["specialization"],
                        license_number=doc_info["license_number"],
                        clinic_hospital=doc_info["clinic_hospital"],
                        experience_years=doc_info["experience_years"],
                        phone_number=doc_info["phone_number"],
                        is_active=True
                    ))
                else:
                    doc.full_name = doc_info["full_name"]
                    doc.role = "therapist"
                    doc.specialization = doc_info["specialization"]
                    doc.clinic_hospital = doc_info["clinic_hospital"]

            admin_email = "admin@metrohealth.ai"
            if not db.query(User).filter(User.email == admin_email).first():
                db.add(User(
                    email=admin_email,
                    hashed_password=hash_password("Admin2026!"),
                    full_name="MetroHealth Hospital Administrator",
                    role="admin",
                    specialization="Hospital Operations & Patient EMR Administration",
                    clinic_hospital="MetroHealth Super Speciality Hospital, New Delhi",
                    phone_number="+91 96537 66889",
                    is_active=True
                ))

            # Remove legacy demo patient
            demo_user = db.query(User).filter(User.email == "demo@healthsense.ai").first()
            if demo_user:
                db.delete(demo_user)

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
