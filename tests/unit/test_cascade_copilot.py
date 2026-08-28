"""
Unit tests for Upstream-to-Downstream Cascade Engine and Grounded Copilot.
"""
from apps.api.src.services.cascade_engine import CascadeEngine
from apps.api.src.gis.spatial_service import SpatialService


def test_cascade_engine_escalation():
    res = CascadeEngine.evaluate_cascade(
        rainfall_mm=55.0,
        soil_saturation=0.88,
        river_rate_of_rise=0.60,
    )
    assert res["cascade_status"] == "ACTIVE_ESCALATION"
    assert res["overall_exposure"] == "EXTREME"
    assert len(res["nodes"]) == 5
    assert len(res["edges"]) == 4


def test_spatial_service_geojson_validity():
    ws_geojson = SpatialService.get_demo_watershed_geojson()
    assert ws_geojson["type"] == "FeatureCollection"
    assert len(ws_geojson["features"]) >= 2
    for f in ws_geojson["features"]:
        assert f["geometry"]["type"] == "Polygon"

    river_geojson = SpatialService.get_demo_river_network_geojson()
    assert river_geojson["type"] == "FeatureCollection"
    assert len(river_geojson["features"]) >= 2
    for f in river_geojson["features"]:
        assert f["geometry"]["type"] == "LineString"


def test_haversine_distance():
    # Distance between two nearby coordinates in Uttarakhand
    d = SpatialService.haversine_distance_km(30.2, 78.8, 30.15, 78.85)
    assert 5.0 < d < 12.0
