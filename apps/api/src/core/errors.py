"""
FloodGuard AI — Centralized Error Handling
Every error returned to the client has: code, message, trace_id
"""
import uuid
from enum import Enum
from typing import Any

from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class ErrorCode(str, Enum):
    # Auth
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    TOKEN_EXPIRED = "TOKEN_EXPIRED"
    TOKEN_INVALID = "TOKEN_INVALID"

    # Validation
    VALIDATION_ERROR = "VALIDATION_ERROR"
    INVALID_REQUEST = "INVALID_REQUEST"

    # Resources
    NOT_FOUND = "NOT_FOUND"
    ALREADY_EXISTS = "ALREADY_EXISTS"

    # Data
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"
    DATA_QUALITY_ERROR = "DATA_QUALITY_ERROR"
    UPLOAD_ERROR = "UPLOAD_ERROR"

    # External
    PROVIDER_UNAVAILABLE = "PROVIDER_UNAVAILABLE"
    MODEL_UNAVAILABLE = "MODEL_UNAVAILABLE"

    # System
    INTERNAL_ERROR = "INTERNAL_ERROR"
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"


class ErrorDetail(BaseModel):
    field: str | None = None
    message: str
    code: str | None = None


class ErrorResponse(BaseModel):
    error: dict[str, Any]

    @classmethod
    def create(
        cls,
        code: ErrorCode,
        message: str,
        details: list[ErrorDetail] | None = None,
        trace_id: str | None = None,
    ) -> "ErrorResponse":
        return cls(
            error={
                "code": code.value,
                "message": message,
                "details": [d.model_dump() for d in (details or [])],
                "trace_id": trace_id or str(uuid.uuid4()),
            }
        )


class FloodGuardError(Exception):
    """Base application error."""
    def __init__(
        self,
        code: ErrorCode,
        message: str,
        status_code: int = 400,
        details: list[ErrorDetail] | None = None,
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or []
        super().__init__(message)


class NotFoundError(FloodGuardError):
    def __init__(self, resource: str, identifier: str | None = None):
        msg = f"{resource} not found"
        if identifier:
            msg = f"{resource} '{identifier}' not found"
        super().__init__(ErrorCode.NOT_FOUND, msg, status.HTTP_404_NOT_FOUND)


class UnauthorizedError(FloodGuardError):
    def __init__(self, message: str = "Authentication required"):
        super().__init__(ErrorCode.UNAUTHORIZED, message, status.HTTP_401_UNAUTHORIZED)


class ForbiddenError(FloodGuardError):
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(ErrorCode.FORBIDDEN, message, status.HTTP_403_FORBIDDEN)


class ProviderUnavailableError(FloodGuardError):
    def __init__(self, provider: str):
        super().__init__(
            ErrorCode.PROVIDER_UNAVAILABLE,
            f"Data provider '{provider}' is currently unavailable",
            status.HTTP_503_SERVICE_UNAVAILABLE,
        )


class InsufficientDataError(FloodGuardError):
    def __init__(self, message: str = "Insufficient data for this operation"):
        super().__init__(ErrorCode.INSUFFICIENT_DATA, message, status.HTTP_422_UNPROCESSABLE_ENTITY)


async def floodguard_exception_handler(request: Request, exc: FloodGuardError) -> JSONResponse:
    trace_id = str(uuid.uuid4())
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse.create(
            code=exc.code,
            message=exc.message,
            details=exc.details,
            trace_id=trace_id,
        ).model_dump(),
    )


async def validation_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    from fastapi.exceptions import RequestValidationError
    trace_id = str(uuid.uuid4())
    if isinstance(exc, RequestValidationError):
        details = [
            ErrorDetail(
                field=".".join(str(loc) for loc in e["loc"]) if e.get("loc") else None,
                message=e["msg"],
                code=e.get("type"),
            )
            for e in exc.errors()
        ]
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=ErrorResponse.create(
                code=ErrorCode.VALIDATION_ERROR,
                message="Request validation failed",
                details=details,
                trace_id=trace_id,
            ).model_dump(),
        )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse.create(
            code=ErrorCode.INTERNAL_ERROR,
            message="Internal server error",
            trace_id=trace_id,
        ).model_dump(),
    )
