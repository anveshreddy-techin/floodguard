"""
FloodGuard AI — Tests for Trained Model Inference and Copilot Knowledge Accuracy
"""
import pytest
from fastapi.testclient import TestClient

from apps.api.src.main import app
from apps.api.src.ml.risk_engine import (
    RainfallFeatures,
    RiverFeatures,
    SoilFeatures,
    TerrainFeatures,
    risk_engine,
)
from apps.api.src.services.copilot.document_store import DocumentStore


@pytest.fixture
def client():
    return TestClient(app)


def test_trained_ml_model_active_in_risk_engine():
    """Verify that the trained Tier C model is loaded and actively serving predictions."""
    out = risk_engine.assess(
        rainfall=RainfallFeatures(rainfall_3h_mm=75.0, intensity_mmph=45.0, data_mode="DEMO"),
        soil=SoilFeatures(saturation_index=0.88),
        terrain=TerrainFeatures(slope_degrees=32.0),
        river=RiverFeatures(level_m=4.2, rate_of_rise_mph=0.55),
    )
    assert out.model_status == "ML_ACTIVE"
    assert out.model_type == "TREE_ENSEMBLE"
    assert out.model_version == "2.0.0-tree-ensemble"
    assert out.risk_score > 50.0


def test_document_store_comprehensive_indexing():
    """Verify that DocumentStore indexes all domain knowledge files (>100 chunks)."""
    ds = DocumentStore()
    assert len(ds._chunks) >= 100
    docs = ds.list_documents()
    assert len(docs) >= 10


def test_copilot_answers_historical_disaster_queries(client):
    """Verify that Copilot accurately reconstructs 2021 Chamoli disaster facts."""
    res = client.post(
        "/api/v1/copilot/chat",
        json={
            "query": "What happened in the Chamoli disaster in 2021?",
            "role": "ANALYST",
            "data_mode": "DEMO",
            "location_id": "CHAMOLI-01",
        },
    )
    assert res.status_code == 200
    data = res.json()
    resp_text = data["response"].lower()
    assert "chamoli" in resp_text or "ronti" in resp_text
    assert "avalanche" in resp_text or "rishiganga" in resp_text
    assert len(data["citations"]) > 0


def test_copilot_answers_hydrological_equations(client):
    """Verify that Copilot accurately explains Manning's equation."""
    res = client.post(
        "/api/v1/copilot/chat",
        json={
            "query": "Explain Manning equation and its variables",
            "role": "ANALYST",
            "data_mode": "DEMO",
            "location_id": "UK_CHAMOLI",
        },
    )
    assert res.status_code == 200
    data = res.json()
    resp_text = data["response"].lower()
    assert "manning" in resp_text
    assert "roughness" in resp_text or "hydraulic radius" in resp_text or "velocity" in resp_text
    assert len(data["citations"]) > 0


def test_copilot_answers_model_architecture_and_csi(client):
    """Verify that Copilot accurately explains the 4-tier ML architecture and CSI score."""
    res = client.post(
        "/api/v1/copilot/chat",
        json={
            "query": "What is the CSI score and evaluation of the Tier C model?",
            "role": "OPERATOR",
            "data_mode": "DEMO",
            "location_id": "UK_CHAMOLI",
        },
    )
    assert res.status_code == 200
    data = res.json()
    resp_text = data["response"]
    assert "0.9903" in resp_text or "CSI" in resp_text
    assert "Tier C" in resp_text
    assert len(data["citations"]) > 0


def test_copilot_answers_state_profile(client):
    """Verify that Copilot provides Uttarakhand flood risk profile."""
    res = client.post(
        "/api/v1/copilot/chat",
        json={
            "query": "What is the flood profile of Uttarakhand?",
            "role": "CITIZEN",
            "data_mode": "DEMO",
            "location_id": "UK_KEDARNATH",
        },
    )
    assert res.status_code == 200
    data = res.json()
    resp_text = data["response"].lower()
    assert "uttarakhand" in resp_text
    assert len(data["citations"]) > 0
