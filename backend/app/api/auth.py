from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.schemas.user import (
    UserRegister,
    UserResponse,
    UserLogin,
    Token,
)

from app.services.auth_service import (
    register_user,
    authenticate_user,
    update_user_profile,
)

from app.core.security import create_access_token
from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.user import UserUpdate
from app.core.config import settings
from app.core.rate_limit import limiter


router = APIRouter(prefix="/auth", tags=["Authentication"])



@router.post("/register", response_model=UserResponse)
@limiter.limit(settings.RATE_LIMIT_REGISTER)
def register(
    request: Request,
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
@limiter.limit(settings.RATE_LIMIT_LOGIN)
def login(
    request: Request,
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
            "sub": str(authenticated_user.id),
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_user_profile(db, current_user, user_data)
