# app/routers/locations.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Location
from ..schemas import Location as LocationSchema

router = APIRouter(prefix="/locations", tags=["locations"])

@router.get("/", response_model=List[LocationSchema])
def get_locations(db: Session = Depends(get_db)):
    """Return all locations."""
    return db.query(Location).order_by(Location.location_name).all()
