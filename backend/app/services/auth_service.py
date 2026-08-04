from sqlalchemy.orm import Session


from app.models.user import User
from app.schemas.user import UserRegister
from app.core.security import (
    hash_password,
    verify_password,
)


def register_user(db: Session, user: UserRegister):
    print("STEP 1: Function entered")

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    print("STEP 2: Email check completed")

    if existing_user:
        return None

    print("STEP 3: Creating user")

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hash_password(user.password),
    )

    print("STEP 4: Password hashed")

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    print("STEP 5: User saved")


    return new_user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.hashed_password,
    ):
        return None

    return user