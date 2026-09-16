'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LocationDossier, LOCATIONS } from '@/data/locations';
import { 
  CloudRain, 
  Waves, 
  Layers, 
  Droplets, 
  MapPin, 
  RotateCcw,
  Plus,
  Minus,
  X,
  Compass,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { VERIFIED_OSM_HYDROGRAPHY } from '@/services/gisService';

export type DashboardLayer = 'RISK' | 'RAINFALL' | 'RIVER' | 'SOIL' | 'LAYERS';
export type DashboardBaseMap = 'SATELLITE' | 'TOPO' | 'STREET';

interface DashboardRealMapProps {
  location?: LocationDossier | null;
  activeLayer: DashboardLayer;
  onLayerChange: (layer: DashboardLayer) => void;
}

/**
 * Generates an organic, smooth ellipse/envelope polygon on earth coordinates
 */
function createSmoothBlob(
  lat: number,
  lon: number,
  rxMeters: number,
  ryMeters: number,
  angleDeg = 0,
  steps = 28
): [number, number][] {
  const points: [number, number][] = [];
  const rad = (angleDeg * Math.PI) / 180;
  const cosA = Math.cos(rad);
  const sinA = Math.sin(rad);
  const latFactor = 111320;
  const lonFactor = 111320 * Math.cos((lat * Math.PI) / 180);

  for (let i = 0; i < steps; i++) {
    const theta = (i / steps) * 2 * Math.PI;
    const dx0 = rxMeters * Math.cos(theta);
    const dy0 = ryMeters * Math.sin(theta);

    const dx = dx0 * cosA - dy0 * sinA;
    const dy = dx0 * sinA + dy0 * cosA;

    const ptLat = lat + dy / latFactor;
    const ptLon = lon + dx / lonFactor;
    points.push([ptLat, ptLon]);
  }
  return points;
}

export const DashboardRealMap: React.FC<DashboardRealMapProps> = ({
  location,
  activeLayer,
  onLayerChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const [baseMap, setBaseMap] = useState<DashboardBaseMap>('SATELLITE');
  const [mapReady, setMapReady] = useState(false);
  const [showLayerDrawer, setShowLayerDrawer] = useState(false);

  // Default fallback location is Chamoli / Raini Village
  const activeLoc = location || LOCATIONS.find((l) => l.id === 'loc-uk-chamoli') || LOCATIONS[0];
  const isRaini = activeLoc.id === 'loc-uk-chamoli' || activeLoc.name.toLowerCase().includes('raini');

  // Custom layer toggles inside the layer drawer
  const [customLayers, setCustomLayers] = useState({
    dangerZones: true,
    safeRefuge: true,
    safeRoute: true,
    settlements: true,
    riverChannel: true,
    sensors: true,
  });

  // Reusable Layer Rendering Function
  const renderAllLayers = useCallback((map: any, lg: any, L: any) => {
    if (!map || !lg || !L) return;

    // Invalidate size immediately so tiles fill the whole container
    map.invalidateSize();

    // 1. Update Realistic Base Tile Layer (Blazing Fast Google Hybrid Satellite or Topo)
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    let subdomains: string[] | string = ['0', '1', '2', '3'];
    let maxZoom = 20;
    let attribution = 'Imagery © Google Earth · FloodGuard AI';

    if (baseMap === 'TOPO') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      subdomains = ['a', 'b', 'c'];
      maxZoom = 17;
      attribution = '© OpenTopoMap · FloodGuard AI';
    } else if (baseMap === 'STREET') {
      tileUrl = 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      subdomains = ['0', '1', '2', '3'];
      maxZoom = 20;
      attribution = '© Google Maps · FloodGuard AI';
    }

    const tileLayer = L.tileLayer(tileUrl, {
      subdomains,
      maxZoom,
      attribution,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // 2. Clear previous overlay layers
    lg.clearLayers();

    const lat = activeLoc.lat;
    const lon = activeLoc.lon;

    // Authoritative OSM hydrography for Chamoli / Dhauliganga
    const riverVector: [number, number][] = isRaini && VERIFIED_OSM_HYDROGRAPHY['loc-uk-chamoli']
      ? VERIFIED_OSM_HYDROGRAPHY['loc-uk-chamoli'][0].coords
      : [
          [lat - 0.015, lon - 0.02],
          [lat - 0.008, lon - 0.012],
          [lat, lon - 0.005],
          [lat + 0.008, lon + 0.006],
          [lat + 0.015, lon + 0.018],
        ];

    // High Ground Safe Assembly Shelter coordinates (Lata Village +320m above gorge floor)
    const shelterCoords: [number, number] = isRaini
      ? [30.5025, 79.7055]
      : [lat + 0.0170, lon + 0.0125];

    // ── A. RISK MAP LAYER: EXACT DANGER OVERLAYS ON REALISTIC MAP ──
    if (activeLayer === 'RISK' || activeLayer === 'LAYERS') {
      
      // 1. VIBRANT DANGER ZONES OVER REAL SATELLITE IMAGERY (Matching user image)
      if (customLayers.dangerZones) {
        // Red Blob 1: Upper Gorge & Confluence Core Inundation Zone
        const redBlob1 = createSmoothBlob(lat + 0.0015, lon + 0.0005, 520, 310, -25);
        L.polygon(redBlob1, {
          color: '#ef4444',
          weight: 2.5,
          fillColor: '#dc2626',
          fillOpacity: 0.62,
        })
          .bindTooltip('🔴 HIGH RISK ZONE: Flash Flood Core Surge (>1.5m) — Immediate Evacuation', { sticky: true })
          .addTo(lg);

        // Red Blob 2: Downstream Gorge Chokepoint & Barrage Bottleneck
        const redBlob2 = createSmoothBlob(lat - 0.0035, lon - 0.0050, 420, 260, 35);
        L.polygon(redBlob2, {
          color: '#ef4444',
          weight: 2.5,
          fillColor: '#dc2626',
          fillOpacity: 0.62,
        })
          .bindTooltip('🔴 HIGH RISK ZONE: Secondary Gorge Surge Impact Area', { sticky: true })
          .addTo(lg);

        // Orange Blob: Medium Risk Surge Wave Reach (0.5m – 1.5m)
        const orangeBlob = createSmoothBlob(lat + 0.0065, lon + 0.0055, 480, 320, -15);
        L.polygon(orangeBlob, {
          color: '#f97316',
          weight: 2,
          fillColor: '#ea580c',
          fillOpacity: 0.52,
        })
          .bindTooltip('🟠 MEDIUM RISK ZONE: Surge Spillover Corridor (0.5m – 1.5m depth)', { sticky: true })
          .addTo(lg);

        // Yellow Blob: Low Risk Caution Buffer Perimeter (<0.5m)
        const yellowBlob = createSmoothBlob(lat + 0.0115, lon + 0.0110, 560, 350, 20);
        L.polygon(yellowBlob, {
          color: '#facc15',
          weight: 2,
          fillColor: '#eab308',
          fillOpacity: 0.42,
          dashArray: '6, 5',
        })
          .bindTooltip('🟡 LOW RISK ZONE: Peripheral Caution Buffer (Overland Runoff)', { sticky: true })
          .addTo(lg);
      }

      // 2. 🟢 GREEN SAFE REFUGE AREA (HIGH GROUND SHELTER ENVELOPE)
      if (customLayers.safeRefuge) {
        const safeBlob = createSmoothBlob(shelterCoords[0], shelterCoords[1], 480, 340, 10);
        L.polygon(safeBlob, {
          color: '#22c55e',
          weight: 2.5,
          fillColor: '#16a34a',
          fillOpacity: 0.52,
          dashArray: '5, 4',
        })
          .bindTooltip('🟢 SAFE AREA: High-Elevation Refuge (+320m ASL) · Zero Surge Exposure', { sticky: true })
          .addTo(lg);

        // 3. 🔵 SAFE SHELTER BADGE (BLUE CIRCULAR ICON MATCHING USER IMAGE)
        const shelterIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background: #0284c7; color: white; width: 34px; height: 34px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(2,132,199,0.7); display: flex; align-items: center; justify-content: center; font-size: 16px;">
              <span>🏕️</span>
            </div>
          `,
          iconAnchor: [17, 17],
        });

        L.marker(shelterCoords, { icon: shelterIcon })
          .bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <b style="color: #0284c7; font-size: 13px;">🏕️ Lata High School Safe Assembly Shelter</b><br/>
              <span style="font-size: 11px; color: #475569;">Elevation: 2,360m ASL (+320m above riverbed)</span><br/>
              <div style="margin-top: 6px; padding: 6px; background: #eff6ff; border-radius: 8px; font-size: 11px; color: #1e40af; font-weight: bold; border: 1px solid #bfdbfe;">
                ✅ DESIGNATED SAFE HAVEN: High ground refuge completely clear of flood waters.<br/>
                Capacity: 450 persons · Drinking water & medical kits ready.
              </div>
            </div>
          `)
          .addTo(lg);
      }

      // 4. ⚪ WHITE DASHED SAFE EVACUATION ROUTE TO SAFE PLACE
      if (customLayers.safeRoute) {
        const safeTrail: [number, number][] = isRaini
          ? [
              [30.4855, 79.6920], // Raini Village (High Danger Start)
              [30.4895, 79.6960], // North Ridge Spur Ascent
              [30.4950, 79.7005], // Mid-Saddle Contour (+180m)
              [30.4995, 79.7035], // Upper Pine Ridge (+260m)
              [shelterCoords[0], shelterCoords[1]], // Lata Safe Shelter (+320m ASL)
            ]
          : [
              [lat, lon],
              [lat + 0.006, lon + 0.005],
              [lat + 0.012, lon + 0.009],
              [shelterCoords[0], shelterCoords[1]],
            ];

        // Cyan-blue glowing contrast ribbon behind dashed line
        L.polyline(safeTrail, {
          color: '#0284c7',
          weight: 8,
          opacity: 0.55,
        }).addTo(lg);

        // Core crisp White Dashed Evacuation Trail (Matching user image)
        L.polyline(safeTrail, {
          color: '#ffffff',
          weight: 4,
          opacity: 1,
          dashArray: '7, 6',
        })
          .bindTooltip('⚪ RECOMMENDED SAFE ROUTE: North Ridge Trail to Safe Shelter (1.4 km)', { sticky: true })
          .addTo(lg);

        // Intermediate Waypoint on Safe Trail
        const waypointCoords = safeTrail[Math.floor(safeTrail.length / 2)];
        const waypointIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background: #ffffff; color: #0284c7; width: 18px; height: 18px; border-radius: 50%; border: 2px solid #0284c7; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">
              ▲
            </div>
          `,
          iconAnchor: [9, 9],
        });
        L.marker(waypointCoords, { icon: waypointIcon })
          .bindTooltip('Waymark: Uphill North Ridge Path (+180m ASL)', { sticky: true })
          .addTo(lg);
      }

      // 5. 🏠 COLOR-CODED SETTLEMENT DANGER BADGES (MATCHING USER IMAGE)
      if (customLayers.settlements) {
        // Red Zone Settlements (White circular badge with Red fill)
        const redHouses = isRaini
          ? [
              { lat: 30.4865, lon: 79.6920, name: 'Raini Lower Settlement (38 Dwellings)' },
              { lat: 30.4825, lon: 79.6875, name: 'Tapovan Gorge Worksite Basti' },
            ]
          : [{ lat: lat + 0.001, lon: lon, name: activeLoc.name }];

        redHouses.forEach((h) => {
          const redIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div style="background: #dc2626; color: white; width: 26px; height: 26px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 12px;">
                <span>🏠</span>
              </div>
            `,
            iconAnchor: [13, 13],
          });
          L.marker([h.lat, h.lon], { icon: redIcon })
            .bindPopup(`
              <div style="font-family: sans-serif; padding: 3px;">
                <b style="color: #dc2626; font-size: 12px;">🔴 High Danger: ${h.name}</b><br/>
                <span style="font-size: 10px; color: #64748b;">Direct inundation path · Evacuate via white trail</span>
              </div>
            `)
            .addTo(lg);
        });

        // Orange Zone Settlements (White circular badge with Orange fill)
        const orangeHouses = isRaini
          ? [{ lat: 30.4910, lon: 79.6970, name: 'Upper Raini Hamlet (19 Dwellings)' }]
          : [{ lat: lat + 0.006, lon: lon + 0.005, name: 'Mid-Slope Dwellings' }];

        orangeHouses.forEach((h) => {
          const orangeIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div style="background: #ea580c; color: white; width: 26px; height: 26px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 12px;">
                <span>🏠</span>
              </div>
            `,
            iconAnchor: [13, 13],
          });
          L.marker([h.lat, h.lon], { icon: orangeIcon })
            .bindPopup(`
              <div style="font-family: sans-serif; padding: 3px;">
                <b style="color: #ea580c; font-size: 12px;">🟠 Medium Danger: ${h.name}</b><br/>
                <span style="font-size: 10px; color: #64748b;">Surge wave proximity · Standby for uphill movement</span>
              </div>
            `)
            .addTo(lg);
        });

        // Yellow Zone Settlements (White circular badge with Yellow fill)
        const yellowHouses = isRaini
          ? [{ lat: 30.4965, lon: 79.7025, name: 'Pang Peripheral Hamlet (14 Dwellings)' }]
          : [{ lat: lat + 0.011, lon: lon + 0.010, name: 'Caution Zone Dwellings' }];

        yellowHouses.forEach((h) => {
          const yellowIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div style="background: #eab308; color: white; width: 26px; height: 26px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 12px;">
                <span>🏠</span>
              </div>
            `,
            iconAnchor: [13, 13],
          });
          L.marker([h.lat, h.lon], { icon: yellowIcon })
            .bindPopup(`
              <div style="font-family: sans-serif; padding: 3px;">
                <b style="color: #ca8a04; font-size: 12px;">🟡 Low Danger: ${h.name}</b><br/>
                <span style="font-size: 10px; color: #64748b;">Runoff buffer zone · Monitor emergency broadcast</span>
              </div>
            `)
            .addTo(lg);
        });

        // Safe Area Houses (White circular badge with Dark Slate fill)
        const safeHouses = isRaini
          ? [
              { lat: 30.4810, lon: 79.6990, name: 'Upper Ridge Terraces' },
              { lat: 30.4940, lon: 79.7110, name: 'East Mountain Farms' },
            ]
          : [{ lat: lat - 0.005, lon: lon + 0.008, name: 'Safe Ridge Homestead' }];

        safeHouses.forEach((h) => {
          const safeHouseIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div style="background: #0f172a; color: white; width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 11px;">
                <span>🏠</span>
              </div>
            `,
            iconAnchor: [12, 12],
          });
          L.marker([h.lat, h.lon], { icon: safeHouseIcon })
            .bindTooltip(`Safe Settlement: ${h.name}`, { sticky: true })
            .addTo(lg);
        });
      }

      // 6. River Watercourse (Vibrant Cyan & Blue Polyline)
      if (customLayers.riverChannel) {
        L.polyline(riverVector, {
          color: '#0284c7',
          weight: 6,
          opacity: 0.85,
        }).addTo(lg);

        L.polyline(riverVector, {
          color: '#38bdf8',
          weight: 2.5,
          opacity: 1,
          dashArray: '6, 6',
        }).addTo(lg);
      }
    }

    // ── B. RAINFALL DOPPLER RADAR LAYER ──
    if (activeLayer === 'RAINFALL') {
      const radarCenter: [number, number] = [lat + 0.008, lon - 0.005];
      L.circle(radarCenter, {
        radius: 1800,
        color: '#ef4444',
        weight: 2,
        fillColor: '#ef4444',
        fillOpacity: 0.35,
      })
        .bindTooltip('🌧️ IMD Doppler Radar: Severe Convective Storm Cell (48.2 mm / 3h)', { sticky: true })
        .addTo(lg);

      L.circle(radarCenter, {
        radius: 1000,
        color: '#b91c1c',
        weight: 2,
        fillColor: '#991b1b',
        fillOpacity: 0.45,
      }).addTo(lg);

      const rainGaugeIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background: #1e3a8a; color: white; padding: 4px 8px; border-radius: 10px; font-weight: 800; font-size: 11px; border: 2px solid #60a5fa; box-shadow: 0 4px 8px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 4px; white-space: nowrap; font-family: sans-serif;">
            <span>🌧️</span>
            <span>AWS-001 (Joshimath): 48.2 mm</span>
          </div>
        `,
        iconAnchor: [55, 12],
      });
      L.marker([lat + 0.005, lon - 0.008], { icon: rainGaugeIcon })
        .bindPopup('<b>AWS-001 Rain Gauge</b><br/>Rainfall: 48.2 mm in 3h<br/>Intensity: 16.1 mm/h (Extreme Cloudburst)')
        .addTo(lg);
    }

    // ── C. RIVER LEVELS FMCW RADAR LAYER ──
    if (activeLayer === 'RIVER') {
      L.polyline(riverVector, {
        color: '#0284c7',
        weight: 8,
        opacity: 0.9,
      }).addTo(lg);

      L.polyline(riverVector, {
        color: '#38bdf8',
        weight: 4,
        opacity: 1,
        dashArray: '8, 8',
      }).addTo(lg);

      const riverGaugeIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background: #0f172a; color: #38bdf8; padding: 4px 8px; border-radius: 10px; font-weight: 800; font-size: 11px; border: 2px solid #38bdf8; box-shadow: 0 4px 8px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 4px; white-space: nowrap; font-family: sans-serif;">
            <span>🌊</span>
            <span>CWC Radar Gauge: 3.80m (↑ +0.40m/h)</span>
          </div>
        `,
        iconAnchor: [70, 12],
      });
      L.marker([lat + 0.001, lon - 0.003], { icon: riverGaugeIcon })
        .bindPopup(`
          <div style="font-family: sans-serif;">
            <b>CWC Tapovan FMCW Radar Stage Gauge</b><br/>
            Current Stage: <b>3.80 m</b><br/>
            Warning Level: <b>3.50 m (EXCEEDED)</b><br/>
            Danger Level: <b>4.20 m (Approaching in 45 min)</b><br/>
            Surge Rate: <b>+0.40 m/h</b>
          </div>
        `)
        .addTo(lg);
    }

    // ── D. SOIL MOISTURE & SLOPE STABILITY LAYER ──
    if (activeLayer === 'SOIL') {
      const slopePolygon: [number, number][] = [
        [lat + 0.006, lon + 0.002],
        [lat + 0.009, lon + 0.007],
        [lat + 0.004, lon + 0.010],
        [lat + 0.002, lon + 0.005],
      ];

      L.polygon(slopePolygon, {
        color: '#d97706',
        weight: 2,
        fillColor: '#f59e0b',
        fillOpacity: 0.35,
        dashArray: '5, 4',
      })
        .bindTooltip('⛰️ Steep Colluvial Slope (>38°): High Soil Saturation Liquefaction Risk', { sticky: true })
        .addTo(lg);

      const soilProbeIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background: #78350f; color: #fef3c7; padding: 4px 8px; border-radius: 10px; font-weight: 800; font-size: 11px; border: 2px solid #f59e0b; box-shadow: 0 4px 8px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 4px; white-space: nowrap; font-family: sans-serif;">
            <span>💧</span>
            <span>SOIL-002: 82.4% Saturation</span>
          </div>
        `,
        iconAnchor: [60, 12],
      });
      L.marker([lat + 0.005, lon + 0.004], { icon: soilProbeIcon })
        .bindPopup('<b>SOIL-002 Mid-Slope TDR Probe</b><br/>Volumetric Saturation: 82.4%<br/>Infiltration Buffer: EXHAUSTED (Runoff coeff: 0.85)')
        .addTo(lg);
    }
  }, [activeLoc, baseMap, activeLayer, customLayers, isRaini]);

  // 1. Initialize Leaflet Map on Mount and render immediately
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isCancelled = false;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      if (isCancelled || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [activeLoc.lat + 0.006, activeLoc.lon + 0.004],
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: true,
        });

        const lg = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
        layerGroupRef.current = lg;

        // Render layers IMMEDIATELY on creation
        renderAllLayers(map, lg, L);

        setMapReady(true);

        setTimeout(() => map.invalidateSize(), 50);
        setTimeout(() => map.invalidateSize(), 200);
        setTimeout(() => map.invalidateSize(), 500);
      }
    };

    initMap();

    const ro = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      ro.observe(mapContainerRef.current);
    }

    return () => {
      isCancelled = true;
      ro.disconnect();
    };
  }, [activeLoc.lat, activeLoc.lon, renderAllLayers]);

  // 2. Re-render when activeLayer, baseMap, or customLayers change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !layerGroupRef.current) return;

    const updateLayers = async () => {
      const L = (await import('leaflet')).default;
      renderAllLayers(mapInstanceRef.current, layerGroupRef.current, L);
    };

    updateLayers();
  }, [mapReady, renderAllLayers]);

  const handleResetView = () => {
    if (mapInstanceRef.current && activeLoc) {
      mapInstanceRef.current.setView([activeLoc.lat + 0.006, activeLoc.lon + 0.004], 14, { animate: true });
      mapInstanceRef.current.invalidateSize();
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="w-full h-full flex flex-col min-h-[380px] sm:min-h-[440px]">
      {/* ── TOP CONTROL BAR: LAYER TABS + BASE MAP TOGGLE ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs shrink-0 mb-2 font-sans select-none relative z-30">
        
        {/* Left: Scientific Layer Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => {
              onLayerChange('RISK');
              setShowLayerDrawer(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeLayer === 'RISK'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <span>Risk Map</span>
          </button>

          <button
            onClick={() => {
              onLayerChange('RAINFALL');
              setShowLayerDrawer(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeLayer === 'RAINFALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-blue-600" />
            <span>Rainfall</span>
          </button>

          <button
            onClick={() => {
              onLayerChange('RIVER');
              setShowLayerDrawer(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeLayer === 'RIVER'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-teal-600" />
            <span>River Levels</span>
          </button>

          <button
            onClick={() => {
              onLayerChange('SOIL');
              setShowLayerDrawer(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeLayer === 'SOIL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-amber-600" />
            <span>Soil Moisture</span>
          </button>

          {/* Layer Customization Popover Toggle */}
          <button
            onClick={() => setShowLayerDrawer((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              showLayerDrawer
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
            title="Toggle individual GIS layer visibility"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layers</span>
          </button>
        </div>

        {/* Right: Map Style (Satellite / Topo / Street) & Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="bg-slate-50 p-0.5 rounded-lg border border-slate-200 flex items-center gap-0.5 text-[10px] font-mono font-bold">
            <button
              onClick={() => setBaseMap('SATELLITE')}
              className={`px-2 py-0.5 rounded transition ${
                baseMap === 'SATELLITE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Realistic Google Earth Hybrid Satellite Imagery"
            >
              🛰️ Satellite
            </button>
            <button
              onClick={() => setBaseMap('TOPO')}
              className={`px-2 py-0.5 rounded transition ${
                baseMap === 'TOPO'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Topographic Mountain Elevation Contours"
            >
              ⛰️ Topo
            </button>
            <button
              onClick={() => setBaseMap('STREET')}
              className={`px-2 py-0.5 rounded transition ${
                baseMap === 'STREET'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Standard Street Map"
            >
              🗺️ Street
            </button>
          </div>

          <button
            onClick={handleResetView}
            className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition active:scale-95"
            title="Reset Map Center View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Popover Layer Filter Drawer */}
        {showLayerDrawer && (
          <div className="absolute top-full left-3 mt-1.5 w-72 bg-white/98 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-xl z-50 text-xs font-mono flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>GIS Overlay Layers</span>
              </span>
              <button
                onClick={() => setShowLayerDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <label className="flex items-center justify-between text-slate-700 cursor-pointer hover:text-slate-900">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-red-600 inline-block" />
                <span>Danger Zones (Red/Orange/Yellow)</span>
              </span>
              <input
                type="checkbox"
                checked={customLayers.dangerZones}
                onChange={(e) => setCustomLayers((p) => ({ ...p, dangerZones: e.target.checked }))}
                className="rounded text-red-600"
              />
            </label>

            <label className="flex items-center justify-between text-slate-700 cursor-pointer hover:text-slate-900">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
                <span>Safe Area (+320m Ridge)</span>
              </span>
              <input
                type="checkbox"
                checked={customLayers.safeRefuge}
                onChange={(e) => setCustomLayers((p) => ({ ...p, safeRefuge: e.target.checked }))}
                className="rounded text-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between text-slate-700 cursor-pointer hover:text-slate-900">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 rounded bg-white border border-slate-400 inline-block" />
                <span>White Dashed Safe Route</span>
              </span>
              <input
                type="checkbox"
                checked={customLayers.safeRoute}
                onChange={(e) => setCustomLayers((p) => ({ ...p, safeRoute: e.target.checked }))}
                className="rounded text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between text-slate-700 cursor-pointer hover:text-slate-900">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white inline-block" />
                <span>Settlements (🏠 Badges)</span>
              </span>
              <input
                type="checkbox"
                checked={customLayers.settlements}
                onChange={(e) => setCustomLayers((p) => ({ ...p, settlements: e.target.checked }))}
                className="rounded text-red-600"
              />
            </label>

            <label className="flex items-center justify-between text-slate-700 cursor-pointer hover:text-slate-900">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 rounded bg-cyan-500 inline-block" />
                <span>River Watercourse</span>
              </span>
              <input
                type="checkbox"
                checked={customLayers.riverChannel}
                onChange={(e) => setCustomLayers((p) => ({ ...p, riverChannel: e.target.checked }))}
                className="rounded text-cyan-600"
              />
            </label>
          </div>
        )}
      </div>

      {/* ── REALISTIC MAP CANVAS (SATELLITE BASE WITH VIBRANT COLOR OVERLAYS) ── */}
      <div className="relative flex-1 w-full min-h-[340px] sm:min-h-[380px] bg-slate-900 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        
        {/* Leaflet Map Div */}
        <div 
          ref={mapContainerRef} 
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        />

        {/* Floating Zoom Buttons (Top Right of Map) */}
        <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1 pointer-events-auto">
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 bg-white/95 hover:bg-white text-slate-700 rounded-lg border border-slate-200 shadow-md flex items-center justify-center transition active:scale-90"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 bg-white/95 hover:bg-white text-slate-700 rounded-lg border border-slate-200 shadow-md flex items-center justify-center transition active:scale-90"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Map Legend (Bottom Left of Map) — Exact from Reference Image */}
        <div className="absolute bottom-3 left-3 z-[400] pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-300 text-[10px] font-mono text-slate-800 flex items-center gap-3 shadow-md">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded bg-red-600 inline-block" /> High
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block" /> Medium
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded bg-yellow-400 inline-block" /> Low
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Safe
            </span>
          </div>
        </div>

        {/* Floating Coordinates (Bottom Right of Map) */}
        <div className="absolute bottom-3 right-3 z-[400] pointer-events-none hidden md:flex">
          <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700 text-[10px] font-mono text-slate-200 flex items-center gap-1.5 shadow-md">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>{activeLoc.lat.toFixed(4)}°N, {activeLoc.lon.toFixed(4)}°E ({activeLoc.elevation})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRealMap;
