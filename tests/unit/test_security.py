"""
Unit tests for FloodGuard AI Security, JWT tokens, and RBAC hierarchy.
"""
from datetime import timedelta
import pytest
from apps.api.src.core.security import (
    Role,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
    has_minimum_role,
)


def test_password_hashing():
    pw = "SuperSecurePassphrase2026!"
    hashed = hash_password(pw)
    assert hashed != pw
    assert verify_password(pw, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_generation_and_decoding():
    user_id = "00000000-0000-0000-0000-000000000001"
    email = "operator@floodguard.demo"
    role = Role.AUTHORITY_OPERATOR

    token = create_access_token(user_id, email, role, expires_delta=timedelta(minutes=15))
    payload = decode_token(token)

    assert payload.sub == user_id
    assert payload.email == email
    assert payload.role == role
    assert payload.token_type == "access"


def test_role_hierarchy():
    assert has_minimum_role(Role.ADMIN, Role.VIEWER) is True
    assert has_minimum_role(Role.ADMIN, Role.AUTHORITY_OPERATOR) is True
    assert has_minimum_role(Role.VIEWER, Role.ADMIN) is False
    assert has_minimum_role(Role.ANALYST, Role.FIELD_OFFICER) is True
