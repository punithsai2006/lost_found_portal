# app/routers/reports.py
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Report, Item, UserAccount, Location
from ..schemas import Report as ReportSchema, ReportCreate
from ..auth import get_current_active_user

router = APIRouter(prefix="/reports", tags=["reports"])

@router.post("/", response_model=ReportSchema)
def create_report(report: ReportCreate, db: Session = Depends(get_db), current_user: UserAccount = Depends(get_current_active_user)):
    item = None
    if report.item_id:
        item = db.query(Item).filter(Item.item_id == report.item_id).first()
    if not item and report.item_title:
        title = report.item_title.strip()
        if not title:
            raise HTTPException(400, "Item title is required")
        item = Item(
            title=title,
            description=report.details,
            created_by=current_user.user_id,
            current_status="lost" if report.report_type == "lost" else "found"
        )
        db.add(item)
        db.commit()
        db.refresh(item)
    if not item:
        raise HTTPException(404, "Item not found")
    loc_id = report.location_id
    if not loc_id and report.location_name:
        name = report.location_name.strip()
        if name:
            loc = db.query(Location).filter(Location.location_name == name).first()
            if not loc:
                loc = Location(location_name=name)
                db.add(loc)
                db.commit()
                db.refresh(loc)
            loc_id = loc.location_id
    db_report = Report(
        item_id=item.item_id,
        reporter_id=current_user.user_id,
        report_type=report.report_type,
        location_id=loc_id,
        reported_date=report.reported_date,
        details=report.details,
        status=report.status
    )
    db.add(db_report); db.commit(); db.refresh(db_report)
    return {
        **db_report.__dict__,
        "reporter_name": current_user.name,
        "item_title": item.title,
        "location_name": db_report.location.location_name if db_report.location else None
    }

@router.get("/", response_model=List[ReportSchema])
def read_reports(
    report_type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Report)
    if report_type:
        query = query.filter(Report.report_type == report_type)
    if status:
        query = query.filter(Report.status == status)
    reports = query.all()
    result = []
    for r in reports:
        loc = db.query(Location).filter(Location.location_id == r.location_id).first() if r.location_id else None
        result.append({
            **r.__dict__,
            "reporter_name": r.reporter.name if r.reporter else None,
            "item_title": r.item.title if r.item else None,
            "location_name": loc.location_name if loc else None
        })
    return result

@router.get("/{report_id}", response_model=ReportSchema)
def read_report(report_id: int, db: Session = Depends(get_db)):
    r = db.query(Report).filter(Report.report_id == report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
    loc = db.query(Location).filter(Location.location_id == r.location_id).first() if r.location_id else None
    return {
        **r.__dict__,
        "reporter_name": r.reporter.name if r.reporter else None,
        "item_title": r.item.title if r.item else None,
        "location_name": loc.location_name if loc else None
    }

@router.put("/{report_id}/status", response_model=ReportSchema)
def update_report_status(
    report_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(get_current_active_user)
):
    """Update report status. Users can mark their own reports as completed."""
    r = db.query(Report).filter(Report.report_id == report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Users can only update their own reports, unless they're admin
    if r.reporter_id != current_user.user_id and current_user.role.role_name != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    if status not in ["open", "in_review", "resolved"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    r.status = status
    db.commit()
    db.refresh(r)
    
    # If marking as resolved, also update item status to completed
    if status == "resolved" and r.item:
        r.item.current_status = "completed"
        from datetime import datetime
        r.item.last_status_change = datetime.now()
        db.commit()
    
    loc = db.query(Location).filter(Location.location_id == r.location_id).first() if r.location_id else None
    return {
        **r.__dict__,
        "reporter_name": r.reporter.name if r.reporter else None,
        "item_title": r.item.title if r.item else None,
        "location_name": loc.location_name if loc else None
    }