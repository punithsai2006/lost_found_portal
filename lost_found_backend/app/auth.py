from datetime import datetime, timedelta
from typing import Optional
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from .database import get_db
from .models import UserAccount
from .schemas import TokenData

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

pwd_context = CryptContext(
    schemes=["bcrypt_sha256"],
    deprecated="auto"
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# -------------------------------
# Password hashing + verification
# -------------------------------
def verify_password(plain_password: str, hashed_password: str):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def get_password_hash(password: str):
    if len(password) > 72:
        password = password[:72]
    return pwd_context.hash(password)


# -------------------------------
# User helpers
# -------------------------------
def get_user_by_roll_number(db: Session, roll_number: str):
    return db.query(UserAccount).filter(UserAccount.roll_number == roll_number).first()


def authenticate_user(db: Session, roll_number: str, password: str):
    user = get_user_by_roll_number(db, roll_number)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


# -------------------------------
# JWT Token
# -------------------------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception

        user_id = int(user_id_str)
        token_data = TokenData(user_id=user_id)

    except Exception:
        raise credentials_exception

    user = db.query(UserAccount).filter(UserAccount.user_id == token_data.user_id).first()
    if user is None:
        raise credentials_exception

    return user


async def get_current_active_user(current_user: UserAccount = Depends(get_current_user)):
    return current_user


def check_admin_permission(current_user: UserAccount = Depends(get_current_active_user)):
    if current_user.role.role_name != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user
