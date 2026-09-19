from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserRegister
from app.core.security import hash_password, verify_password


def register_user(db: Session, user: UserRegister):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        return None

    new_user = User(
        full_name=user.full_name.strip(),
        email=str(user.email).lower(),
        hashed_password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def authenticate_user(db: Session, email: str, password: str):
    normalized_email = email.strip().lower()

    user = (
        db.query(User)
        .filter(User.email == normalized_email)
        .first()
    )

    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user
