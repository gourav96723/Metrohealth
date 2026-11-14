from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AppointmentCreate(BaseModel):
    provider_name: str = Field(..., min_length=2)
    provider_specialty: str
    clinic_name: str
    appointment_time: datetime
    consultation_type: str = "telehealth"
    reason: Optional[str] = None
    notes: Optional[str] = None
    is_demo: bool = True

class AppointmentResponse(BaseModel):
    id: int
    user_id: int
    provider_name: str
    provider_specialty: str
    clinic_name: str
    appointment_time: datetime
    status: str
    consultation_type: str
    reason: Optional[str] = None
    notes: Optional[str] = None
    is_demo: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ProviderInfo(BaseModel):
    id: str
    name: str
    specialty: str
    clinic: str
    rating: float
    experience_years: int
    available_days: list[str]
    time_slots: list[str]
    is_demo: bool = True
