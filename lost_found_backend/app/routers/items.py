# app/routers/items.py
import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Item, UserAccount, Category, ItemImage, Location, Report
from ..schemas import Item as ItemSchema, ItemCreate, ItemUpdate, ItemImage as ItemImageSchema, Category as CategorySchema, Location as LocationSchema
from ..auth import get_current_active_user
from datetime import datetime

router = APIRouter(prefix="/items", tags=["items"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/", response_model=ItemSchema, status_code=status.HTTP_201_CREATED)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(get_current_active_user)
):
    db_item = Item(
        title=item.title,
        category_id=item.category_id,
        description=item.description,
        created_by=current_user.user_id,
        current_status=item.current_status
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    category = db.query(Category).filter(Category.category_id == db_item.category_id).first()

    return {
        **db_item.__dict__,
        "creator_name": current_user.name,
        "category_name": category.category_name if category else None,
        "images": []
    }

@router.post("/{item_id}/images", response_model=ItemImageSchema, status_code=status.HTTP_201_CREATED)
async def upload_image(
    item_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(get_current_active_user)
):
    db_item = db.query(Item).filter(Item.item_id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    if db_item.created_by != current_user.user_id and current_user.role.role_name != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")

    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        contents = await file.read()
        buffer.write(contents)

    db_image = ItemImage(
        item_id=item_id,
        file_path=f"/uploads/{unique_filename}"
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)

    return db_image

@router.get("/", response_model=List[ItemSchema])
def read_items(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Item).join(UserAccount, Item.created_by == UserAccount.user_id).outerjoin(Category, Item.category_id == Category.category_id)

    if status:
        query = query.filter(Item.current_status == status)

    items = query.offset(skip).limit(limit).all()

    result = []
    for item in items:
        images = db.query(ItemImage).filter(ItemImage.item_id == item.item_id).all()
        result.append({
            **item.__dict__,
            "creator_name": item.creator.name if item.creator else None,
            "category_name": item.category.category_name if item.category else None,
            "images": images
        })

    return result

@router.get("/{item_id}", response_model=ItemSchema)
def read_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.item_id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    images = db.query(ItemImage).filter(ItemImage.item_id == item_id).all()
    last_report = db.query(Report).filter(Report.item_id == item_id).order_by(Report.reported_on.desc()).first()
    last_loc = db.query(Location).filter(Location.location_id == last_report.location_id).first() if last_report and last_report.location_id else None

    return {
        **db_item.__dict__,
        "creator_name": db_item.creator.name if db_item.creator else None,
        "category_name": db_item.category.category_name if db_item.category else None,
        "images": images,
        "last_report_type": last_report.report_type if last_report else None,
        "last_report_date": last_report.reported_date if last_report else None,
        "last_location_name": last_loc.location_name if last_loc else None
    }

@router.put("/{item_id}", response_model=ItemSchema)
def update_item(
    item_id: int,
    item: ItemUpdate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(get_current_active_user)
):
    db_item = db.query(Item).filter(Item.item_id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    if db_item.created_by != current_user.user_id and current_user.role.role_name != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")

    update_data = item.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)

    db_item.last_status_change = datetime.now()
    db.commit()
    db.refresh(db_item)

    category = db.query(Category).filter(Category.category_id == db_item.category_id).first()
    images = db.query(ItemImage).filter(ItemImage.item_id == item_id).all()

    return {
        **db_item.__dict__,
        "creator_name": db_item.creator.name if db_item.creator else None,
        "category_name": category.category_name if category else None,
        "images": images
    }

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(get_current_active_user)
):
    db_item = db.query(Item).filter(Item.item_id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    if db_item.created_by != current_user.user_id and current_user.role.role_name != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")

    db.delete(db_item)
    db.commit()
    return None

# --- Backwards-compatible endpoints for frontend ---
@router.get("/categories/all", response_model=List[CategorySchema])
def get_categories_all(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.category_name).all()

@router.get("/locations/all", response_model=List[LocationSchema])
def get_locations_all(db: Session = Depends(get_db)):
    return db.query(Location).order_by(Location.location_name).all()
