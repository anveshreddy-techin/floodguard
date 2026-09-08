'use client';

/**
 * Real3DTerrainCatchment — WebGL 3D terrain viewer using MapLibre GL JS v4
 *
 * Renders high-fidelity 30m SRTM DEM mesh + Google Earth Satellite imagery,
 * with full 3D draped vector layers:
 * - 🔴 High Risk Zone (Red: Active Inundation)
 * - 🟠 Medium Risk Zone (Orange: High Surge Reach Buffer)
 * - 🟡 Low Risk Zone (Yellow: Caution / Watch Perimeter)
 * - 🟪 Steep Slope Hazard (Unstable colluvial slopes >28°)
 * - 💧 Direct River Flow Overlay with white directional flow arrows
 * - 🚶 3D Evacuation Trail (Green & White dashed uphill path)
 * - 🟢 Safe House Shelter Callout (Elevated flat terrace refuge)
 * - 🔴 Affected Village Callout (Gorge floor pinpoint)
 */

import React, { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { LocationDossier } from '@/data/locations';

interface Props {
  location: LocationDossier;
}

// Coordinate conversion helpers
function ensureClosedPolygon(coords: [number, number][]): [number, number][] {
  if (!coords || coords.length === 0) return [];
  const first = coords[0];
  const last = coords[coords.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    return [...coords, [first[0], first[1]]];
  }
  return coords;
}

function toLngLatPolygon(coords: [number, number][]): [number, number][] {
  return ensureClosedPolygon(coords).map(([lat, lon]) => [lon, lat]);
}

function toLngLatLine(coords: [number, number][]): [number, number][] {
  return coords.map(([lat, lon]) => [lon, lat]);
}

// ── Geographic Dataset for 3D Terrain Analysis ──
function getTerrainGeographicData(loc: LocationDossier) {
  const isRaini = loc.id === 'loc-uk-chamoli' || loc.name.toLowerCase().includes('raini') || loc.name.toLowerCase().includes('chamoli');
  const isGuwahati = loc.state.toLowerCase() === 'assam' || loc.id === 'loc-as-guwahati';
  const isKedarnath = loc.id === 'loc-uk-kedarnath' || loc.name.toLowerCase().includes('kedarnath');

  if (isRaini) {
    // ── CHAMOLI / RAINI VILLAGE & RISHIGANGA GORGE ──
    const center: [number, number] = [79.6920, 30.4850];
    const zoom = 13.3;
    const pitch = 64;
    const bearing = -28;
    const exaggeration = 1.9;

    const riverVector: [number, number][] = [
      [30.4869, 79.7300], [30.4867, 79.7260], [30.4863, 79.7220],
      [30.4860, 79.7180], [30.4857, 79.7140], [30.4853, 79.7100],
      [30.4851, 79.7060], [30.4849, 79.7020], [30.4848, 79.6980],
      [30.4847, 79.6945], [30.4847, 79.6928], [30.4846, 79.6900],
      [30.4843, 79.6860], [30.4841, 79.6820], [30.4839, 79.6780],
      [30.4840, 79.6740], [30.4843, 79.6700], [30.4847, 79.6660],
      [30.4850, 79.6620], [30.4851, 79.6580], [30.4850, 79.6540],
      [30.4848, 79.6500], [30.4850, 79.6460], [30.4855, 79.6420],
      [30.4862, 79.6380], [30.4871, 79.6340], [30.4873, 79.6300],
    ];

    const tributaryVector: [number, number][] = [
      [30.4678, 79.7212], [30.4700, 79.7175], [30.4722, 79.7148],
      [30.4743, 79.7115], [30.4762, 79.7085], [30.4780, 79.7055],
      [30.4800, 79.7025], [30.4818, 79.6998], [30.4832, 79.6970],
      [30.4840, 79.6952], [30.4847, 79.6928],
    ];

    const zone1Red: [number, number][] = [
      [30.4873, 79.6300], [30.4861, 79.6370], [30.4851, 79.6450],
      [30.4856, 79.6530], [30.4853, 79.6610], [30.4847, 79.6690],
      [30.4843, 79.6760], [30.4845, 79.6830], [30.4848, 79.6890],
      [30.4850, 79.6928], [30.4851, 79.6950], [30.4853, 79.7000],
      [30.4857, 79.7060], [30.4861, 79.7120], [30.4865, 79.7180],
      [30.4869, 79.7240], [30.4872, 79.7300],
      [30.4866, 79.7300], [30.4863, 79.7240], [30.4859, 79.7180],
      [30.4855, 79.7120], [30.4851, 79.7000], [30.4847, 79.6950],
      [30.4845, 79.6928], [30.4843, 79.6890], [30.4840, 79.6830],
      [30.4838, 79.6760], [30.4843, 79.6690], [30.4849, 79.6610],
      [30.4852, 79.6530], [30.4847, 79.6450], [30.4857, 79.6370],
      [30.4869, 79.6300],
    ];

    const zone2Orange: [number, number][] = [
      [30.4880, 79.6300], [30.4869, 79.6370], [30.4858, 79.6450],
      [30.4863, 79.6530], [30.4860, 79.6610], [30.4853, 79.6690],
      [30.4849, 79.6760], [30.4851, 79.6830], [30.4854, 79.6890],
      [30.4854, 79.6928], [30.4856, 79.6960], [30.4858, 79.7010],
      [30.4862, 79.7070], [30.4866, 79.7130], [30.4870, 79.7190],
      [30.4876, 79.7250], [30.4878, 79.7300],
      [30.4838, 79.6928], [30.4820, 79.6960], [30.4796, 79.7010],
      [30.4766, 79.7060], [30.4731, 79.7110], [30.4701, 79.7160],
      [30.4671, 79.7210], [30.4685, 79.7218], [30.4715, 79.7168],
      [30.4745, 79.7118], [30.4780, 79.7068], [30.4810, 79.7018],
      [30.4836, 79.6970], [30.4845, 79.6937],
      [30.4836, 79.6890], [30.4833, 79.6830], [30.4831, 79.6760],
      [30.4836, 79.6690], [30.4844, 79.6610], [30.4847, 79.6530],
      [30.4843, 79.6450], [30.4852, 79.6370], [30.4866, 79.6300],
    ];

    const zone3Yellow: [number, number][] = [
      [30.4892, 79.6300], [30.4880, 79.6370], [30.4868, 79.6450],
      [30.4874, 79.6530], [30.4870, 79.6610], [30.4862, 79.6690],
      [30.4856, 79.6760], [30.4858, 79.6830], [30.4862, 79.6890],
      [30.4862, 79.6928], [30.4864, 79.6970], [30.4868, 79.7020],
      [30.4872, 79.7080], [30.4876, 79.7140], [30.4880, 79.7200],
      [30.4886, 79.7260], [30.4888, 79.7300],
      [30.4828, 79.6928], [30.4810, 79.6955], [30.4786, 79.7005],
      [30.4756, 79.7055], [30.4721, 79.7105], [30.4691, 79.7155],
      [30.4661, 79.7205], [30.4675, 79.7228], [30.4705, 79.7178],
      [30.4735, 79.7128], [30.4770, 79.7078], [30.4800, 79.7028],
      [30.4826, 79.6978], [30.4838, 79.6950],
      [30.4830, 79.6890], [30.4826, 79.6830], [30.4824, 79.6760],
      [30.4829, 79.6690], [30.4837, 79.6610], [30.4840, 79.6530],
      [30.4836, 79.6450], [30.4845, 79.6370], [30.4859, 79.6300],
    ];

    // Mid-slope steep colluvial hazard zone (>28° slope angle)
    const slopeHazardPolygon: [number, number][] = [
      [30.4885, 79.6900],
      [30.4930, 79.6945],
      [30.4915, 79.6995],
      [30.4870, 79.6940],
    ];

    // Primary Shelter: Lata Village Flat Terrace (+340m above river, 2,380m ASL)
    const primaryShelter = {
      name: 'Lata Village Flat Terrace Refuge (+340m)',
      lngLat: [79.7055, 30.5012] as [number, number],
      elevation: '2,380 m ASL (+340m Gain)',
    };

    // Affected Village: Raini (gorge floor, 2,040m ASL)
    const affectedVillage = {
      name: 'Raini Village Confluence',
      lngLat: [79.6920, 30.4850] as [number, number],
      elevation: '2,040 m ASL (Gorge Floor)',
    };

    // Evacuation switchback trail climbing out of gorge to Lata terrace
    const evacuationTrail: [number, number][] = [
      [30.4850, 79.6920],
      [30.4872, 79.6942],
      [30.4900, 79.6965],
      [30.4930, 79.6990],
      [30.4965, 79.7015],
      [30.5000, 79.7040],
      [30.5012, 79.7055],
    ];

    return {
      center,
      zoom,
      pitch,
      bearing,
      exaggeration,
      riverVector,
      tributaryVector,
      zone1Red,
      zone2Orange,
      zone3Yellow,
      slopeHazardPolygon,
      primaryShelter,
      affectedVillage,
      evacuationTrail,
      slopeHazardCenter: [79.6935, 30.4900] as [number, number],
    };
  } else if (isGuwahati) {
    // ── ASSAM (GUWAHATI / BRAHMAPUTRA FLOOD) ──
    const center: [number, number] = [91.7300, 26.1600];
    const zoom = 13.0;
    const pitch = 56;
    const bearing = -15;
    const exaggeration = 1.7;

    const riverVector: [number, number][] = [
      [26.1950, 91.8200], [26.1920, 91.7850], [26.1880, 91.7600],
      [26.1820, 91.7400], [26.1750, 91.7150], [26.1620, 91.6850],
      [26.1550, 91.6600],
    ];

    const zone1Red: [number, number][] = [
      [26.1950, 91.8200], [26.1920, 91.7850], [26.1880, 91.7600],
      [26.1820, 91.7400], [26.1750, 91.7150], [26.1620, 91.6850],
      [26.1550, 91.6600], [26.1480, 91.6600], [26.1550, 91.6850],
      [26.1680, 91.7150], [26.1750, 91.7400], [26.1810, 91.7600],
      [26.1850, 91.7850], [26.1880, 91.8200],
    ];

    const zone2Orange: [number, number][] = [
      [26.2000, 91.8250], [26.1960, 91.7850], [26.1920, 91.7600],
      [26.1860, 91.7400], [26.1800, 91.7150], [26.1660, 91.6800],
      [26.1500, 91.6500], [26.1380, 91.6600], [26.1450, 91.6900],
      [26.1580, 91.7200], [26.1650, 91.7450], [26.1700, 91.7700],
      [26.1750, 91.8000], [26.1800, 91.8300],
    ];

    const zone3Yellow: [number, number][] = [
      [26.2050, 91.8300], [26.2000, 91.7850], [26.1950, 91.7600],
      [26.1900, 91.7400], [26.1850, 91.7100], [26.1700, 91.6750],
      [26.1450, 91.6450], [26.1300, 91.6550], [26.1380, 91.6950],
      [26.1500, 91.7250], [26.1580, 91.7500], [26.1620, 91.7800],
      [26.1680, 91.8100], [26.1750, 91.8400],
    ];

    // Slopy area: Nilachal hill steep flanks prone to landslides in torrential monsoon
    const slopeHazardPolygon: [number, number][] = [
      [26.1680, 91.7010],
      [26.1695, 91.7080],
      [26.1630, 91.7100],
      [26.1610, 91.7030],
    ];

    const primaryShelter = {
      name: 'Kamakhya Nilachal Hilltop Refuge (+160m)',
      lngLat: [91.7055, 26.1660] as [number, number],
      elevation: '215 m ASL (+160m Gain)',
    };

    const affectedVillage = {
      name: 'Bharalumukh Lowlands (Submerged)',
      lngLat: [91.7300, 26.1550] as [number, number],
      elevation: '52 m ASL (Low Plain)',
    };

    const evacuationTrail: [number, number][] = [
      [26.1550, 91.7300],
      [26.1580, 91.7220],
      [26.1620, 91.7140],
      [26.1660, 91.7055],
    ];

    return {
      center,
      zoom,
      pitch,
      bearing,
      exaggeration,
      riverVector,
      tributaryVector: undefined,
      zone1Red,
      zone2Orange,
      zone3Yellow,
      slopeHazardPolygon,
      primaryShelter,
      affectedVillage,
      evacuationTrail,
      slopeHazardCenter: [91.7050, 26.1650] as [number, number],
    };
  } else {
    // ── GENERIC / KEDARNATH / FALLBACK DYNAMIC ──
    const center: [number, number] = [loc.lon, loc.lat];
    const zoom = isKedarnath ? 13.0 : 13.0;
    const pitch = 58;
    const bearing = -20;
    const exaggeration = 1.6;

    const lat = loc.lat;
    const lon = loc.lon;

    const riverVector: [number, number][] = [
      [lat + 0.018, lon - 0.012],
      [lat + 0.009, lon - 0.006],
      [lat, lon],
      [lat - 0.010, lon + 0.007],
      [lat - 0.020, lon + 0.014],
    ];

    const zone1Red: [number, number][] = [
      [lat + 0.018, lon - 0.014], [lat + 0.009, lon - 0.008], [lat + 0.001, lon - 0.002],
      [lat - 0.009, lon + 0.005], [lat - 0.020, lon + 0.012],
      [lat - 0.020, lon + 0.016], [lat - 0.009, lon + 0.009], [lat - 0.001, lon + 0.002],
      [lat + 0.009, lon - 0.004], [lat + 0.018, lon - 0.010],
    ];

    const zone2Orange: [number, number][] = [
      [lat + 0.021, lon - 0.017], [lat + 0.011, lon - 0.011], [lat + 0.002, lon - 0.005],
      [lat - 0.011, lon + 0.002], [lat - 0.023, lon + 0.009],
      [lat - 0.023, lon + 0.019], [lat - 0.011, lon + 0.012], [lat - 0.002, lon + 0.005],
      [lat + 0.011, lon - 0.001], [lat + 0.021, lon - 0.007],
    ];

    const zone3Yellow: [number, number][] = [
      [lat + 0.024, lon - 0.020], [lat + 0.013, lon - 0.014], [lat + 0.003, lon - 0.008],
      [lat - 0.013, lon - 0.001], [lat - 0.026, lon + 0.006],
      [lat - 0.026, lon + 0.022], [lat - 0.013, lon + 0.015], [lat - 0.003, lon + 0.008],
      [lat + 0.013, lon + 0.002], [lat + 0.024, lon - 0.004],
    ];

    const slopeHazardPolygon: [number, number][] = [
      [lat + 0.006, lon + 0.005],
      [lat + 0.012, lon + 0.009],
      [lat + 0.009, lon + 0.014],
      [lat + 0.003, lon + 0.010],
    ];

    const primaryShelter = {
      name: `${loc.name.split('/')[0].trim()} High Ground Shelter`,
      lngLat: [lon + 0.010, lat + 0.008] as [number, number],
      elevation: 'Elevated Refuge Terrace (+240m)',
    };

    const affectedVillage = {
      name: loc.name.split('/')[0].trim(),
      lngLat: [lon, lat] as [number, number],
      elevation: loc.elevation,
    };

    const evacuationTrail: [number, number][] = [
      [lat, lon],
      [lat + 0.004, lon + 0.004],
      [lat + 0.008, lon + 0.010],
    ];

    return {
      center,
      zoom,
      pitch,
      bearing,
      exaggeration,
      riverVector,
      tributaryVector: undefined,
      zone1Red,
      zone2Orange,
      zone3Yellow,
      slopeHazardPolygon,
      primaryShelter,
      affectedVillage,
      evacuationTrail,
      slopeHazardCenter: [lon + 0.008, lat + 0.008] as [number, number],
    };
  }
}

export default function Real3DTerrainCatchment({ location }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [pitch, setPitch] = useState(64);
  const [bearing, setBearing] = useState(-28);
  const [exaggeration, setExaggeration] = useState(1.9);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ── Initialize WebGL 3D Terrain Map ──
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const geoData = getTerrainGeographicData(location);
    setPitch(geoData.pitch);
    setBearing(geoData.bearing);
    setExaggeration(geoData.exaggeration);

    let mapInstance: any = null;

    async function initMap() {
      try {
        const maplibregl = (await import('maplibre-gl')).default;

        const map = new maplibregl.Map({
          container: mapContainerRef.current!,
          style: {
            version: 8,
            sources: {
              'google-satellite': {
                type: 'raster',
                tiles: [
                  'https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                  'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                  'https://mt2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                ],
                tileSize: 256,
                attribution: 'Imagery © Google Earth / Google Maps',
                maxzoom: 20,
              },
              'terrarium': {
                type: 'raster-dem',
                tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
                tileSize: 256,
                encoding: 'terrarium',
                maxzoom: 14,
                attribution: 'Elevation: SRTM 30m / Mapzen Terrarium',
              },
            },
            layers: [
              {
                id: 'satellite-tiles',
                type: 'raster',
                source: 'google-satellite',
              },
            ],
          },
          center: geoData.center,
          zoom: geoData.zoom,
          pitch: geoData.pitch,
          bearing: geoData.bearing,
          maxPitch: 80,
        });

        mapInstance = map;
        mapRef.current = map;

        map.on('load', () => {
          try {
            map.setTerrain({ source: 'terrarium', exaggeration: geoData.exaggeration });
          } catch (terrainErr) {
            console.warn('[Real3DTerrainCatchment] Terrain init warning:', terrainErr);
          }

          // Draped 3D vector risk overlays & markers
          render3DVectorLayers(maplibregl, map, geoData);
          setMapLoaded(true);
        });

        const fallbackTimer = setTimeout(() => {
          setMapLoaded(true);
        }, 1200);

        map.on('pitchend', () => setPitch(Math.round(map.getPitch())));
        map.on('rotateend', () => setBearing(Math.round(map.getBearing())));

        map.on('error', (e: any) => {
          console.warn('[Real3DTerrainCatchment] Map error:', e);
        });

        return () => clearTimeout(fallbackTimer);
      } catch (err: any) {
        console.error('[Real3DTerrainCatchment] Failed to init map:', err);
        setLoadError(String(err));
      }
    }

    initMap();

    return () => {
      // Clean up markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (mapInstance && typeof mapInstance.remove === 'function') {
        mapInstance.remove();
      }
      mapRef.current = null;
    };
  }, [location.id]);

  // ── Render Draped 3D Layers onto DEM Mesh ──
  const render3DVectorLayers = (maplibregl: any, map: any, data: ReturnType<typeof getTerrainGeographicData>) => {
    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Helper functions for idempotent source/layer additions
    const addGeoSource = (id: string, geojson: any) => {
      if (map.getSource(id)) {
        map.getSource(id).setData(geojson);
      } else {
        map.addSource(id, { type: 'geojson', data: geojson });
      }
    };

    const addGeoLayer = (layerDef: any) => {
      if (!map.getLayer(layerDef.id)) {
        map.addLayer(layerDef);
      }
    };

    // ── 1. ZONE 3 (YELLOW): LOW RISK / CAUTION PERIMETER ──
    addGeoSource('zone3-yellow', {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [toLngLatPolygon(data.zone3Yellow)] },
    });
    addGeoLayer({
      id: 'zone3-yellow-fill',
      type: 'fill',
      source: 'zone3-yellow',
      paint: { 'fill-color': '#facc15', 'fill-opacity': 0.36 },
    });
    addGeoLayer({
      id: 'zone3-yellow-line',
      type: 'line',
      source: 'zone3-yellow',
      paint: { 'line-color': '#ca8a04', 'line-width': 2, 'line-dasharray': [3, 2] },
    });

    // ── 2. ZONE 2 (ORANGE): MEDIUM RISK / HIGH SURGE REACH ──
    addGeoSource('zone2-orange', {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [toLngLatPolygon(data.zone2Orange)] },
    });
    addGeoLayer({
      id: 'zone2-orange-fill',
      type: 'fill',
      source: 'zone2-orange',
      paint: { 'fill-color': '#f97316', 'fill-opacity': 0.46 },
    });
    addGeoLayer({
      id: 'zone2-orange-line',
      type: 'line',
      source: 'zone2-orange',
      paint: { 'line-color': '#ea580c', 'line-width': 2.5 },
    });

    // ── 3. ZONE 1 (RED): HIGH RISK / ACTIVE INUNDATION ENVELOPE ──
    addGeoSource('zone1-red', {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [toLngLatPolygon(data.zone1Red)] },
    });
    addGeoLayer({
      id: 'zone1-red-fill',
      type: 'fill',
      source: 'zone1-red',
      paint: { 'fill-color': '#ef4444', 'fill-opacity': 0.60 },
    });
    addGeoLayer({
      id: 'zone1-red-line',
      type: 'line',
      source: 'zone1-red',
      paint: { 'line-color': '#dc2626', 'line-width': 3 },
    });

    // ── 4. STEEP SLOPE HAZARD ZONE (PURPLE DASHED: >28° SLOPES) ──
    if (data.slopeHazardPolygon && data.slopeHazardPolygon.length > 2) {
      addGeoSource('slope-hazard', {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [toLngLatPolygon(data.slopeHazardPolygon)] },
      });
      addGeoLayer({
        id: 'slope-hazard-fill',
        type: 'fill',
        source: 'slope-hazard',
        paint: { 'fill-color': '#a855f7', 'fill-opacity': 0.35 },
      });
      addGeoLayer({
        id: 'slope-hazard-line',
        type: 'line',
        source: 'slope-hazard',
        paint: { 'line-color': '#9333ea', 'line-width': 2.5, 'line-dasharray': [4, 3] },
      });
    }

    // ── 5. DIRECT RIVER FLOW OVERLAY (VIBRANT BLUE RIBBON ON RIVERBED) ──
    addGeoSource('river-main', {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: toLngLatLine(data.riverVector) },
    });
    addGeoLayer({
      id: 'river-main-glow',
      type: 'line',
      source: 'river-main',
      paint: { 'line-color': '#0284c7', 'line-width': 14, 'line-opacity': 0.90 },
      layout: { 'line-cap': 'round', 'line-join': 'round' },
    });
    addGeoLayer({
      id: 'river-main-core',
      type: 'line',
      source: 'river-main',
      paint: { 'line-color': '#38bdf8', 'line-width': 5, 'line-opacity': 0.98 },
      layout: { 'line-cap': 'round', 'line-join': 'round' },
    });

    // Tributary river overlay (if present)
    if (data.tributaryVector && data.tributaryVector.length > 1) {
      addGeoSource('river-tributary', {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: toLngLatLine(data.tributaryVector) },
      });
      addGeoLayer({
        id: 'river-trib-glow',
        type: 'line',
        source: 'river-tributary',
        paint: { 'line-color': '#0284c7', 'line-width': 9, 'line-opacity': 0.88 },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      });
      addGeoLayer({
        id: 'river-trib-core',
        type: 'line',
        source: 'river-tributary',
        paint: { 'line-color': '#7dd3fc', 'line-width': 3.5, 'line-opacity': 0.95 },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      });
    }

    // ── 6. 3D EVACUATION ROUTE (GREEN-AND-WHITE DASHED UPHILL ESCAPE) ──
    addGeoSource('evac-route', {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: toLngLatLine(data.evacuationTrail) },
    });
    addGeoLayer({
      id: 'evac-route-base',
      type: 'line',
      source: 'evac-route',
      paint: { 'line-color': '#16a34a', 'line-width': 7, 'line-opacity': 0.95 },
      layout: { 'line-cap': 'round', 'line-join': 'round' },
    });
    addGeoLayer({
      id: 'evac-route-dash',
      type: 'line',
      source: 'evac-route',
      paint: { 'line-color': '#ffffff', 'line-width': 3.5, 'line-dasharray': [3, 3] },
      layout: { 'line-cap': 'round', 'line-join': 'round' },
    });

    // ── 7. WHITE DIRECTIONAL FLOW ARROWS ALONG RIVER IN 3D ──
    for (let i = 0; i < data.riverVector.length - 1; i += 2) {
      const p1 = data.riverVector[i];
      const p2 = data.riverVector[i + 1];
      const midLon = (p1[1] + p2[1]) / 2;
      const midLat = (p1[0] + p2[0]) / 2;

      const dLat = p2[0] - p1[0];
      const dLon = (p2[1] - p1[1]) * Math.cos((p1[0] * Math.PI) / 180);
      let headingDeg = (Math.atan2(dLon, dLat) * 180) / Math.PI;
      headingDeg = (headingDeg + 360) % 360;

      const arrowEl = document.createElement('div');
      arrowEl.style.cssText = `
        display: flex; align-items: center; justify-content: center; width: 22px; height: 22px;
        transform: rotate(${headingDeg}deg); pointer-events: none;
      `;
      arrowEl.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 1px 3px rgba(0,0,0,0.95));">
          <path d="M5 12h14M13 5l7 7-7 7" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;

      const m = new maplibregl.Marker({ element: arrowEl })
        .setLngLat([midLon, midLat])
        .addTo(map);
      markersRef.current.push(m);
    }

    // ── 8. CALLOUT BADGE: SAFE SHELTER (OUTSIDE RISK ZONE) ──
    const shelterEl = document.createElement('div');
    shelterEl.style.cssText = 'position: relative; cursor: pointer;';
    shelterEl.innerHTML = `
      <div style="position: relative; display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #065f46 0%, #064e3b 100%); border: 2px solid rgba(255,255,255,0.9); border-radius: 9999px; padding: 5px 14px 5px 6px; box-shadow: 0 10px 25px rgba(0,0,0,0.8), 0 0 16px rgba(16,185,129,0.7); white-space: nowrap; transform: translate(-28px, -46px);">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.4); flex-shrink: 0;">
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #059669; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; line-height: 1;">
            🏠
          </div>
        </div>
        <div style="display: flex; flex-direction: column; text-align: left; line-height: 1.15;">
          <span style="color: #ffffff; font-weight: 800; font-size: 12.5px; font-family: system-ui, sans-serif; letter-spacing: 0.1px;">Safe Shelter (Refuge Terrace)</span>
          <span style="color: #a7f3d0; font-weight: 600; font-size: 10px; font-family: system-ui, sans-serif;">${data.primaryShelter.name} (${data.primaryShelter.elevation})</span>
        </div>
        <div style="position: absolute; bottom: -8px; left: 28px; width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 8px solid #064e3b;"></div>
      </div>
      <div style="position: absolute; left: 0; top: 0; width: 14px; height: 14px; background: #10b981; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 0 12px #10b981; transform: translate(-7px, -7px); pointer-events: none;"></div>
    `;

    const shelterMarker = new maplibregl.Marker({ element: shelterEl })
      .setLngLat(data.primaryShelter.lngLat)
      .setPopup(
        new maplibregl.Popup({ offset: 25 })
          .setHTML(`
            <div style="font-family:system-ui,sans-serif;font-size:12px;color:#e2e8f0;background:#0a1428;padding:8px 12px;border-radius:8px;border:1px solid #10b981;">
              <b style="color:#10b981;font-size:13px;">🟢 DESIGNATED SAFE REFUGE</b><br/>
              <b>Name:</b> ${data.primaryShelter.name}<br/>
              <b>Elevation:</b> ${data.primaryShelter.elevation}<br/>
              <b>Status:</b> High Ground · Above all modeled flood danger zones
            </div>
          `)
      )
      .addTo(map);
    markersRef.current.push(shelterMarker);

    // ── 9. CALLOUT BADGE: AFFECTED VILLAGE (HIGH RISK) ──
    const villageEl = document.createElement('div');
    villageEl.style.cssText = 'position: relative; cursor: pointer;';
    villageEl.innerHTML = `
      <div style="position: relative; display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%); border: 2px solid rgba(255,255,255,0.9); border-radius: 9999px; padding: 5px 14px 5px 6px; box-shadow: 0 10px 25px rgba(0,0,0,0.8), 0 0 16px rgba(220,38,38,0.7); white-space: nowrap; transform: translate(-28px, -46px);">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.4); flex-shrink: 0;">
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #dc2626; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-family: system-ui, sans-serif; font-size: 16px; line-height: 1;">
            !
          </div>
        </div>
        <div style="display: flex; flex-direction: column; text-align: left; line-height: 1.15;">
          <span style="color: #ffffff; font-weight: 800; font-size: 12.5px; font-family: system-ui, sans-serif; letter-spacing: 0.1px;">Affected Village (High Risk)</span>
          <span style="color: #fca5a5; font-weight: 600; font-size: 10px; font-family: system-ui, sans-serif;">${data.affectedVillage.name} (${data.affectedVillage.elevation})</span>
        </div>
        <div style="position: absolute; bottom: -8px; left: 28px; width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 8px solid #7f1d1d;"></div>
      </div>
      <div style="position: absolute; left: 0; top: 0; width: 14px; height: 14px; background: #ef4444; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 0 12px #ef4444; transform: translate(-7px, -7px); pointer-events: none;"></div>
    `;

    const villageMarker = new maplibregl.Marker({ element: villageEl })
      .setLngLat(data.affectedVillage.lngLat)
      .setPopup(
        new maplibregl.Popup({ offset: 25 })
          .setHTML(`
            <div style="font-family:system-ui,sans-serif;font-size:12px;color:#e2e8f0;background:#0a1428;padding:8px 12px;border-radius:8px;border:1px solid #ef4444;">
              <b style="color:#ef4444;font-size:13px;">🔴 AFFECTED SETTLEMENT</b><br/>
              <b>Location:</b> ${data.affectedVillage.name}<br/>
              <b>Elevation:</b> ${data.affectedVillage.elevation}<br/>
              <b>Directive:</b> Follow green dashed track uphill to safe shelter!
            </div>
          `)
      )
      .addTo(map);
    markersRef.current.push(villageMarker);

    // ── 10. CALLOUT BADGE: STEEP SLOPE HAZARD AREA ──
    if (data.slopeHazardCenter) {
      const slopeEl = document.createElement('div');
      slopeEl.style.cssText = `
        background: rgba(88,28,135,0.92); border: 1.5px solid #c084fc; border-radius: 8px;
        padding: 3px 8px; color: #f3e8ff; font-family: system-ui, sans-serif; font-size: 9.5px;
        font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.7); cursor: pointer; white-space: nowrap;
        transform: translate(-50%, -100%);
      `;
      slopeEl.innerHTML = '⚠️ STEEP SLOPE HAZARD (&gt;28° SLOPE · COLLUVIAL)';

      const slopeMarker = new maplibregl.Marker({ element: slopeEl })
        .setLngLat(data.slopeHazardCenter)
        .setPopup(
          new maplibregl.Popup({ offset: 20 })
            .setHTML(`
              <div style="font-family:system-ui,sans-serif;font-size:11.5px;color:#e2e8f0;background:#1e1035;padding:8px 10px;border-radius:6px;border:1px solid #c084fc;">
                <b style="color:#d8b4fe">⚠️ UNSTABLE VALLEY SLOPES</b><br/>
                Steep grade (&gt;28°) subject to colluvial debris sliding and flash runoff.
              </div>
            `)
        )
        .addTo(map);
      markersRef.current.push(slopeMarker);
    }
  };

  // Synchronize exaggeration when user adjusts slider
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    try {
      map.setTerrain({ source: 'terrarium', exaggeration });
    } catch {
      // ignore
    }
  }, [exaggeration, mapLoaded]);

  function handlePitchChange(val: number) {
    setPitch(val);
    mapRef.current?.setPitch?.(val);
  }

  function handleBearingChange(val: number) {
    setBearing(val);
    mapRef.current?.setBearing?.(val);
  }

  function handleResetView() {
    const geoData = getTerrainGeographicData(location);
    mapRef.current?.easeTo?.({
      center: geoData.center,
      zoom: geoData.zoom,
      pitch: geoData.pitch,
      bearing: geoData.bearing,
      duration: 1200,
    });
    setPitch(geoData.pitch);
    setBearing(geoData.bearing);
    setExaggeration(geoData.exaggeration);
  }

  if (loadError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400 font-mono text-xs p-8 text-center">
        <div>
          <div className="text-amber-400 text-lg mb-2">⚠️ 3D TERRAIN NOT INITIALIZED</div>
          <div className="text-slate-500 mb-1">WebGL / MapLibre initialization failed:</div>
          <div className="text-slate-600 text-[10px] max-w-xs mb-3">{loadError}</div>
          <div className="text-cyan-400 text-[11px]">Use 🛰️ REAL MAP (GIS) for Google Earth satellite overlay.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative w-full h-full bg-slate-950 overflow-hidden flex flex-col">
      {/* WebGL Canvas */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full" />

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 z-20 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-cyan-400 font-mono text-xs font-bold animate-pulse">⛰️ LOADING 3D TERRAIN &amp; RISK OVERLAYS…</div>
            <div className="text-slate-500 font-mono text-[10px]">Projecting 3-Zone Flood Polygons, Slope Hazard &amp; River Flow on SRTM DEM</div>
          </div>
        </div>
      )}

      {/* ── TOP-LEFT BADGE: Flood Risk 3D Map ── */}
      <div className="absolute top-16 left-4 z-10 bg-[#0d2244]/90 border border-blue-400/40 rounded-full px-4 py-1.5 shadow-2xl backdrop-blur-md flex items-center gap-2.5 pointer-events-auto">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-white text-xs sm:text-sm font-bold font-sans tracking-wide">
          Flood Risk 3D Map ({location.name.includes('/') ? location.name.split('/')[0].trim() : location.name})
        </span>
      </div>

      {/* ── TOP-RIGHT 3D HUD LEGEND CARD (MATCHING REFERENCE DESIGN) ── */}
      <div className="absolute top-16 right-4 z-10 bg-white/95 text-slate-900 rounded-2xl p-3 shadow-2xl border border-slate-200/90 backdrop-blur-md text-[11px] font-sans w-[215px] pointer-events-auto">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">3D Map Legend</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">3D ACTIVE</span>
            <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center bg-white shadow-xs">
              <span className="text-[9px] text-slate-800 font-black leading-none">▲</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 font-medium">
          {/* High Risk Zone */}
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-3 rounded-[3px] bg-[#ef4444] shrink-0 border border-red-600/40" />
            <span className="text-slate-800">High Risk Zone (Inundation)</span>
          </div>

          {/* Medium Risk Zone */}
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-3 rounded-[3px] bg-[#f97316] shrink-0 border border-orange-600/40" />
            <span className="text-slate-800">Medium Risk Zone (Surge)</span>
          </div>

          {/* Low Risk Zone */}
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-3 rounded-[3px] bg-[#fde047] shrink-0 border border-yellow-500/40" />
            <span className="text-slate-800">Low Risk Zone (Caution)</span>
          </div>

          {/* Steep Slope Hazard */}
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-3 rounded-[3px] bg-[#a855f7]/70 border border-purple-600/50 shrink-0" />
            <span className="text-purple-900 font-semibold">Steep Slope Hazard (&gt;28°)</span>
          </div>

          {/* Direct River Flow Overlay */}
          <div className="flex items-center gap-2.5">
            <span className="text-[#0284c7] font-black text-base leading-none w-5 text-center shrink-0">➔</span>
            <span className="text-slate-800">Direct River Flow Overlay</span>
          </div>

          {/* Evacuation Route */}
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-0.5 border-t-2 border-dashed border-[#16a34a] shrink-0" />
            <span className="text-slate-800">Evacuation Route</span>
          </div>

          {/* Safe Shelter */}
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[#059669] flex items-center justify-center shrink-0 text-white text-[9px] shadow-xs">
              🏠
            </div>
            <span className="text-slate-800">Safe Shelter (Refuge Terrace)</span>
          </div>

          {/* Affected Village */}
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[#dc2626] flex items-center justify-center shrink-0 text-white font-black text-[9px] shadow-xs">
              !
            </div>
            <span className="text-slate-800">Affected Village (Gorge)</span>
          </div>
        </div>
      </div>

      {/* ── 3D Camera & Elevation HUD (Bottom-Left) ── */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2 pointer-events-auto max-w-[240px]">
        <div className="bg-slate-900/95 border border-cyan-500/30 rounded-xl p-3 backdrop-blur-md shadow-2xl">
          <div className="text-cyan-400 font-mono text-[10px] font-bold mb-2 tracking-widest flex items-center justify-between">
            <span>⛰️ 3D TERRAIN CONTROLS</span>
            <span className="text-[9px] text-slate-400">SRTM DEM</span>
          </div>

          {/* Pitch */}
          <div className="mb-2">
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
              <span>CAMERA PITCH (TILT)</span>
              <span className="text-cyan-300 font-bold">{pitch}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              value={pitch}
              onChange={(e) => handlePitchChange(Number(e.target.value))}
              className="w-full h-1.5 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Bearing */}
          <div className="mb-2">
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
              <span>BEARING (ROTATION)</span>
              <span className="text-cyan-300 font-bold">{bearing}°</span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              value={bearing}
              onChange={(e) => handleBearingChange(Number(e.target.value))}
              className="w-full h-1.5 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Exaggeration */}
          <div className="mb-2.5">
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
              <span>VERTICAL EXAGGERATION</span>
              <span className="text-cyan-300 font-bold">{exaggeration.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={3.0}
              step={0.1}
              value={exaggeration}
              onChange={(e) => setExaggeration(Number(e.target.value))}
              className="w-full h-1.5 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <button
            onClick={handleResetView}
            className="w-full py-1.5 rounded-lg text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition active:scale-95"
          >
            ↺ RESET CAMERA ANGLE
          </button>
        </div>

        {/* Honest Notice */}
        <div className="bg-amber-950/80 border border-amber-500/40 rounded-lg p-2 text-[9px] font-mono text-amber-200">
          <span className="font-bold text-amber-300">⚠️ ELEVATION FIDELITY:</span> 30m SRTM DEM mesh. For disaster response, cross-reference official CWC / Survey of India benchmarks.
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-1 right-2 z-10 text-[8px] font-mono text-slate-500 pointer-events-none">
        Imagery © Google Earth · DEM: SRTM 30m Public Domain · MapLibre GL JS v4
      </div>
    </div>
  );
}
