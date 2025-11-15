# app/routers/categories.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Category
from ..schemas import Category as CategorySchema

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=List[CategorySchema])
def get_categories(db: Session = Depends(get_db)):
    """Return all categories (convenience route)."""
    return db.query(Category).order_by(Category.category_name).all()
