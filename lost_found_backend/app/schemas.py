# app/schemas.py
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, date

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: int

# User
class UserCreate(BaseModel):
    name: str
    branch: Optional[str] = None
    roll_number: str
    school: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str
    role_id: Optional[int] = 1

class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    user_id: int
    name: str
    branch: Optional[str] = None
    roll_number: str
    school: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    role_id: Optional[int] = None
    role_name: Optional[str] = None

# Category / Location
class Category(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    category_id: int
    category_name: str

class Location(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    location_id: int
    location_name: str
    building: Optional[str] = None
    floor: Optional[str] = None

# Item
class ItemCreate(BaseModel):
    title: str
    category_id: Optional[int] = None
    description: Optional[str] = None
    current_status: Optional[str] = "lost"

class ItemUpdate(BaseModel):
    title: Optional[str] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    current_status: Optional[str] = None

class Item(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    item_id: int
    title: str
    category_id: Optional[int] = None
    description: Optional[str] = None
    created_by: Optional[int] = None
    created_on: Optional[datetime] = None
    current_status: Optional[str] = None
    creator_name: Optional[str] = None
    category_name: Optional[str] = None
    images: Optional[List[dict]] = []

# Report
class ReportCreate(BaseModel):
    item_id: Optional[int] = None
    item_title: Optional[str] = None
    report_type: str
    location_id: Optional[int] = None
    location_name: Optional[str] = None
    reported_date: Optional[date] = None
    details: Optional[str] = None
    status: Optional[str] = "open"

class Report(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    report_id: int
    item_id: int
    reporter_id: int
    report_type: str
    location_id: Optional[int] = None
    reported_date: Optional[date] = None
    reported_on: Optional[datetime] = None
    details: Optional[str] = None
    status: Optional[str] = None
    reporter_name: Optional[str] = None
    item_title: Optional[str] = None
    location_name: Optional[str] = None

# ItemImage
class ItemImage(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    image_id: int
    item_id: int
    file_path: str
    uploaded_on: Optional[datetime] = None

# Claim
class ClaimCreate(BaseModel):
    item_id: int
    claim_text: Optional[str] = None

class Claim(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    claim_id: int
    item_id: int
    claimer_id: int
    claim_text: Optional[str] = None
    claim_status: Optional[str] = None
    claimed_on: Optional[datetime] = None
    decided_by: Optional[int] = None
    decided_on: Optional[datetime] = None
    item_title: Optional[str] = None
    claimer_name: Optional[str] = None
    decider_name: Optional[str] = None
