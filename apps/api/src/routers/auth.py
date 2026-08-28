"""
FloodGuard AI — Authentication Router
JWT-based authentication with role-based access control.
"""
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.security import (
    Role,
    TokenPayload,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from ..db.engine import get_db
from ..db.models import User

router = APIRouter()
security = HTTPBearer()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict


class UserInfo(BaseModel):
    id: str
    email: str
    name: str
    role: Role


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Dependency: verify JWT and return current user."""
    try:
        payload = decode_token(credentials.credentials)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "TOKEN_INVALID", "message": "Invalid or expired token"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    if payload.token_type != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "TOKEN_INVALID", "message": "Not an access token"},
        )

    if payload.exp < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "TOKEN_EXPIRED", "message": "Token has expired"},
        )

    result = await db.execute(select(User).where(User.id == payload.sub, User.is_active == True))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "UNAUTHORIZED", "message": "User not found or inactive"},
        )
    return user


def require_role(*roles: Role):
    """Dependency factory: require one of the specified roles."""
    async def _check(user: Annotated[User, Depends(get_current_user)]) -> User:
        if user.role not in [r.value for r in roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": f"Requires role: {[r.value for r in roles]}"},
            )
        return user
    return _check


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: Annotated[AsyncSession, Depends(get_db)]):
    """Authenticate user and return JWT tokens."""
    result = await db.execute(
        select(User).where(User.email == request.email, User.is_active == True)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "UNAUTHORIZED", "message": "Invalid credentials"},
        )

    # Update last login
    user.last_login_at = datetime.now(timezone.utc)

    role = Role(user.role)
    access_token = create_access_token(str(user.id), user.email, role)
    refresh_token = create_refresh_token(str(user.id), user.email, role)

    from ..core.config import settings
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user={"id": str(user.id), "email": user.email, "name": user.name, "role": user.role},
    )


@router.post("/refresh")
async def refresh_token(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Refresh access token using refresh token."""
    try:
        payload = decode_token(credentials.credentials)
    except ValueError:
        raise HTTPException(status_code=401, detail={"code": "TOKEN_INVALID", "message": "Invalid token"})

    if payload.token_type != "refresh":
        raise HTTPException(status_code=401, detail={"code": "TOKEN_INVALID", "message": "Not a refresh token"})

    result = await db.execute(select(User).where(User.id == payload.sub, User.is_active == True))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail={"code": "UNAUTHORIZED", "message": "User not found"})

    role = Role(user.role)
    from ..core.config import settings
    return {
        "access_token": create_access_token(str(user.id), user.email, role),
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


@router.get("/me", response_model=UserInfo)
async def get_me(current_user: Annotated[User, Depends(get_current_user)]):
    """Get current authenticated user information."""
    return UserInfo(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        role=Role(current_user.role),
    )
