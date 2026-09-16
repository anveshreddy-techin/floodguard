'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { LocationDossier, LOCATIONS } from '@/data/locations';
import { 
  CloudRain, 
  Waves, 
  Layers, 
  Droplets, 
  ShieldAlert, 
  MapPin, 
  Compass, 
  RotateCcw,
  Navigation,
  Radio,
  AlertTriangle,
  Home
} from 'lucide-react';
import { VERIFIED_OSM_HYDROGRAPHY, getFloodRiskPolygons } from '@/services/gisService';

export type DashboardLayer = 'RISK' | 'RAINFALL' | 'RIVER' | 'SOIL' | 'LAYERS';
export type DashboardBaseMap = 'SATELLITE' | 'TOPO' | 'STREET';

interface DashboardRealMapProps {
  location?: LocationDossier | null;
  activeLayer: DashboardLayer;
  onLayerChange: (layer: DashboardLayer) => void;
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
  const [mapLoaded, setMapLoaded] = useState(false);

  // Default fallback location is Chamoli / Raini Village
  const activeLoc = location || LOCATIONS.find((l) => l.id === 'loc-uk-chamoli') || LOCATIONS[0];
  const isRaini = activeLoc.id === 'loc-uk-chamoli' || activeLoc.name.toLowerCase().includes('raini');

  // Custom layer toggles inside the 'LAYERS' tab
  const [customLayers, setCustomLayers] = useState({
    floodZone: true,
    evacRoute: true,
    sensors: true,
    slopeHazard: true,
    riverChannel: true,
  });

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isCancelled = false;

    const initMap = async () => {
      // Inject Leaflet CSS if not already present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const L = (await import('leaflet')).default;
      if (isCancelled || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [activeLoc.lat, activeLoc.lon],
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: true,
        });

        // Add clean attribution
        L.control
          .attribution({ position: 'bottomright', prefix: false })
          .addAttribution('© Google Earth / OSM · FloodGuard AI')
          .addTo(map);

        mapInstanceRef.current = map;
        layerGroupRef.current = L.layerGroup().addTo(map);
        setMapLoaded(true);
      }
    };

    initMap();

    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. Center map when location changes
  useEffect(() => {
    if (!mapInstanceRef.current || !activeLoc) return;
    mapInstanceRef.current.setView([activeLoc.lat, activeLoc.lon], 14, { animate: true });
  }, [activeLoc.lat, activeLoc.lon]);

  // 3. Render Base Tiles & Vector Overlays based on activeLayer and baseMap
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const renderLayers = async () => {
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;
      const lg = layerGroupRef.current;

      // Update Tile Layer
      if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);

      let tileUrl = 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      let subdomains = ['0', '1', '2', '3'];
      let maxZoom = 20;

      if (baseMap === 'TOPO') {
        tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        subdomains = ['a', 'b', 'c'];
        maxZoom = 17;
      } else if (baseMap === 'STREET') {
        tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        subdomains = ['a', 'b', 'c', 'd'];
        maxZoom = 19;
      }

      const tileLayer = L.tileLayer(tileUrl, {
        subdomains,
        maxZoom,
      }).addTo(map);
      tileLayerRef.current = tileLayer;

      // Clear previous layers
      lg.clearLayers();

      // Coordinates setup
      const lat = activeLoc.lat;
      const lon = activeLoc.lon;

      // Real hydrography for Chamoli / Dhauliganga
      const riverVector: [number, number][] = isRaini && VERIFIED_OSM_HYDROGRAPHY['loc-uk-chamoli']
        ? VERIFIED_OSM_HYDROGRAPHY['loc-uk-chamoli'][0].coords
        : [
            [lat - 0.015, lon - 0.02],
            [lat - 0.008, lon - 0.012],
            [lat, lon - 0.005],
            [lat + 0.008, lon + 0.006],
            [lat + 0.015, lon + 0.018],
          ];

      // Safe assembly shelter coordinates
      const shelterCoords: [number, number] = isRaini
        ? [30.5020, 79.7040] // Lata Village Assembly Shelter (+320m above gorge)
        : [lat + 0.012, lon + 0.01];

      // Secondary shelter
      const secShelterCoords: [number, number] = isRaini
        ? [30.4910, 79.7060] // Upper Raini Spur (+140m ASL)
        : [lat + 0.006, lon + 0.015];

      // ── A. RISK MAP LAYER (Default & Primary Operational View) ──
      if (activeLayer === 'RISK' || activeLayer === 'LAYERS') {
        if (customLayers.floodZone) {
          // Compute buffered flood zones along actual river course
          const floodZones = getFloodRiskPolygons(activeLoc.id, lat, lon, riverVector);

          // Zone 3: Yellow Caution Buffer
          L.polygon(floodZones.zone3Yellow, {
            color: '#facc15',
            weight: 1.5,
            fillColor: '#facc15',
            fillOpacity: 0.18,
            dashArray: '4, 4',
          })
            .bindTooltip('🟡 Zone 3: Caution Infiltration (<0.5m flow depth)', { sticky: true })
            .addTo(lg);

          // Zone 2: Orange Flash Surge Wave
          L.polygon(floodZones.zone2Orange, {
            color: '#f97316',
            weight: 2,
            fillColor: '#ea580c',
            fillOpacity: 0.28,
          })
            .bindTooltip('🟠 Zone 2: Flash Surge Wave (0.5m – 1.5m depth)', { sticky: true })
            .addTo(lg);

          // Zone 1: Red Core Inundation Corridor
          L.polygon(floodZones.zone1Red, {
            color: '#ef4444',
            weight: 2.5,
            fillColor: '#dc2626',
            fillOpacity: 0.42,
          })
            .bindTooltip('🔴 Zone 1: Active Inundation Channel (>1.5m depth) — CRITICAL', { sticky: true })
            .addTo(lg);
        }

        // River Flow Vector
        if (customLayers.riverChannel) {
          L.polyline(riverVector, {
            color: '#0284c7',
            weight: 5,
            opacity: 0.9,
          }).addTo(lg);

          L.polyline(riverVector, {
            color: '#38bdf8',
            weight: 2,
            opacity: 1,
            dashArray: '6, 6',
          }).addTo(lg);
        }

        // Evacuation Safe Trail to Lata Shelter
        if (customLayers.evacRoute) {
          const safeTrail: [number, number][] = isRaini
            ? [
                [30.4850, 79.6920], // Raini Village
                [30.4885, 79.6955], // Ridge junction
                [30.4940, 79.7005], // Mid spur
                [30.5020, 79.7040], // Lata Assembly Shelter
              ]
            : [
                [lat, lon],
                [lat + 0.005, lon + 0.005],
                [shelterCoords[0], shelterCoords[1]],
              ];

          L.polyline(safeTrail, {
            color: '#10b981',
            weight: 4,
            opacity: 0.95,
            dashArray: '8, 6',
          })
            .bindTooltip('🟢 RECOMMENDED ESCAPE TRAIL (+320m elevation gain to Lata Shelter)', { sticky: true })
            .addTo(lg);

          // Blocked Trail Warning along Riverbed
          const blockedTrail: [number, number][] = [
            [lat, lon],
            [lat - 0.002, lon - 0.004],
            [lat - 0.004, lon - 0.008],
          ];
          L.polyline(blockedTrail, {
            color: '#dc2626',
            weight: 3,
            opacity: 0.8,
            dashArray: '4, 4',
          })
            .bindTooltip('⛔ LOW RIVERBED TRAIL: BLOCKED BY SURGE', { sticky: true })
            .addTo(lg);
        }

        // Primary Village Marker (Raini Village)
        const villageIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background: rgba(220, 38, 38, 0.95); color: white; padding: 4px 8px; border-radius: 12px; font-weight: 800; font-size: 11px; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 4px; white-space: nowrap; font-family: sans-serif;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: white; display: inline-block;"></span>
              <span>🏠 ${activeLoc.name.split('/')[0].trim()} (${activeLoc.elevation})</span>
              <span style="background: rgba(0,0,0,0.3); padding: 1px 4px; border-radius: 6px; font-size: 9px;">82% RISK</span>
            </div>
          `,
          iconAnchor: [60, 15],
        });
        L.marker([lat, lon], { icon: villageIcon })
          .bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <b style="color: #dc2626; font-size: 13px;">${activeLoc.name}</b><br/>
              <span style="font-size: 11px; color: #475569;">Elevation: ${activeLoc.elevation} · Pop: ${activeLoc.population.toLocaleString()}</span><br/>
              <div style="margin-top: 6px; padding: 6px; background: #fee2e2; border-radius: 8px; font-size: 11px; color: #991b1b; font-weight: bold;">
                ⚠️ Critical Flood Exposure: Direct low-lying river surge zone.<br/>
                SOP: Evacuate immediately uphill to Lata Shelter (+320m).
              </div>
            </div>
          `)
          .addTo(lg);

        // Safe Assembly Shelter Marker (Lata Village Assembly Shelter)
        const shelterIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background: rgba(16, 185, 129, 0.95); color: white; padding: 4px 8px; border-radius: 12px; font-weight: 800; font-size: 11px; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 4px; white-space: nowrap; font-family: sans-serif;">
              <span>🏕️</span>
              <span>Lata Assembly Shelter (+320m)</span>
              <span style="background: rgba(0,0,0,0.25); padding: 1px 4px; border-radius: 6px; font-size: 9px; color: #d1fae5;">SAFE REFUGE</span>
            </div>
          `,
          iconAnchor: [70, 15],
        });
        L.marker(shelterCoords, { icon: shelterIcon })
          .bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <b style="color: #059669; font-size: 13px;">Lata Village Assembly Shelter</b><br/>
              <span style="font-size: 11px; color: #475569;">Elevation: 2,360m ASL (+320m above riverbed)</span><br/>
              <div style="margin-top: 6px; padding: 6px; background: #ecfdf5; border-radius: 8px; font-size: 11px; color: #065f46; font-weight: bold;">
                ✅ Designated Safe Refuge: Outside 100-year inundation reach.<br/>
                Capacity: 450 persons · Potable Water & Medical First-Aid verified.
              </div>
            </div>
          `)
          .addTo(lg);

        // Secondary Refuge
        if (isRaini) {
          const secShelterIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div style="background: rgba(2, 132, 199, 0.9); color: white; padding: 3px 6px; border-radius: 10px; font-weight: 700; font-size: 10px; border: 1.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 3px; white-space: nowrap; font-family: sans-serif;">
                <span>🏛️</span>
                <span>Upper Raini Spur (+140m)</span>
              </div>
            `,
            iconAnchor: [50, 12],
          });
          L.marker(secShelterCoords, { icon: secShelterIcon }).addTo(lg);
        }

        // Bridge Risk Marker
        const bridgeCoords: [number, number] = isRaini ? [30.4855, 79.6890] : [lat - 0.005, lon - 0.006];
        const bridgeIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background: #475569; color: white; padding: 3px 6px; border-radius: 8px; font-weight: bold; font-size: 9px; border: 1.5px solid #f87171; display: flex; align-items: center; gap: 3px; white-space: nowrap; font-family: sans-serif;">
              <span>🌉</span>
              <span>Culvert KM 0.6: OVERTOPPED</span>
            </div>
          `,
          iconAnchor: [45, 10],
        });
        L.marker(bridgeCoords, { icon: bridgeIcon })
          .bindTooltip('⚠️ Bridge KM 0.6: Overtopped by floodwaters — Road impassable', { sticky: true })
          .addTo(lg);
      }

      // ── B. RAINFALL DOPPLER RADAR LAYER ──
      if (activeLayer === 'RAINFALL') {
        // High-altitude ridge cloudburst radar footprint
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

        // Rain Gauge Pins
        const rainGaugeIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background: #1e3a8a; color: white; padding: 4px 8px; border-radius: 10px; font-weight: 800; font-size: 11px; border: 2px solid #60a5fa; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 4px; white-space: nowrap; font-family: sans-serif;">
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
        // Vibrant river channel
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

        // CWC Radar Gauge
        const riverGaugeIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background: #0f172a; color: #38bdf8; padding: 4px 8px; border-radius: 10px; font-weight: 800; font-size: 11px; border: 2px solid #38bdf8; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 4px; white-space: nowrap; font-family: sans-serif;">
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
        // Colluvial slope hazard polygon
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

        // TDR Soil Moisture Probe
        const soilProbeIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background: #78350f; color: #fef3c7; padding: 4px 8px; border-radius: 10px; font-weight: 800; font-size: 11px; border: 2px solid #f59e0b; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 4px; white-space: nowrap; font-family: sans-serif;">
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
    };

    renderLayers();
  }, [activeLayer, baseMap, activeLoc, customLayers, isRaini]);

  const handleResetView = () => {
    if (mapInstanceRef.current && activeLoc) {
      mapInstanceRef.current.setView([activeLoc.lat, activeLoc.lon], 14, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[400px] flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      {/* ── TOP CONTROL BAR: LAYER SWITCHER & TILE SELECTOR ── */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[400] flex items-center justify-between gap-1.5 pointer-events-none">
        
        {/* Left: Scientific Layer Tabs */}
        <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-md overflow-x-auto no-scrollbar">
          <button
            onClick={() => onLayerChange('RISK')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-sans transition flex items-center gap-1 ${
              activeLayer === 'RISK'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>🌊 Risk Map</span>
          </button>

          <button
            onClick={() => onLayerChange('RAINFALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-sans transition flex items-center gap-1 ${
              activeLayer === 'RAINFALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-blue-500" />
            <span>Rainfall</span>
          </button>

          <button
            onClick={() => onLayerChange('RIVER')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-sans transition flex items-center gap-1 ${
              activeLayer === 'RIVER'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-teal-500" />
            <span>River Levels</span>
          </button>

          <button
            onClick={() => onLayerChange('SOIL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-sans transition flex items-center gap-1 ${
              activeLayer === 'SOIL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-amber-500" />
            <span>Soil Moisture</span>
          </button>

          <button
            onClick={() => onLayerChange('LAYERS')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-sans transition flex items-center gap-1 ${
              activeLayer === 'LAYERS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Layers</span>
          </button>
        </div>

        {/* Right: Map Style & Reset Controls */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-1.5">
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-md flex items-center gap-1">
            <button
              onClick={() => setBaseMap('SATELLITE')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition ${
                baseMap === 'SATELLITE' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Google Earth Satellite Imagery"
            >
              🌍 SATELLITE
            </button>
            <button
              onClick={() => setBaseMap('TOPO')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition ${
                baseMap === 'TOPO' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="OpenTopoMap Elevation Relief"
            >
              🏔️ TOPO
            </button>
            <button
              onClick={() => setBaseMap('STREET')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition ${
                baseMap === 'STREET' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Carto Clean Streets"
            >
              🗺️ STREET
            </button>
          </div>

          <button
            onClick={handleResetView}
            className="p-1.5 bg-white/95 hover:bg-slate-100 rounded-xl text-slate-700 border border-slate-200 shadow-md transition active:scale-95"
            title="Reset Map to Village Center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── MAP CONTAINER ── */}
      <div ref={mapContainerRef} className="w-full h-full flex-1" style={{ minHeight: '340px' }} />

      {/* ── FLOATING MAP LEGEND (BOTTOM LEFT) ── */}
      <div className="absolute bottom-2.5 left-2.5 z-[400] pointer-events-none hidden sm:flex">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-[10px] font-mono font-semibold text-slate-800 flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-red-600 border border-red-700 inline-block" />
            <span className="text-red-700 font-bold">Zone 1 (&gt;1.5m)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-orange-500 border border-orange-600 inline-block" />
            <span className="text-orange-700 font-bold">Zone 2 (Surge)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-yellow-400 border border-yellow-500 inline-block" />
            <span className="text-yellow-800 font-bold">Zone 3 (Caution)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-600 inline-block" />
            <span className="text-emerald-800 font-bold">Refuge (+320m)</span>
          </span>
        </div>
      </div>

      {/* ── FLOATING COORDINATES & STATUS BADGE (BOTTOM RIGHT) ── */}
      <div className="absolute bottom-2.5 right-2.5 z-[400] pointer-events-none hidden md:flex">
        <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/80 text-[10px] font-mono text-slate-200 flex items-center gap-2 shadow-md">
          <MapPin className="w-3 h-3 text-cyan-400" />
          <span>{activeLoc.lat.toFixed(4)}°N, {activeLoc.lon.toFixed(4)}°E ({activeLoc.elevation})</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* ── LAYERS TAB MODAL / DRAWER (WHEN LAYERS TAB IS ACTIVE) ── */}
      {activeLayer === 'LAYERS' && (
        <div className="absolute top-14 left-2.5 z-[450] bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-lg text-xs font-sans w-64 space-y-2 animate-fade-in">
          <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 flex items-center justify-between">
            <span>GIS LAYER VISIBILITY</span>
            <span className="text-[10px] font-mono text-blue-600">LIVE</span>
          </div>

          <label className="flex items-center justify-between text-slate-700 cursor-pointer">
            <span>Flood Inundation Corridor</span>
            <input
              type="checkbox"
              checked={customLayers.floodZone}
              onChange={(e) => setCustomLayers((p) => ({ ...p, floodZone: e.target.checked }))}
              className="rounded text-blue-600"
            />
          </label>

          <label className="flex items-center justify-between text-slate-700 cursor-pointer">
            <span>Uphill Evacuation Trail</span>
            <input
              type="checkbox"
              checked={customLayers.evacRoute}
              onChange={(e) => setCustomLayers((p) => ({ ...p, evacRoute: e.target.checked }))}
              className="rounded text-emerald-600"
            />
          </label>

          <label className="flex items-center justify-between text-slate-700 cursor-pointer">
            <span>IoT Sensors & Gauges</span>
            <input
              type="checkbox"
              checked={customLayers.sensors}
              onChange={(e) => setCustomLayers((p) => ({ ...p, sensors: e.target.checked }))}
              className="rounded text-blue-600"
            />
          </label>

          <label className="flex items-center justify-between text-slate-700 cursor-pointer">
            <span>River Watercourse Channel</span>
            <input
              type="checkbox"
              checked={customLayers.riverChannel}
              onChange={(e) => setCustomLayers((p) => ({ ...p, riverChannel: e.target.checked }))}
              className="rounded text-cyan-600"
            />
          </label>

          <label className="flex items-center justify-between text-slate-700 cursor-pointer">
            <span>Steep Slope Stability (&gt;38°)</span>
            <input
              type="checkbox"
              checked={customLayers.slopeHazard}
              onChange={(e) => setCustomLayers((p) => ({ ...p, slopeHazard: e.target.checked }))}
              className="rounded text-amber-600"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default DashboardRealMap;
