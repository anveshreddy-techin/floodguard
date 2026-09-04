"""
Unit Tests for FloodGuard AI — Continuous Multi-Source Ingestion & Multi-Agency Disaster Dispatch
Verifies SIH26192 Requirements:
1. Universal Ingestion for all data types (Meteorological, Hydrological, Geotechnical, Geological, IoT, Field Logs)
2. Ingestion across different locations and roles (NDRF, Field Hydrologists, Volunteers, IoT Gateways)
3. Dynamic multi-source alert dispatch (OASIS CAP v1.2, CMAS Cell Broadcast, State EOC, Siren, NDRF)
4. Continuous training ground-truth buffering and audit ledger
"""
import pytest
from fastapi.testclient import TestClient

from apps.api.src.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_ingest_meteorological_data(client):
    """Test rainfall QPE ingestion and immediate model re-scoring."""
    res = client.post(
        "/api/v1/ingestion/input",
        json={
            "source_type": "METEOROLOGICAL",
            "location": {"village_id": "uk-chamoli-raini", "state": "Uttarakhand"},
            "reporter": {"role": "FIELD_HYDROLOGIST", "organization": "IMD Radar Center"},
            "payload": {
                "rainfall_1h_mm": 48.0,
                "rainfall_3h_mm": 76.0,
                "rainfall_peak_intensity_mmph": 52.0,
            },
            "is_ground_truth": True,
            "data_mode": "LIVE",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "SUCCESS"
    assert "risk_assessment" in data
    assert data["risk_assessment"]["composite_risk_score"] > 0
    assert "hyper_local_wards" in data
    assert len(data["hyper_local_wards"]) == 4

    # Verify Multi-Agency Outbound Dispatches
    outbound = data["disaster_management_outbound"]
    assert "oasis_cap_xml" in outbound
    assert outbound["oasis_cap_xml"]["status"] == "GENERATED"
    assert "cmas_cell_broadcast" in outbound
    assert "hi" in outbound["cmas_cell_broadcast"]["bilingual_payload"]
    assert "state_eoc_webhook" in outbound
    assert "local_siren_controller" in outbound
    assert "ndrf_battalion_deployment" in outbound


def test_ingest_hydrological_and_geotechnical_data(client):
    """Test river gauge and soil moisture sensor ingestion."""
    # Hydrological
    res_hydro = client.post(
        "/api/v1/ingestion/input",
        json={
            "source_type": "HYDROLOGICAL",
            "location": {"village_id": "hp-kullu-bhuntar"},
            "reporter": {"role": "CWC_GAUGE_OPERATOR", "organization": "CWC Beas Division"},
            "payload": {"river_level_m": 4.8, "river_rate_of_rise_mph": 0.65},
        },
    )
    assert res_hydro.status_code == 200
    data_h = res_hydro.json()
    assert data_h["location"]["resolved_village_id"] == "hp-kullu-bhuntar"

    # Geotechnical
    res_geo = client.post(
        "/api/v1/ingestion/input",
        json={
            "source_type": "GEOTECHNICAL",
            "location": {"village_id": "kl-wayanad-meppadi"},
            "reporter": {"role": "GEOTECHNICAL_ENGINEER", "organization": "GSI Kerala Unit"},
            "payload": {"volumetric_moisture_pct": 46.5, "soil_saturation_index": 0.90},
        },
    )
    assert res_geo.status_code == 200
    data_g = res_geo.json()
    assert data_g["location"]["resolved_village_id"] == "kl-wayanad-meppadi"
    assert data_g["risk_assessment"]["composite_risk_score"] >= 50.0


def test_ingest_community_and_iot_field_reports(client):
    """Test Aapda Mitra volunteer logs and LoRaWAN IoT telemetry."""
    # Community field log
    res_comm = client.post(
        "/api/v1/ingestion/input",
        json={
            "source_type": "COMMUNITY_FIELD",
            "location": {"village_id": "loc-uk-kedarnath"},
            "reporter": {"role": "AAPDA_MITRA_VOLUNTEER", "operator_name": "Ramesh Rawat"},
            "payload": {
                "staff_gauge_reading_m": 4.80,
                "debris_flow_observed": True,
                "eyewitness_notes": "Heavy sediment surge observed in Mandakini gorge",
            },
            "is_ground_truth": True,
        },
    )
    assert res_comm.status_code == 200
    data_c = res_comm.json()
    assert "Kedarnath" in data_c["location"]["village_name"]
    # Debris flow observation escalates risk
    assert data_c["risk_assessment"]["composite_risk_score"] >= 65.0

    # IoT telemetry
    res_iot = client.post(
        "/api/v1/ingestion/input",
        json={
            "source_type": "IOT_TELEMETRY",
            "location": {"village_id": "sk-teesta-singtam"},
            "reporter": {"role": "IOT_SENSOR", "organization": "LoRaWAN Mesh Node 04"},
            "payload": {
                "geophone_debris_vibration_db": 44.5,
                "culvert_backpressure_ratio": 0.85,
            },
        },
    )
    assert res_iot.status_code == 200
    data_iot = res_iot.json()
    assert data_iot["risk_assessment"]["composite_risk_score"] > 60.0


def test_disaster_management_outbound_ledger(client):
    """Verify external dispatch records are persisted in audit ledger."""
    res = client.get("/api/v1/ingestion/disaster-management/outbound-log")
    assert res.status_code == 200
    data = res.json()
    assert "outbound_log" in data
    assert data["total_dispatches"] > 0

    first = data["outbound_log"][0]
    assert "ingest_id" in first
    assert "outbound_dispatches" in first
    assert "oasis_cap_xml" in first["outbound_dispatches"]
    assert "cmas_cell_broadcast" in first["outbound_dispatches"]


def test_continuous_training_buffer_and_trigger(client):
    """Verify verified ground-truth observations are buffered and status retrievable."""
    res = client.get("/api/v1/ingestion/training-buffer/status")
    assert res.status_code == 200
    data = res.json()
    assert "total_buffered_samples" in data
    assert "ready_for_retraining" in data
