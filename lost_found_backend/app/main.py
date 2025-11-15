from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .routers import auth, users, items, reports, categories, locations, claims
from .database import engine, SessionLocal
from .models import Base, Role

# Create tables and seed minimal data
Base.metadata.create_all(bind=engine)

# Seed default roles
try:
    db = SessionLocal()
    existing = db.query(Role).count()
    if existing == 0:
        db.add_all([
            Role(role_name="student"),
            Role(role_name="staff"),
            Role(role_name="admin")
        ])
        db.commit()
finally:
    try:
        db.close()
    except Exception:
        pass

app = FastAPI(title="Lost & Found Portal API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(categories.router)
app.include_router(locations.router)
app.include_router(items.router)
app.include_router(reports.router)
app.include_router(claims.router)
