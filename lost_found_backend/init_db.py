#!/usr/bin/env python3
"""
Database initialization script.
Creates the database tables and seeds initial data (roles).
Run this script after setting up your MySQL database.
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal
from app.models import Base, Role

load_dotenv()

def init_database():
    """Initialize database with tables and seed data."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully")
    
    db = SessionLocal()
    try:
        # Check if roles already exist
        existing_roles = db.query(Role).count()
        if existing_roles > 0:
            print(f"✓ Roles already exist ({existing_roles} roles found)")
            return
        
        # Seed initial roles
        print("Seeding initial roles...")
        roles = [
            Role(role_name="student"),
            Role(role_name="staff"),
            Role(role_name="admin"),
        ]
        
        for role in roles:
            db.add(role)
        
        db.commit()
        print("✓ Roles seeded successfully:")
        for role in roles:
            print(f"  - {role.role_name}")
            
    except Exception as e:
        db.rollback()
        print(f"✗ Error initializing database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    try:
        init_database()
        print("\n✓ Database initialization completed successfully!")
    except Exception as e:
        print(f"\n✗ Database initialization failed: {e}")
        sys.exit(1)

