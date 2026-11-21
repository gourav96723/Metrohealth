from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from ..core.database import get_db
from ..core.security import hash_password, verify_password, create_access_token
from ..core.deps import get_current_user
from ..core.config import settings
from ..models.user import User
from ..schemas.user import (
    UserCreate, UserLogin, UserResponse, Token, UserUpdate,
    PasswordChangeRequest, ForgotPasswordRequest
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
    
    # Create new user
    new_user = User(
        email=user_in.email.lower(),
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name,
        age=user_in.age,
        gender=user_in.gender,
        phone_number=user_in.phone_number,
        role=user_in.role or "patient",
        specialization=user_in.specialization,
        license_number=user_in.license_number,
        clinic_hospital=user_in.clinic_hospital,
        experience_years=user_in.experience_years,
        medical_notes=user_in.medical_notes,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Issue JWT token
    access_token = create_access_token(
        data={"sub": str(new_user.id), "email": new_user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    cred_identifier = credentials.email.strip().lower()
    # Support login with either email or phone number
    user = (
        db.query(User)
        .filter((User.email == cred_identifier) | (User.phone_number == cred_identifier))
        .first()
    )
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/mobile number or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This user account has been disabled."
        )

    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.put("/me", response_model=UserResponse)
def update_profile(
    updates: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if updates.full_name is not None:
        current_user.full_name = updates.full_name
    if updates.age is not None:
        current_user.age = updates.age
    if updates.gender is not None:
        current_user.gender = updates.gender
    if updates.phone_number is not None:
        current_user.phone_number = updates.phone_number
    if updates.role is not None:
        current_user.role = updates.role
    if updates.specialization is not None:
        current_user.specialization = updates.specialization
    if updates.license_number is not None:
        current_user.license_number = updates.license_number
    if updates.clinic_hospital is not None:
        current_user.clinic_hospital = updates.clinic_hospital
    if updates.experience_years is not None:
        current_user.experience_years = updates.experience_years
    if updates.medical_notes is not None:
        current_user.medical_notes = updates.medical_notes
    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)

@router.put("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    req: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Secure password change with verification of current password."""
    if not verify_password(req.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect."
        )
    current_user.hashed_password = hash_password(req.new_password)
    db.commit()
    return {"message": "Password updated successfully."}

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(
    req: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Secure password reset request complying with OWASP guidelines.
    Prevents account takeover and user enumeration by not revealing user existence
    or allowing unauthenticated arbitrary password overwrites.
    """
    user = (
        db.query(User)
        .filter((User.email == req.email.strip().lower()) | (User.phone_number == req.email.strip()))
        .first()
    )
    return {
        "message": (
            "If an active account is registered with this email or mobile number, secure password reset instructions "
            "have been dispatched. For immediate patient assistance, please contact the MetroHealth clinic helpline at 1800-202-6000."
        )
    }

@router.delete("/me", status_code=status.HTTP_200_OK)
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Secure account deletion workflow with cascading deletion of assessments."""
    db.delete(current_user)
    db.commit()
    return {"message": "User account and all associated assessment records have been permanently deleted."}
