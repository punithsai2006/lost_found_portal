# app/routers/users.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..database import get_db
from ..models import UserAccount
from ..schemas import User as UserSchema
from ..auth import get_current_active_user, check_admin_permission

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserSchema)
def read_user_me(current_user: UserAccount = Depends(get_current_active_user)):
    return {
        **current_user.__dict__,
        "role_name": current_user.role.role_name if current_user.role else None
    }

@router.get("/", response_model=List[UserSchema])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(check_admin_permission)
):
    users = db.query(UserAccount).offset(skip).limit(limit).all()
    result = []
    for user in users:
        result.append({
            **user.__dict__,
            "role_name": user.role.role_name if user.role else None
        })
    return result

@router.get("/dashboard/student")
def get_student_dashboard(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(get_current_active_user)
):
    query = text("""
    SELECT 
      r.report_id,
      r.report_type,
      r.status,
      r.details,
      r.reported_on,
      i.item_id,
      i.title AS item_title,
      i.current_status,
      l.location_name
    FROM report r
    JOIN item i ON r.item_id = i.item_id
    LEFT JOIN location l ON r.location_id = l.location_id
    WHERE r.reporter_id = :uid
    ORDER BY r.reported_on DESC
    """)
    rows = db.execute(query, {"uid": current_user.user_id}).fetchall()
    return [dict(r._mapping) for r in rows]

@router.get("/dashboard/admin/pending_claims")
def get_admin_pending_claims(
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(check_admin_permission)
):
    query = text("""
    SELECT cl.claim_id, cl.item_id, i.title, cl.claimer_id, cu.name AS claimer_name, cl.claimed_on, i.current_status
    FROM claim cl
    JOIN item i ON i.item_id = cl.item_id
    JOIN user_account cu ON cu.user_id = cl.claimer_id
    WHERE cl.claim_status = 'pending'
    ORDER BY cl.claimed_on DESC
    """)
    rows = db.execute(query).fetchall()
    return [dict(r) for r in rows]
