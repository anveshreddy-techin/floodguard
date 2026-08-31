"""
FloodGuard AI — Disaster Relief & Donations Unit Tests
Tests campaign listing, filtering by state/disaster, donation processing,
cryptographic SHA-256 receipt generation, 80G tax certificate, and public ledger.
"""
import pytest
from fastapi.testclient import TestClient

from apps.api.src.main import app

client = TestClient(app)


def test_list_relief_campaigns():
    """Verify listing active disaster relief campaigns."""
    resp = client.get("/api/v1/donations/campaigns")
    assert resp.status_code == 200
    campaigns = resp.json()
    assert len(campaigns) >= 4
    chamoli = next((c for c in campaigns if "chamoli" in c["id"]), None)
    assert chamoli is not None
    assert chamoli["state"] == "Uttarakhand"
    assert chamoli["upi_id"] is not None
    assert chamoli["is_government_fund"] is True
    assert chamoli["tax_exempt_80g"] is True


def test_filter_relief_campaigns_by_state():
    """Verify filtering campaigns by state."""
    resp = client.get("/api/v1/donations/campaigns?state=Assam")
    assert resp.status_code == 200
    campaigns = resp.json()
    assert any(c["state"] == "Assam" for c in campaigns)


def test_process_donation_and_receipt():
    """Verify submitting a disaster donation and getting cryptographic receipt."""
    payload = {
        "campaign_id": "camp-uk-chamoli-2026",
        "amount_inr": 2500.0,
        "donor_name": "Vikramaditya Sharma",
        "donor_email": "vikram@example.com",
        "donor_pan": "ABCDE1234F",
        "is_anonymous": False,
        "payment_method": "UPI",
    }
    resp = client.post("/api/v1/donations/donate", json=payload)
    assert resp.status_code == 201
    receipt = resp.json()
    assert receipt["status"] == "CONFIRMED"
    assert receipt["amount_inr"] == 2500.0
    assert "RCPT-" in receipt["receipt_id"]
    assert len(receipt["transaction_hash"]) == 64  # SHA-256 hex string
    assert "80G/IT/NDMA" in receipt["tax_exemption_80g_cert"]
    assert receipt["pan_provided"] is True


def test_donation_ledger():
    """Verify public donation ledger entries."""
    resp = client.get("/api/v1/donations/ledger?limit=10")
    assert resp.status_code == 200
    ledger = resp.json()
    assert isinstance(ledger, list)
    assert len(ledger) >= 1
    assert "transaction_hash" in ledger[0]
    assert "donor_name_masked" in ledger[0]


def test_relief_fund_stats():
    """Verify aggregated pan-India relief stats."""
    resp = client.get("/api/v1/donations/stats")
    assert resp.status_code == 200
    stats = resp.json()
    assert stats["total_raised_inr"] > 0
    assert stats["total_donors"] > 0
    assert "Food & Drinking Water Rations" in stats["allocation_transparency"]
