from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..core.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    provider_name = Column(String(255), nullable=False)
    provider_specialty = Column(String(255), nullable=False)  # Physiotherapist, Orthopedic Consultant, General Physician
    clinic_name = Column(String(255), nullable=False)
    appointment_time = Column(DateTime, nullable=False, index=True)
    status = Column(String(50), default="confirmed")  # confirmed, cancelled, completed
    consultation_type = Column(String(50), default="telehealth")  # telehealth, in_person
    reason = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=True)  # Clearly tracks demonstration mode
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="appointments")
