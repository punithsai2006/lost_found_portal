# app/models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, Enum, Boolean, SmallInteger, Date, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Role(Base):
    __tablename__ = "role"
    role_id = Column(SmallInteger, primary_key=True, autoincrement=True)
    role_name = Column(String(30), unique=True, nullable=False)

class UserAccount(Base):
    __tablename__ = "user_account"
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    branch = Column(String(50))
    roll_number = Column(String(30), unique=True, nullable=False)
    school = Column(String(100))
    email = Column(String(150))
    phone = Column(String(20))
    password_hash = Column(String(255), nullable=False)
    role_id = Column(SmallInteger, ForeignKey("role.role_id"), nullable=False, default=1)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, onupdate=func.now())

    role = relationship("Role")
    created_items = relationship("Item", back_populates="creator")
    reports = relationship("Report", back_populates="reporter")

class Category(Base):
    __tablename__ = "category"
    category_id = Column(Integer, primary_key=True, autoincrement=True)
    category_name = Column(String(50), unique=True, nullable=False)

class Location(Base):
    __tablename__ = "location"
    location_id = Column(Integer, primary_key=True, autoincrement=True)
    location_name = Column(String(100), unique=True, nullable=False)
    building = Column(String(100))
    floor = Column(String(20))

class Item(Base):
    __tablename__ = "item"
    __table_args__ = (
        UniqueConstraint('title', 'created_by', name='uk_title_createdby'),
    )
    item_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(150), nullable=False)
    category_id = Column(Integer, ForeignKey("category.category_id"))
    description = Column(Text)
    created_by = Column(Integer, ForeignKey("user_account.user_id"))
    created_on = Column(TIMESTAMP, server_default=func.now())
    current_status = Column(Enum("lost","found","claimed","completed","discarded", name="item_status"), default="lost")
    last_status_change = Column(TIMESTAMP)

    category = relationship("Category")
    creator = relationship("UserAccount", back_populates="created_items")
    reports = relationship("Report", back_populates="item")
    images = relationship("ItemImage", back_populates="item")

class Report(Base):
    __tablename__ = "report"
    report_id = Column(Integer, primary_key=True, autoincrement=True)
    item_id = Column(Integer, ForeignKey("item.item_id"), nullable=False)
    reporter_id = Column(Integer, ForeignKey("user_account.user_id"), nullable=False)
    report_type = Column(Enum("lost","found", name="report_type"))
    location_id = Column(Integer, ForeignKey("location.location_id"))
    reported_date = Column(Date)
    reported_on = Column(TIMESTAMP, server_default=func.now())
    details = Column(Text)
    status = Column(Enum("open","in_review","resolved", name="report_status"), default="open")

    item = relationship("Item", back_populates="reports")
    reporter = relationship("UserAccount", back_populates="reports")
    location = relationship("Location")

class ItemImage(Base):
    __tablename__ = "item_image"
    image_id = Column(Integer, primary_key=True, autoincrement=True)
    item_id = Column(Integer, ForeignKey("item.item_id"), nullable=False)
    file_path = Column(String(255), nullable=False)
    uploaded_on = Column(TIMESTAMP, server_default=func.now())

    item = relationship("Item", back_populates="images")

class Claim(Base):
    __tablename__ = "claim"
    claim_id = Column(Integer, primary_key=True, autoincrement=True)
    item_id = Column(Integer, ForeignKey("item.item_id"), nullable=False)
    claimer_id = Column(Integer, ForeignKey("user_account.user_id"), nullable=False)
    claim_text = Column(Text)
    claim_status = Column(Enum("pending","approved","rejected", name="claim_status"), default="pending")
    claimed_on = Column(TIMESTAMP, server_default=func.now())
    decided_by = Column(Integer, ForeignKey("user_account.user_id"))
    decided_on = Column(TIMESTAMP)
