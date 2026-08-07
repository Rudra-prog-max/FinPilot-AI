from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.user import User
from app.core.config import settings


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

    token = credentials.credentials


    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )


    try:
        print("Incoming token:", token)

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        print("Decoded payload:", payload)

        email: str = payload.get("sub")
        print("Email from token:", email)

        if email is None:
          raise credentials_exception

    except JWTError as e:
        print("JWT Error:", e)
        raise credentials_exception



    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


    if user is None:
        raise credentials_exception


    return user