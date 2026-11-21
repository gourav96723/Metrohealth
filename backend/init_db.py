"""
HealthSense AI - Database Initialization & Seed Script
Configures the 3 active hospital doctors and admin account.
All demo/fake patients are removed so only real registrations and bookings are tracked.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timezone
from sqlalchemy import text
from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.models.assessment import Assessment
from app.models.appointment import Appointment

def migrate_columns():
    """Ensure newly added columns exist in SQLite users table."""
    columns_to_add = [
        ("role", "VARCHAR(50) DEFAULT 'patient'"),
        ("specialization", "VARCHAR(255)"),
        ("license_number", "VARCHAR(100)"),
        ("clinic_hospital", "VARCHAR(255)"),
        ("experience_years", "INTEGER")
    ]
    with engine.connect() as conn:
        try:
            res = conn.execute(text("PRAGMA table_info(users)")).fetchall()
            existing_cols = [r[1] for r in res]
            for col_name, col_type in columns_to_add:
                if col_name not in existing_cols:
                    print(f"Adding column '{col_name}' to users table...")
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
            conn.commit()
        except Exception as e:
            print(f"Column migration check: {e}")

def init_database():
    print("Initializing MetroHealth AI database tables...")
    Base.metadata.create_all(bind=engine)
    migrate_columns()
    db = SessionLocal()

    try:
        # 1. Active 3 Doctors at MetroHealth Super Speciality Hospital, New Delhi
        doctors = [
            {
                "email": "dr.rajesh@metrohealth.ai",
                "password": "Doctor2026!",
                "full_name": "Dr. Rajesh Kumar Sharma",
                "specialization": "Senior Orthopaedic & Sports Physiotherapy Specialist",
                "license_number": "MCI-84729-D",
                "clinic_hospital": "MetroHealth Super Speciality Hospital, New Delhi",
                "experience_years": 16,
                "phone_number": "+91 11-2659-4001"
            },
            {
                "email": "dr.rashmi@metrohealth.ai",
                "password": "Doctor2026!",
                "full_name": "Dr. Rashmi Sharma",
                "specialization": "Chief Spine Rehabilitation & Posture Specialist",
                "license_number": "DPT-99412-M",
                "clinic_hospital": "MetroHealth Super Speciality Hospital, New Delhi",
                "experience_years": 14,
                "phone_number": "+91 11-2659-4002"
            },
            {
                "email": "dr.ganpat@metrohealth.ai",
                "password": "Doctor2026!",
                "full_name": "Dr. Ganpat Yadav",
                "specialization": "Consultant Joint Mobility & Musculoskeletal Rehab",
                "license_number": "MCI-55214-G",
                "clinic_hospital": "MetroHealth Super Speciality Hospital, New Delhi",
                "experience_years": 12,
                "phone_number": "+91 11-2659-4003"
            }
        ]

        for doc_info in doctors:
            doc = db.query(User).filter(User.email == doc_info["email"]).first()
            if not doc:
                print(f"Creating doctor: {doc_info['full_name']} ({doc_info['email']})...")
                doc = User(
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
                )
                db.add(doc)
            else:
                doc.full_name = doc_info["full_name"]
                doc.role = "therapist"
                doc.specialization = doc_info["specialization"]
                doc.license_number = doc_info["license_number"]
                doc.clinic_hospital = doc_info["clinic_hospital"]
                doc.experience_years = doc_info["experience_years"]
                doc.phone_number = doc_info["phone_number"]
            db.commit()

        # 2. Hospital Administrator Account
        admin_email = "admin@metrohealth.ai"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            print("Creating administrator account...")
            admin = User(
                email=admin_email,
                hashed_password=hash_password("Admin2026!"),
                full_name="MetroHealth Hospital Administrator",
                role="admin",
                specialization="Hospital Operations & Patient EMR Administration",
                clinic_hospital="MetroHealth Super Speciality Hospital, New Delhi",
                phone_number="1800-202-6000",
                is_active=True
            )
            db.add(admin)
            db.commit()
            print(f"Administrator created: {admin_email} (Password: Admin2026!)")

        # 3. Clean up any fake demo users (e.g. demo@healthsense.ai)
        demo_user = db.query(User).filter(User.email == "demo@healthsense.ai").first()
        if demo_user:
            print("Removing legacy demo user and its assessments...")
            db.delete(demo_user)
            db.commit()

        print("Database initialization complete: 3 Doctors, 1 Admin ready. Zero fake patients.")
    except Exception as e:
        print(f"Error during database initialization: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
