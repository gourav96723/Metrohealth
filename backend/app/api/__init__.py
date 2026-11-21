from fastapi import APIRouter
from .auth import router as auth_router
from .assessments import router as assessments_router
from .cv import router as cv_router
from .safety import router as safety_router
from .exercises import router as exercises_router
from .appointments import router as appointments_router
from .therapist import router as therapist_router
from .admin import router as admin_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(assessments_router)
api_router.include_router(cv_router)
api_router.include_router(safety_router)
api_router.include_router(exercises_router)
api_router.include_router(appointments_router)
api_router.include_router(therapist_router)
api_router.include_router(admin_router)
