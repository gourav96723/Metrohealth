from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime

from ..core.database import get_db
from ..core.deps import get_current_user, get_current_admin
from ..models.user import User
from ..models.assessment import Assessment
from ..models.appointment import Appointment

router = APIRouter(prefix="/admin", tags=["Hospital Administrator Portal"])

@router.get("/stats")
def get_admin_hospital_stats(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Returns overall hospital operational statistics."""
    total_patients = db.query(User).filter(User.role == "patient").count()
    total_staff = db.query(User).filter(User.role == "therapist").count()
    total_appts = db.query(Appointment).count()
    total_assessments = db.query(Assessment).count()
    
    # Calculate patients who only used self-care exercise / scans without booking
    booked_user_ids = set(r[0] for r in db.query(Appointment.user_id).distinct().all())
    exercise_only_count = max(0, total_patients - len(booked_user_ids))

    return {
        "hospital_name": "MetroHealth Super Speciality Hospital, New Delhi",
        "total_patients": total_patients,
        "total_staff": total_staff,
        "total_appointments": total_appts,
        "total_assessments": total_assessments,
        "exercise_only_patients_count": exercise_only_count,
        "active_clinical_doctors_count": 3
    }

@router.get("/patients")
def get_all_patients_admin(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Returns full registry of ALL registered patients in the system:
    both those who booked doctor appointments, and those who only took the 3-day exercise plan.
    """
    patients = (
        db.query(User)
        .filter(User.role == "patient")
        .order_by(User.created_at.desc())
        .all()
    )

    result = []
    for p in patients:
        # Check assessments
        assessments = (
            db.query(Assessment)
            .filter(Assessment.user_id == p.id)
            .order_by(Assessment.created_at.desc())
            .all()
        )
        assessments_count = len(assessments)
        latest_area = assessments[0].body_area.title() if assessments else "General Posture"

        # Check appointments
        appts = (
            db.query(Appointment)
            .filter(Appointment.user_id == p.id)
            .order_by(Appointment.appointment_time.desc())
            .all()
        )
        appts_count = len(appts)
        booked_doctors = list(set(a.provider_name for a in appts if a.status != "cancelled"))

        status_label = "Booked with Doctor" if booked_doctors else "Self-Care / 3-Day Exercise Only"

        result.append({
            "id": p.id,
            "full_name": p.full_name,
            "email": p.email,
            "phone_number": p.phone_number or "N/A",
            "age": p.age or "N/A",
            "gender": p.gender or "N/A",
            "registered_date": p.created_at.strftime("%d %b %Y, %I:%M %p") if p.created_at else "Recent",
            "assessments_count": assessments_count,
            "latest_area": latest_area,
            "appointments_count": appts_count,
            "booked_doctors": booked_doctors if booked_doctors else ["Self Exercise (No Doctor Booked)"],
            "status": status_label
        })

    return result

@router.get("/staff")
def get_all_staff_admin(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Returns active hospital doctors and therapists."""
    therapists = (
        db.query(User)
        .filter(User.role == "therapist")
        .order_by(User.id.asc())
        .all()
    )

    result = []
    for t in therapists:
        # Count patients who booked this doctor
        # Match using first name or keyword
        keyword = "Rajesh" if "rajesh" in t.email.lower() else "Rashmi" if "rashmi" in t.email.lower() else "Ganpat" if "ganpat" in t.email.lower() else t.full_name
        appts = (
            db.query(Appointment)
            .filter(Appointment.provider_name.ilike(f"%{keyword}%"))
            .all()
        )
        patient_count = len(set(a.user_id for a in appts))
        active_appts = sum(1 for a in appts if a.status == "confirmed")

        result.append({
            "id": t.id,
            "full_name": t.full_name,
            "email": t.email,
            "phone_number": t.phone_number or "+91 9XXXXXXXXX",
            "specialization": t.specialization or "Specialist Physiotherapist",
            "license_number": t.license_number or "MCI-Registered",
            "clinic_hospital": t.clinic_hospital or "MetroHealth Super Speciality Hospital, New Delhi",
            "experience_years": t.experience_years or 12,
            "total_patients_count": patient_count,
            "active_appointments_count": active_appts
        })

    return result
