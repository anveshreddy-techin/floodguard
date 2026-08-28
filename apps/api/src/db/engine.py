"""
FloodGuard AI — Database Engine and Session Management
Async SQLAlchemy 2.0 with PostGIS support
"""
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from ..core.config import settings
from ..core.logging import get_logger

logger = get_logger(__name__)

engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    echo=settings.DEBUG,
    pool_pre_ping=True,  # Verify connections before use
)

async_session_factory = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession,
)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency for database sessions."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def check_db_health() -> dict:
    """Check database connectivity — used in health endpoint."""
    try:
        async with async_session_factory() as session:
            await session.execute(__import__("sqlalchemy").text("SELECT 1"))
        return {"status": "OPERATIONAL", "detail": "Connected"}
    except Exception as e:
        logger.error("database_health_check_failed", error=str(e))
        return {"status": "UNAVAILABLE", "detail": str(e)}
