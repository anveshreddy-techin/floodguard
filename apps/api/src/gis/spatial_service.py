"""
FloodGuard AI — Spatial & GIS Service
Provides GeoJSON layers, watershed bounding calculations, distance to river, and exposure intersections.
"""
from typing import Any
import math

class SpatialService:
    @staticmethod
    def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate great-circle distance between two points in km."""
        r = 6371.0  # Earth's radius in km
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)

        a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return r * c

    @staticmethod
    def get_demo_watershed_geojson() -> dict[str, Any]:
        """Returns standard GeoJSON FeatureCollection for demo mountain watershed and villages."""
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "id": "ws-001",
                    "properties": {
                        "name": "Upper Catchment Ridge Basin",
                        "code": "DEMO-WS-001",
                        "area_km2": 85.4,
                        "mean_elevation_m": 1380.0,
                        "risk_level": "HIGH",
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [78.75, 30.25],
                            [78.85, 30.25],
                            [78.88, 30.18],
                            [78.80, 30.12],
                            [78.72, 30.15],
                            [78.75, 30.25],
                        ]],
                    },
                },
                {
                    "type": "Feature",
                    "id": "ws-002",
                    "properties": {
                        "name": "Lower Valley Inundation Basin",
                        "code": "DEMO-WS-002",
                        "area_km2": 120.8,
                        "mean_elevation_m": 780.0,
                        "risk_level": "EXTREME",
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [78.80, 30.12],
                            [78.88, 30.18],
                            [78.95, 30.10],
                            [78.86, 30.04],
                            [78.78, 30.08],
                            [78.80, 30.12],
                        ]],
                    },
                },
            ],
        }

    @staticmethod
    def get_demo_river_network_geojson() -> dict[str, Any]:
        """Returns GeoJSON FeatureCollection for main river channel and tributaries."""
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "id": "river-main",
                    "properties": {
                        "name": "Alaknanda Tributary (Demo Mainstem)",
                        "strahler_order": 4,
                        "flow_direction": "North-West to South-East",
                        "current_level_m": 3.8,
                        "warning_level_m": 4.5,
                        "danger_level_m": 6.0,
                    },
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [78.76, 30.24],
                            [78.80, 30.20],
                            [78.83, 30.16],
                            [78.85, 30.12],
                            [78.88, 30.07],
                            [78.92, 30.05],
                        ],
                    },
                },
                {
                    "type": "Feature",
                    "id": "river-trib-1",
                    "properties": {
                        "name": "Upper Ridge Stream 1",
                        "strahler_order": 2,
                    },
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [78.73, 30.22],
                            [78.77, 30.21],
                            [78.80, 30.20],
                        ],
                    },
                },
            ],
        }

    @staticmethod
    def get_demo_villages_geojson() -> dict[str, Any]:
        """Returns GeoJSON FeatureCollection for village locations and exposure status."""
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "id": "v-001",
                    "properties": {
                        "name": "Chandpur Village (Upper Slope)",
                        "population": 850,
                        "elevation_m": 1240,
                        "risk_level": "MODERATE",
                        "exposure": "Moderate (Debris runout corridor)",
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [78.79, 30.21],
                    },
                },
                {
                    "type": "Feature",
                    "id": "v-002",
                    "properties": {
                        "name": "Ramgarh Village (Mid Slope)",
                        "population": 1200,
                        "elevation_m": 980,
                        "risk_level": "HIGH",
                        "exposure": "High (Steep gorge proximity)",
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [78.83, 30.17],
                    },
                },
                {
                    "type": "Feature",
                    "id": "v-003",
                    "properties": {
                        "name": "Sunderbans Nagar (Downstream Valley)",
                        "population": 3400,
                        "elevation_m": 720,
                        "risk_level": "EXTREME",
                        "exposure": "Extreme (Direct alluvial fan & bottleneck)",
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [78.87, 30.08],
                    },
                },
            ],
        }


spatial_service = SpatialService()
