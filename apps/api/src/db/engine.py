"""
FloodGuard AI / HillGuard — Database Engine and Session Management
Resilient dual-engine architecture:
- Primary: PostgreSQL with asyncpg (for production with PostGIS/TimescaleDB)
- Secondary: Automatic fallback to SQLite async (aiosqlite) when PostgreSQL is not reachable
"""
import asyncio
from collections.abc import AsyncGenerator
from pathlib import Path

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text

from ..core.config import settings
from ..core.logging import get_logger

logger = get_logger(__name__)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


Path("data").mkdir(parents=True, exist_ok=True)
SQLITE_FALLBACK_URL = "sqlite+aiosqlite:///./data/floodguard.db"

_active_url = settings.DATABASE_URL
_is_sqlite_fallback = False


def _build_engine(url: str):
    is_sqlite = "sqlite" in url
    kwargs = {
        "echo": settings.DEBUG,
    }
    if not is_sqlite:
        kwargs["pool_size"] = settings.DATABASE_POOL_SIZE
        kwargs["max_overflow"] = settings.DATABASE_MAX_OVERFLOW
        kwargs["pool_pre_ping"] = True
    return create_async_engine(url, **kwargs)


engine = _build_engine(_active_url)
async_session_factory = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession,
)


async def init_db() -> None:
    """Initialize database tables, ensuring fallback SQLite has schema ready."""
    global engine, async_session_factory, _is_sqlite_fallback, _active_url
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception as e:
        logger.warning(
            "postgres_connection_failed_falling_back_to_sqlite",
            error=str(e),
            fallback_url=SQLITE_FALLBACK_URL,
        )
        _active_url = SQLITE_FALLBACK_URL
        _is_sqlite_fallback = True
        engine = _build_engine(SQLITE_FALLBACK_URL)
        async_session_factory = async_sessionmaker(
            engine,
            expire_on_commit=False,
            class_=AsyncSession,
        )
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("sqlite_fallback_tables_initialized")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency for database sessions with resilient fallback."""
    global engine, async_session_factory, _is_sqlite_fallback, _active_url
    try:
        async with async_session_factory() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()
    except Exception as e:
        if not _is_sqlite_fallback and ("ConnectionRefusedError" in str(e) or "connect" in str(e).lower()):
            await init_db()
            async with async_session_factory() as session:
                try:
                    yield session
                    await session.commit()
                except Exception:
                    await session.rollback()
                    raise
                finally:
                    await session.close()
        else:
            raise


async def check_db_health() -> dict:
    """Check database connectivity with fallback detection."""
    global _is_sqlite_fallback, _active_url
    try:
        async with async_session_factory() as session:
            await session.execute(text("SELECT 1"))
        return {
            "status": "OPERATIONAL",
            "dialect": "sqlite" if _is_sqlite_fallback else "postgresql",
            "detail": "Connected" + (" (SQLite Local Fallback Active)" if _is_sqlite_fallback else ""),
        }
    except Exception as e:
        try:
            await init_db()
            async with async_session_factory() as session:
                await session.execute(text("SELECT 1"))
            return {
                "status": "OPERATIONAL",
                "dialect": "sqlite",
                "detail": "Connected (Recovered via SQLite Local Fallback)",
            }
        except Exception as e2:
            logger.error("database_health_check_failed", error=str(e2))
            return {"status": "UNAVAILABLE", "detail": str(e2)}
