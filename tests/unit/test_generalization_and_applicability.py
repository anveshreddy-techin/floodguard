"""
FloodGuard AI — Unit Tests for Real Training, Generalization Benchmark,
Data Leakage Detection, and Model Applicability System
SIH26192: Flash Flood Prediction System for Hilly Regions
"""
from __future__ import annotations

import numpy as np
import pytest
from fastapi.testclient import TestClient

from apps.api.src.main import app
from ml.artifacts.registry import OperationalValidationLevel
from ml.datasets.real_benchmark_loader import real_benchmark_loader
from ml.evaluation.generalization_benchmark import GeneralizationBenchmarkEngine, generalization_engine
from ml.inference.model_applicability import ModelApplicabilityEngine, ModelApplicabilityState, model_applicability_engine
from ml.schemas.dataset_manifest import DatasetDataMode, DatasetManifest


client = TestClient(app)


def test_real_benchmark_loader_and_manifest():
    """Verify loading real historical disaster observations and valid DatasetManifest."""
    X, y, meta, manifest = real_benchmark_loader.build_real_benchmark_dataset(
        n_background_samples_per_region=50,
        random_state=42,
    )

    assert isinstance(X, np.ndarray)
    assert isinstance(y, np.ndarray)
    assert len(X) == len(y) == len(meta)
    assert X.shape[1] in (25, 27)  # 25 hydrometeorological + Sentinel-2 indices

    # Verify target label distribution
    n_pos = int((y == 1).sum())
    assert n_pos > 0, "Benchmark must include verified positive event triggers"
    assert n_pos < len(y), "Benchmark must include background non-event controls"

    # Verify manifest integrity
    assert manifest.dataset_id == "DS-REAL-BENCHMARK-HIMALAYAN-v2"
    assert manifest.data_mode == DatasetDataMode.REAL_OBSERVATIONS.value
    assert len(manifest.checksum) == 64  # SHA-256 hex string
    assert "Kedarnath" in str(meta) or "Mandakini" in str(meta)
    assert "Wayanad" in str(meta) or "Chamoli" in str(meta)


def test_data_leakage_detector():
    """Verify detection of spatial overlap and temporal forward-leakage."""
    engine = GeneralizationBenchmarkEngine()

    # 1. Leakage-free split
    train_clean = [
        {"region": "UK_CHAMOLI", "timestamp": "2023-06-01T00:00:00Z"},
        {"region": "HP_KULLU", "timestamp": "2023-07-01T00:00:00Z"},
    ]
    test_clean = [
        {"region": "KL_WAYANAD", "timestamp": "2024-06-01T00:00:00Z"},
        {"region": "UK_KEDARNATH", "timestamp": "2024-07-01T00:00:00Z"},
    ]
    audit_clean = engine.detect_data_leakage(train_clean, test_clean, strict_spatial=True, strict_temporal=True)
    assert audit_clean["leakage_detected"] is False
    assert audit_clean["status"] == "LEAKAGE_FREE"
    assert len(audit_clean["spatial_overlap_basins"]) == 0

    # 2. Spatial basin overlap leakage
    train_spatial_leak = [
        {"region": "UK_CHAMOLI", "timestamp": "2023-06-01T00:00:00Z"},
        {"region": "KL_WAYANAD", "timestamp": "2023-07-01T00:00:00Z"},
    ]
    audit_spatial = engine.detect_data_leakage(train_spatial_leak, test_clean, strict_spatial=True)
    assert audit_spatial["leakage_detected"] is True
    assert "KL_WAYANAD" in audit_spatial["spatial_overlap_basins"]

    # 3. Temporal forward-split violation
    train_temporal_leak = [
        {"region": "UK_CHAMOLI", "timestamp": "2025-01-01T00:00:00Z"},
    ]
    test_past = [
        {"region": "KL_WAYANAD", "timestamp": "2024-01-01T00:00:00Z"},
    ]
    audit_temporal = engine.detect_data_leakage(train_temporal_leak, test_past, strict_spatial=False, strict_temporal=True)
    assert audit_temporal["temporal_leakage_detected"] is True
    assert audit_temporal["leakage_detected"] is True


def test_generalization_benchmark_metrics():
    """Verify computation of meteorological decision metrics (CSI, POD, FAR, Brier, ROC-AUC)."""
    engine = GeneralizationBenchmarkEngine()
    y_true = np.array([1, 1, 1, 0, 0, 0, 1, 0, 0, 0])
    y_proba = np.array([0.9, 0.8, 0.2, 0.1, 0.3, 0.4, 0.85, 0.15, 0.2, 0.05])

    metrics = engine.compute_metrics(y_true, y_proba, split_label="TEST_SPLIT", operating_threshold=0.50)
    assert 0.0 <= metrics.roc_auc <= 1.0
    assert 0.0 <= metrics.pr_auc <= 1.0
    assert 0.0 <= metrics.csi <= 1.0
    assert 0.0 <= metrics.pod <= 1.0
    assert 0.0 <= metrics.far <= 1.0
    assert 0.0 <= metrics.brier_score <= 1.0
    assert isinstance(metrics.csi, float)
    assert isinstance(metrics.pod, float)


def test_model_applicability_engine_and_readiness():
    """Verify 8 location readiness metrics and applicability classification for arbitrary locations."""
    # 1. Trained location (Chamoli, UK)
    features_trained = {
        "rainfall_3h_mm": 45.0,
        "slope_degrees": 32.0,
        "soil_saturation_index": 0.85,
        "elevation_m": 2100.0,
        "soil_moisture_pct": 78.0,
        "river_level_m": 3.2,
        "factor_of_safety_fos": 1.1,
    }
    res_trained = model_applicability_engine.evaluate_location_applicability(
        latitude=30.485,
        longitude=79.692,
        features=features_trained,
        basin_name="Alaknanda Basin",
        state_name="Uttarakhand",
        location_id="uk-chamoli-raini",
    )
    assert res_trained.state in (
        ModelApplicabilityState.MODEL_VALIDATED_FOR_LOCATION,
        ModelApplicabilityState.MODEL_SUPPORTED_WITH_LIMITED_VALIDATION,
    )
    assert res_trained.training_coverage_pct > 80.0
    assert res_trained.data_coverage_pct > 0.0
    assert res_trained.out_of_distribution_score < 40.0

    # 2. Extreme Out-of-Distribution location (Flat desert or sea level)
    features_ood = {
        "rainfall_3h_mm": 0.0,
        "slope_degrees": 0.5,
        "soil_saturation_index": 0.05,
        "elevation_m": 45.0,
    }
    res_ood = model_applicability_engine.evaluate_location_applicability(
        latitude=26.9,
        longitude=70.9,
        features=features_ood,
        basin_name="Thar Basin",
        state_name="Rajasthan",
        location_id="rj-jaisalmer",
    )
    assert res_ood.out_of_distribution_score > 30.0
    assert len(res_ood.ood_reasons) > 0

    # 3. Verify all 8 readiness metrics exist in dictionary conversion
    d = res_trained.to_dict()
    for metric_key in [
        "data_coverage_pct",
        "feature_completeness_pct",
        "training_coverage_pct",
        "validation_coverage_pct",
        "model_applicability_pct",
        "out_of_distribution_score",
        "uncertainty_score",
        "prediction_eligibility",
    ]:
        assert metric_key in d, f"Missing required readiness metric: {metric_key}"


def test_generalization_benchmark_api_endpoints():
    """Verify API endpoints expose benchmark reports and operational validation taxonomy."""
    # 1. Test NDRF router endpoint
    res1 = client.get("/api/v1/ndrf/models/generalization-benchmark")
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["benchmark_status"] == "SUCCESS"
    assert data1["operational_validation_level"] == OperationalValidationLevel.BENCHMARKED_MODEL.value
    assert "UK_KEDARNATH" in data1["unseen_test_regions"]
    assert "KL_WAYANAD" in data1["unseen_test_regions"]
    assert "per_event_performance" in data1
    assert "EVT-2013-UK-KEDARNATH" in data1["per_event_performance"]
    assert "EVT-2021-UK-CHAMOLI" in data1["per_event_performance"]
    assert "EVT-2024-KL-WAYANAD" in data1["per_event_performance"]
    assert "scientific_disclaimer" in data1

    # 2. Test global models route alias
    res2 = client.get("/api/v1/models/generalization-benchmark")
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["benchmark_status"] == "SUCCESS"
