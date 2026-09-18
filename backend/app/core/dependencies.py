from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import SessionLocal
from app.models.user import User


security = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        subject = payload.get("sub")

        if subject is None:
            raise credentials_exception

        try:
            user_id = int(subject)
            user = db.query(User).filter(User.id == user_id).first()
        except (TypeError, ValueError):
            # Backward compatibility for tokens created before the ID-based subject.
            user = db.query(User).filter(User.email == subject).first()

    except JWTError:
        raise credentials_exception

    if user is None:
        raise credentials_exception

    return user
