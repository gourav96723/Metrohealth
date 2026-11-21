from datetime import datetime, timezone
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..core.deps import get_current_user
from ..models.user import User
from ..models.appointment import Appointment
from ..schemas.appointment import AppointmentCreate, AppointmentResponse, ProviderInfo

router = APIRouter(prefix="/appointments", tags=["Appointments (Demo / Configurable)"])

# Active MetroHealth Hospital Specialists (All same hospital)
DEMO_PROVIDERS: list[ProviderInfo] = [
    ProviderInfo(
        id="prov-1",
        name="Dr. Rajesh Kumar Sharma",
        specialty="Senior Orthopaedic & Sports Physiotherapy",
        clinic="MetroHealth Super Speciality Hospital, New Delhi",
        rating=4.96,
        experience_years=16,
        available_days=["Monday", "Wednesday", "Friday"],
        time_slots=["09:30", "11:30", "14:30", "16:30"],
        is_demo=False
    ),
    ProviderInfo(
        id="prov-2",
        name="Dr. Rashmi Sharma",
        specialty="Chief Spine Rehabilitation & Posture Specialist",
        clinic="MetroHealth Super Speciality Hospital, New Delhi",
        rating=4.98,
        experience_years=14,
        available_days=["Tuesday", "Thursday", "Saturday"],
        time_slots=["10:00", "12:30", "15:00", "17:30"],
        is_demo=False
    ),
    ProviderInfo(
        id="prov-3",
        name="Dr. Ganpat Yadav",
        specialty="Consultant Joint Mobility & Musculoskeletal Rehab",
        clinic="MetroHealth Super Speciality Hospital, New Delhi",
        rating=4.92,
        experience_years=12,
        available_days=["Monday", "Tuesday", "Thursday", "Friday"],
        time_slots=["09:00", "11:00", "14:00", "16:00"],
        is_demo=False
    )
]

@router.get("/providers", response_model=list[ProviderInfo])
def get_available_providers():
    """Returns sample healthcare professionals for demonstration booking."""
    return DEMO_PROVIDERS

@router.get("", response_model=list[AppointmentResponse])
def get_user_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Lists appointments belonging exclusively to the authenticated user.
    Automatically marks confirmed appointments whose scheduled time has passed as 'completed' (Visit Done).
    """
    appointments = (
        db.query(Appointment)
        .filter(Appointment.user_id == current_user.id)
        .order_by(Appointment.appointment_time.desc())
        .all()
    )

    now_utc = datetime.now(timezone.utc)
    updated = False
    for appt in appointments:
        if appt.status == "confirmed":
            appt_time = appt.appointment_time
            if appt_time.tzinfo is None:
                appt_time = appt_time.replace(tzinfo=timezone.utc)
            if appt_time <= now_utc:
                appt.status = "completed"
                updated = True

    if updated:
        db.commit()

    return [AppointmentResponse.model_validate(a) for a in appointments]

@router.post("", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def book_appointment(
    booking_in: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Creates an appointment booking request.
    Includes conflict detection to prevent duplicate bookings at the same time slot for the provider.
    """
    # Check for slot conflicts
    conflict = (
        db.query(Appointment)
        .filter(
            Appointment.provider_name == booking_in.provider_name,
            Appointment.appointment_time == booking_in.appointment_time,
            Appointment.status != "cancelled"
        )
        .first()
    )
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The requested provider already has an appointment booked at this exact time slot. Please choose another slot."
        )

    appointment = Appointment(
        user_id=current_user.id,
        provider_name=booking_in.provider_name,
        provider_specialty=booking_in.provider_specialty,
        clinic_name=booking_in.clinic_name,
        appointment_time=booking_in.appointment_time,
        status="confirmed",
        consultation_type=booking_in.consultation_type,
        reason=booking_in.reason,
        notes=booking_in.notes,
        is_demo=True
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return AppointmentResponse.model_validate(appointment)

@router.put("/{appointment_id}/cancel", response_model=AppointmentResponse)
def cancel_appointment(
    appointment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancels a scheduled appointment. Enforces user ownership."""
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id, Appointment.user_id == current_user.id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment record not found or does not belong to you."
        )
    
    appointment.status = "cancelled"
    db.commit()
    db.refresh(appointment)
    return AppointmentResponse.model_validate(appointment)

class RescheduleRequest(BaseModel):
    new_time: datetime

@router.put("/{appointment_id}/reschedule", response_model=AppointmentResponse)
def reschedule_appointment(
    appointment_id: int,
    req: RescheduleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Reschedules an appointment to a new date and time slot."""
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id, Appointment.user_id == current_user.id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment record not found."
        )
    
    # Conflict check
    conflict = (
        db.query(Appointment)
        .filter(
            Appointment.provider_name == appointment.provider_name,
            Appointment.appointment_time == req.new_time,
            Appointment.status != "cancelled",
            Appointment.id != appointment_id
        )
        .first()
    )
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Doctor already has a booking at this time slot. Please pick another slot."
        )
    
    appointment.appointment_time = req.new_time
    appointment.status = "confirmed"
    db.commit()
    db.refresh(appointment)
    return AppointmentResponse.model_validate(appointment)
