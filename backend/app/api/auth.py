from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.security import create_access_token
from app.database.session import SessionLocal
from app.models.user import User
from app.schemas.user import (
    UserRegister,
    UserResponse,
    UserLogin,
    Token,
)
from app.services.auth_service import (
    register_user,
    authenticate_user,
)


router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register", response_model=UserResponse)
def register(
    user: UserRegister,
    db: Session = Depends(get_db),
):
    new_user = register_user(db, user)

    if new_user is None:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    return new_user


@router.post("/login", response_model=Token)
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):
    authenticated_user = authenticate_user(
        db,
        user.email,
        user.password,
    )

    if authenticated_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        data={
            "sub": authenticated_user.email,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user
