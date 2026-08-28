"""
FloodGuard AI — Security: JWT authentication, password hashing, RBAC
"""
from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Any
import uuid

from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from .config import settings


class Role(str, Enum):
    ADMIN = "ADMIN"
    AUTHORITY_OPERATOR = "AUTHORITY_OPERATOR"
    ANALYST = "ANALYST"
    FIELD_OFFICER = "FIELD_OFFICER"
    RESEARCHER = "RESEARCHER"
    VIEWER = "VIEWER"


# Role hierarchy — higher index = higher privilege
ROLE_HIERARCHY = [
    Role.VIEWER,
    Role.RESEARCHER,
    Role.FIELD_OFFICER,
    Role.ANALYST,
    Role.AUTHORITY_OPERATOR,
    Role.ADMIN,
]


class TokenPayload(BaseModel):
    sub: str  # user id
    role: Role
    email: str
    exp: datetime
    jti: str  # JWT ID for revocation
    token_type: str = "access"


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=settings.BCRYPT_ROUNDS)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    user_id: str,
    email: str,
    role: Role,
    expires_delta: timedelta | None = None,
) -> str:
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    expire = datetime.now(timezone.utc) + expires_delta
    payload = {
        "sub": user_id,
        "email": email,
        "role": role.value,
        "exp": expire,
        "jti": str(uuid.uuid4()),
        "token_type": "access",
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(user_id: str, email: str, role: Role) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role.value,
        "exp": expire,
        "jti": str(uuid.uuid4()),
        "token_type": "refresh",
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> TokenPayload:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return TokenPayload(
            sub=payload["sub"],
            role=Role(payload["role"]),
            email=payload["email"],
            exp=datetime.fromtimestamp(payload["exp"], tz=timezone.utc),
            jti=payload["jti"],
            token_type=payload.get("token_type", "access"),
        )
    except JWTError as e:
        raise ValueError(f"Invalid token: {e}") from e


def has_minimum_role(user_role: Role, required_role: Role) -> bool:
    """Check if user_role meets or exceeds required_role in hierarchy."""
    user_idx = ROLE_HIERARCHY.index(user_role)
    required_idx = ROLE_HIERARCHY.index(required_role)
    return user_idx >= required_idx
