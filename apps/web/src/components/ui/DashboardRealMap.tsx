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
  CheckCircle2
} from 'lucide-react';
import { VERIFIED_OSM_HYDROGRAPHY, makeRiverBufferPolygon } from '@/services/gisService';

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
    blockedRoute: true,
    riverChannel: true,
    sensors: true,
  });

  // Reusable Layer Rendering Function
  const renderAllLayers = useCallback((map: any, lg: any, L: any) => {
    if (!map || !lg || !L) return;

    // Invalidate size immediately so tiles fill the whole container
    map.invalidateSize();

    // 1. Update Base Tile Layer with Fast, Globally Reliable CDN
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    let maxZoom = 19;
    let attribution = '© Esri · FloodGuard AI';

    if (baseMap === 'TOPO') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      maxZoom = 17;
      attribution = '© OpenTopoMap · FloodGuard AI';
    } else if (baseMap === 'STREET') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      maxZoom = 19;
      attribution = '© OpenStreetMap contributors · FloodGuard AI';
    }

    const tileLayer = L.tileLayer(tileUrl, {
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
      ? [30.5020, 79.7040]
      : [lat + 0.012, lon + 0.01];

    // Secondary intermediate safe point
    const spurCoords: [number, number] = isRaini
      ? [30.4935, 79.7000]
      : [lat + 0.006, lon + 0.006];

    // ── A. RISK MAP LAYER: CLEAR DANGERS & SAFE PLACE COLOUR REPRESENTATION ──
    if (activeLayer === 'RISK' || activeLayer === 'LAYERS') {
      
      // 1. BROAD, PROMINENT DANGER ZONES (Red, Orange, Yellow Envelopes)
      if (customLayers.dangerZones) {
        // Generous, realistic hazard buffer envelopes covering the valley floor & gorge
        const zone3Yellow = makeRiverBufferPolygon(riverVector, 750); // ~1.5km caution reach
        const zone2Orange = makeRiverBufferPolygon(riverVector, 480); // ~960m surge reach
        const zone1Red = makeRiverBufferPolygon(riverVector, 250);    // ~500m core inundation

        // 🟡 Zone 3: Yellow Caution Perimeter (<0.5m inundation depth)
        L.polygon(zone3Yellow, {
          color: '#eab308',
          weight: 1.5,
          fillColor: '#facc15',
          fillOpacity: 0.22,
          dashArray: '6, 5',
        })
          .bindTooltip('🟡 Zone 3 (Caution Buffer): Shallow overland infiltration (<0.5m depth)', { sticky: true })
          .addTo(lg);

        // 🟠 Zone 2: Orange Medium Surge Zone (0.5m – 1.5m surge wave)
        L.polygon(zone2Orange, {
          color: '#f97316',
          weight: 2,
          fillColor: '#ea580c',
          fillOpacity: 0.32,
        })
          .bindTooltip('🟠 Zone 2 (Medium Risk): Surge wave reach (0.5m – 1.5m depth) — High Velocity', { sticky: true })
          .addTo(lg);

        // 🔴 Zone 1: Red High Danger Core Inundation Zone (>1.5m flood depth)
        L.polygon(zone1Red, {
          color: '#ef4444',
          weight: 3,
          fillColor: '#dc2626',
          fillOpacity: 0.50,
        })
          .bindTooltip('🔴 Zone 1 (High Danger): Core Inundation (>1.5m depth) — MANDATORY EVACUATION', { sticky: true })
          .addTo(lg);
      }

      // 2. 🟢 GREEN SAFE REFUGE ZONE (HIGH GROUND SHELTER AREA)
      if (customLayers.safeRefuge) {
        // High-ground plateau buffer around Lata Assembly Shelter (+320m elevation above gorge)
        L.circle(shelterCoords, {
          radius: 380, // 380m radius safe zone on the ridge
          color: '#059669',
          weight: 2.5,
          fillColor: '#10b981',
          fillOpacity: 0.38,
          dashArray: '5, 4',
        })
          .bindTooltip('🟢 SAFE REFUGE AREA (+320m Elevation Gain) · Outside 100-Year Surge Reach', { sticky: true })
          .addTo(lg);

        // Prominent Safe Assembly Shelter Marker
        const shelterIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background: #059669; color: white; padding: 5px 10px; border-radius: 12px; font-weight: 800; font-size: 11px; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(5,150,105,0.6); display: flex; align-items: center; gap: 5px; white-space: nowrap; font-family: sans-serif;">
              <span style="font-size: 13px;">🏕️</span>
              <span>LATA SAFE SHELTER (+320m ASL)</span>
              <span style="background: rgba(0,0,0,0.25); padding: 1px 5px; border-radius: 6px; font-size: 9px; color: #a7f3d0; font-weight: 900;">SAFE PLACE</span>
            </div>
          `,
          iconAnchor: [90, 18],
        });

        L.marker(shelterCoords, { icon: shelterIcon })
          .bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <b style="color: #059669; font-size: 13px;">🟢 Lata High School Safe Assembly Shelter</b><br/>
              <span style="font-size: 11px; color: #475569;">Elevation: 2,360m ASL (+320m above riverbed)</span><br/>
              <div style="margin-top: 6px; padding: 6px; background: #ecfdf5; border-radius: 8px; font-size: 11px; color: #065f46; font-weight: bold; border: 1px solid #a7f3d0;">
                ✅ DESIGNATED SAFE HAVEN: Completely outside flood reach.<br/>
                Capacity: 450 persons · Potable Water & Medical First-Aid verified.
              </div>
            </div>
          `)
          .addTo(lg);
      }

      // 3. 🟢 GLOWING GREEN & CYAN SAFE ESCAPE ROUTE TO SAFE PLACE
      if (customLayers.safeRoute) {
        const safeTrail: [number, number][] = isRaini
          ? [
              [30.4850, 79.6920], // Raini Village (DANGER START)
              [30.4885, 79.6955], // Ridge junction (ascending)
              [30.4935, 79.7000], // Mid-spur safe contour (+180m)
              [30.4985, 79.7025], // Upper saddle (+260m)
              [30.5020, 79.7040], // Lata Assembly Shelter (SAFE PLACE)
            ]
          : [
              [lat, lon],
              [lat + 0.005, lon + 0.005],
              [shelterCoords[0], shelterCoords[1]],
            ];

        // Glowing backdrop ribbon
        L.polyline(safeTrail, {
          color: '#34d399',
          weight: 9,
          opacity: 0.45,
        }).addTo(lg);

        // Core dashed safe route line
        L.polyline(safeTrail, {
          color: '#10b981',
          weight: 5,
          opacity: 1,
          dashArray: '10, 6',
        })
          .bindTooltip('🟢 RECOMMENDED UPHILL ESCAPE ROUTE (1.4 km · +320m Climb to Safe Shelter)', { sticky: true })
          .addTo(lg);

        // Mid-route waypoint badge
        const waypointIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background: rgba(16,185,129,0.9); color: white; padding: 2px 6px; border-radius: 8px; font-weight: 700; font-size: 9px; border: 1.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 3px; white-space: nowrap;">
              <span>🚶‍♂️</span>
              <span>Uphill Trail (+180m)</span>
            </div>
          `,
          iconAnchor: [45, 10],
        });
        L.marker(spurCoords, { icon: waypointIcon }).addTo(lg);
      }

      // 4. 🔴 BLOCKED LOW-LYING RIVERBED ROUTE
      if (customLayers.blockedRoute) {
        const bridgeCoords: [number, number] = isRaini ? [30.4855, 79.6890] : [lat - 0.005, lon - 0.006];
        const blockedTrail: [number, number][] = [
          [lat, lon],
          [bridgeCoords[0], bridgeCoords[1]],
          [lat - 0.008, lon - 0.010],
        ];

        L.polyline(blockedTrail, {
          color: '#ef4444',
          weight: 4,
          opacity: 0.9,
          dashArray: '5, 5',
        })
          .bindTooltip('⛔ LOW RIVERBED PATH: BLOCKED BY SURGE (DO NOT USE)', { sticky: true })
          .addTo(lg);

        const blockedIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background: #991b1b; color: white; padding: 3px 7px; border-radius: 8px; font-weight: bold; font-size: 9px; border: 1.5px solid #fca5a5; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 3px; white-space: nowrap; font-family: sans-serif;">
              <span>⛔</span>
              <span>Bridge KM 0.6: OVERTOPPED & BLOCKED</span>
            </div>
          `,
          iconAnchor: [70, 10],
        });
        L.marker(bridgeCoords, { icon: blockedIcon }).addTo(lg);
      }

      // 5. Active River Flow Vector
      if (customLayers.riverChannel) {
        L.polyline(riverVector, {
          color: '#0284c7',
          weight: 6,
          opacity: 0.85,
        }).addTo(lg);

        L.polyline(riverVector, {
          color: '#38bdf8',
          weight: 2,
          opacity: 1,
          dashArray: '6, 6',
        }).addTo(lg);
      }

      // 6. 🔴 PRIMARY VILLAGE MARKER IN DANGER ZONE (Raini Village)
      const villageIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background: #dc2626; color: white; padding: 5px 10px; border-radius: 12px; font-weight: 800; font-size: 11px; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(220,38,38,0.6); display: flex; align-items: center; gap: 5px; white-space: nowrap; font-family: sans-serif;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff; display: inline-block;"></span>
            <span>🏠 ${activeLoc.name.split('/')[0].trim()} (${activeLoc.elevation})</span>
            <span style="background: rgba(0,0,0,0.3); padding: 1px 5px; border-radius: 6px; font-size: 9px; font-weight: 900;">82% DANGER</span>
          </div>
        `,
        iconAnchor: [70, 18],
      });

      L.marker([lat, lon], { icon: villageIcon })
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <b style="color: #dc2626; font-size: 13px;">🔴 ${activeLoc.name} (CRITICAL DANGER ZONE)</b><br/>
            <span style="font-size: 11px; color: #475569;">Elevation: ${activeLoc.elevation} · Population: ${activeLoc.population.toLocaleString()}</span><br/>
            <div style="margin-top: 6px; padding: 6px; background: #fee2e2; border-radius: 8px; font-size: 11px; color: #991b1b; font-weight: bold; border: 1px solid #fca5a5;">
              ⚠️ Direct river surge corridor: Inundation probability 82%.<br/>
              DIRECTIVE: Follow GREEN route immediately to Lata Shelter (+320m).
            </div>
          </div>
        `)
        .addTo(lg);
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
          center: [activeLoc.lat, activeLoc.lon],
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: true,
        });

        L.control
          .attribution({ position: 'bottomright', prefix: false })
          .addAttribution('© Esri · FloodGuard AI')
          .addTo(map);

        const lg = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
        layerGroupRef.current = lg;

        // Render layers IMMEDIATELY on creation
        renderAllLayers(map, lg, L);

        setMapReady(true);

        setTimeout(() => map.invalidateSize(), 60);
        setTimeout(() => map.invalidateSize(), 200);
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
      mapInstanceRef.current.setView([activeLoc.lat, activeLoc.lon], 14, { animate: true });
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
      {/* ── DEDICATED IN-FLOW MAP CONTROLS BAR (NEVER OVERLAPS TILES) ── */}
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
            <span>🌊 Risk Map</span>
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
            <span>River Stage</span>
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

        {/* Right: Map Style & Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="bg-slate-50 p-0.5 rounded-lg border border-slate-200 flex items-center gap-0.5 text-[10px] font-mono font-bold">
            <button
              onClick={() => setBaseMap('SATELLITE')}
              className={`px-2 py-0.5 rounded-md transition ${
                baseMap === 'SATELLITE' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Esri World Satellite Imagery"
            >
              🌍 EARTH
            </button>
            <button
              onClick={() => setBaseMap('TOPO')}
              className={`px-2 py-0.5 rounded-md transition ${
                baseMap === 'TOPO' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="OpenTopoMap Elevation Relief"
            >
              🏔️ TOPO
            </button>
            <button
              onClick={() => setBaseMap('STREET')}
              className={`px-2 py-0.5 rounded-md transition ${
                baseMap === 'STREET' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="OpenStreetMap Street View"
            >
              🗺️ MAP
            </button>
          </div>

          <button
            onClick={handleResetView}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-700 border border-slate-200 shadow-2xs transition active:scale-95"
            title="Reset Map to Village Center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── COMPACT LAYER CUSTOMIZATION POPOVER (NON-INTRUSIVE) ── */}
        {showLayerDrawer && (
          <div className="absolute top-11 left-2 z-50 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-xl text-xs font-sans w-64 space-y-2 animate-fade-in pointer-events-auto">
            <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>GIS LAYER VISIBILITY</span>
              </span>
              <button
                onClick={() => setShowLayerDrawer(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800"
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
                <span>Green Safe Refuge (+320m)</span>
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
                <span className="w-2.5 h-1 rounded bg-emerald-500 inline-block" />
                <span>Safe Uphill Route</span>
              </span>
              <input
                type="checkbox"
                checked={customLayers.safeRoute}
                onChange={(e) => setCustomLayers((p) => ({ ...p, safeRoute: e.target.checked }))}
                className="rounded text-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between text-slate-700 cursor-pointer hover:text-slate-900">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 rounded bg-red-500 inline-block" />
                <span>Blocked Riverbed Trail</span>
              </span>
              <input
                type="checkbox"
                checked={customLayers.blockedRoute}
                onChange={(e) => setCustomLayers((p) => ({ ...p, blockedRoute: e.target.checked }))}
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

      {/* ── MAP CANVAS (FULL BLEED, CRISP VISUAL OVERLAYS) ── */}
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

        {/* Floating Map Legend (Bottom Left of Map) — Crystal Clear Dangers & Safe Place */}
        <div className="absolute bottom-2.5 left-2.5 z-[400] pointer-events-none hidden sm:flex">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-[10px] font-mono font-semibold text-slate-800 flex items-center gap-2.5">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-red-600 inline-block" />
              <span className="text-red-700 font-bold">Zone 1 (Danger &gt;1.5m)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block" />
              <span className="text-orange-700 font-bold">Zone 2 (Surge)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-yellow-400 inline-block" />
              <span className="text-yellow-800 font-bold">Zone 3 (Caution)</span>
            </span>
            <span className="flex items-center gap-1 border-l border-slate-300 pl-2">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
              <span className="text-emerald-800 font-bold">Safe Place (+320m)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-1 rounded bg-emerald-500 inline-block border-b border-emerald-600" />
              <span className="text-emerald-700 font-bold">Safe Route</span>
            </span>
          </div>
        </div>

        {/* Floating Coordinates (Bottom Right of Map) */}
        <div className="absolute bottom-2.5 right-2.5 z-[400] pointer-events-none hidden md:flex">
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
