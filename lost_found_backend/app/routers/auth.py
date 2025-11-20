# app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..database import get_db
from ..auth import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    get_current_active_user,
)
from ..models import UserAccount

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ------------------------------------------------------------
# REGISTER  (Frontend sends normal JSON)
# ------------------------------------------------------------
@router.post("/register")
def register(user: dict, db: Session = Depends(get_db)):

    # Validate required fields
    required_fields = ["name", "roll_number", "password"]
    for field in required_fields:
        if field not in user or not user[field]:
            raise HTTPException(400, f"'{field}' is required")

    # Check roll number exists
    existing = (
        db.query(UserAccount)
        .filter(UserAccount.roll_number == user["roll_number"])
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Roll number already registered"
        )

    # FIX: Trim + enforce 72-char bcrypt limit
    password = user["password"].strip()[:72]
    hashed_pw = get_password_hash(password)

    # Create user account
    new_user = UserAccount(
        name=user["name"].strip(),
        branch=user.get("branch"),
        roll_number=user["roll_number"].strip(),
        school=user.get("school"),
        email=user.get("email"),
        phone=user.get("phone"),
        password_hash=hashed_pw,
        role_id=1,  # Default student
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Registration successful"}


# ------------------------------------------------------------
# LOGIN  (OAuth2PasswordRequestForm expects username + password)
# ------------------------------------------------------------
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    roll_number = form_data.username.strip()
    password = form_data.password.strip()

    user = authenticate_user(db, roll_number, password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect roll number or password"
        )

    # JWT MUST include "sub"
    access_token = create_access_token(
        data={"sub": str(user.user_id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "user_id": user.user_id,
            "name": user.name,
            "roll_number": user.roll_number,
            "role_name": user.role.role_name,
            "email": user.email,
            "branch": user.branch,
            "school": user.school,
            "phone": user.phone,
            "created_at": user.created_at,
        },
    }


# ------------------------------------------------------------
# GET CURRENT USER  (Used by AuthContext.js)
# ------------------------------------------------------------
@router.get("/me")
def get_me(current_user: UserAccount = Depends(get_current_active_user)):

    return {
        "user_id": current_user.user_id,
        "name": current_user.name,
        "email": current_user.email,
        "branch": current_user.branch,
        "roll_number": current_user.roll_number,
        "school": current_user.school,
        "phone": current_user.phone,
        "role_name": current_user.role.role_name,
        "created_at": current_user.created_at,
    }
