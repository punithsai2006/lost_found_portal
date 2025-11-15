# app/routers/claims.py
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Claim, Item, UserAccount
from ..schemas import Claim as ClaimSchema, ClaimCreate
from ..auth import get_current_active_user, check_admin_permission
from datetime import datetime

router = APIRouter(prefix="/claims", tags=["claims"])

@router.post("/", response_model=ClaimSchema, status_code=status.HTTP_201_CREATED)
def create_claim(payload: ClaimCreate, db: Session = Depends(get_db), current_user: UserAccount = Depends(get_current_active_user)):
    item = db.query(Item).filter(Item.item_id == payload.item_id).first()
    if not item:
        raise HTTPException(404, "Item not found")
    claim = Claim(item_id=payload.item_id, claimer_id=current_user.user_id, claim_text=payload.claim_text)
    db.add(claim); db.commit(); db.refresh(claim)
    return {
        **claim.__dict__,
        "item_title": item.title,
        "claimer_name": current_user.name,
    }

@router.get("/", response_model=List[ClaimSchema])
def list_claims(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(get_current_active_user)
):
    query = db.query(Claim)
    if status:
        query = query.filter(Claim.claim_status == status)
    claims = query.order_by(Claim.claimed_on.desc()).all()

    result = []
    for cl in claims:
        item = db.query(Item).filter(Item.item_id == cl.item_id).first()
        claimer = db.query(UserAccount).filter(UserAccount.user_id == cl.claimer_id).first()
        decider = db.query(UserAccount).filter(UserAccount.user_id == cl.decided_by).first() if cl.decided_by else None
        result.append({
            **cl.__dict__,
            "item_title": item.title if item else None,
            "claimer_name": claimer.name if claimer else None,
            "decider_name": decider.name if decider else None,
        })
    return result

@router.get("/{claim_id}", response_model=ClaimSchema)
def get_claim(claim_id: int, db: Session = Depends(get_db), current_user: UserAccount = Depends(get_current_active_user)):
    cl = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not cl:
        raise HTTPException(status_code=404, detail="Claim not found")
    item = db.query(Item).filter(Item.item_id == cl.item_id).first()
    claimer = db.query(UserAccount).filter(UserAccount.user_id == cl.claimer_id).first()
    decider = db.query(UserAccount).filter(UserAccount.user_id == cl.decided_by).first() if cl.decided_by else None
    return {
        **cl.__dict__,
        "item_title": item.title if item else None,
        "claimer_name": claimer.name if claimer else None,
        "decider_name": decider.name if decider else None,
    }

@router.put("/{claim_id}", response_model=ClaimSchema)
def update_claim(
    claim_id: int,
    payload: ClaimCreate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(get_current_active_user)
):
    cl = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not cl:
        raise HTTPException(status_code=404, detail="Claim not found")
    if cl.claimer_id != current_user.user_id and current_user.role.role_name != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    if cl.claim_status != "pending" and current_user.role.role_name != "admin":
        raise HTTPException(status_code=400, detail="Only pending claims can be edited")
    cl.claim_text = payload.claim_text
    db.commit(); db.refresh(cl)
    item = db.query(Item).filter(Item.item_id == cl.item_id).first()
    decider = db.query(UserAccount).filter(UserAccount.user_id == cl.decided_by).first() if cl.decided_by else None
    return {
        **cl.__dict__,
        "item_title": item.title if item else None,
        "claimer_name": current_user.name,
        "decider_name": decider.name if decider else None,
    }

@router.post("/{claim_id}/approve", response_model=ClaimSchema)
def approve_claim(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(check_admin_permission)
):
    cl = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not cl:
        raise HTTPException(status_code=404, detail="Claim not found")
    if cl.claim_status != "pending":
        raise HTTPException(status_code=400, detail="Claim already decided")
    cl.claim_status = "approved"
    cl.decided_by = current_user.user_id
    cl.decided_on = datetime.now()
    # Update item status to claimed
    item = db.query(Item).filter(Item.item_id == cl.item_id).first()
    if item:
        item.current_status = "claimed"
        item.last_status_change = datetime.now()
    db.commit(); db.refresh(cl)
    claimer = db.query(UserAccount).filter(UserAccount.user_id == cl.claimer_id).first()
    return {
        **cl.__dict__,
        "item_title": item.title if item else None,
        "claimer_name": claimer.name if claimer else None,
        "decider_name": current_user.name,
    }

@router.post("/{claim_id}/reject", response_model=ClaimSchema)
def reject_claim(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(check_admin_permission)
):
    cl = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not cl:
        raise HTTPException(status_code=404, detail="Claim not found")
    if cl.claim_status != "pending":
        raise HTTPException(status_code=400, detail="Claim already decided")
    cl.claim_status = "rejected"
    cl.decided_by = current_user.user_id
    cl.decided_on = datetime.now()
    db.commit(); db.refresh(cl)
    item = db.query(Item).filter(Item.item_id == cl.item_id).first()
    claimer = db.query(UserAccount).filter(UserAccount.user_id == cl.claimer_id).first()
    return {
        **cl.__dict__,
        "item_title": item.title if item else None,
        "claimer_name": claimer.name if claimer else None,
        "decider_name": current_user.name,
    }

@router.delete("/{claim_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_claim(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(get_current_active_user)
):
    cl = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    if not cl:
        raise HTTPException(status_code=404, detail="Claim not found")
    if cl.claimer_id != current_user.user_id and current_user.role.role_name != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db.delete(cl); db.commit()
    return None
