import base64
import hashlib
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt

from app.core.config import settings


def _bcrypt_input(password: str) -> bytes:
    digest = hashlib.sha256(password.encode("utf-8")).digest()
    return base64.b64encode(digest)


def hash_password(password: str) -> str:
    """Hash a password without relying on bcrypt's 72-byte input limit."""
    return bcrypt.hashpw(
        _bcrypt_input(password),
        bcrypt.gensalt(),
    ).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify both current pre-hashed passwords and legacy raw bcrypt hashes."""
    stored_hash = hashed_password.encode("utf-8")

    try:
        if bcrypt.checkpw(plain_password.encode("utf-8"), stored_hash):
            return True
    except ValueError:
        pass

    return bcrypt.checkpw(
        _bcrypt_input(plain_password),
        stored_hash,
    )


def create_access_token(data: dict) -> str:
    now = datetime.now(timezone.utc)
    to_encode = {
        **data,
        "iat": now,
        "iss": settings.JWT_ISSUER,
        "exp": now + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        ),
    }

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
