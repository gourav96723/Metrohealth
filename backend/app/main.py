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

# Auto-create tables on startup
Base.metadata.create_all(bind=engine)

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
