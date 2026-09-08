'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface FloodZonePolygons {
  zone1Red: [number, number][];
  zone2Orange: [number, number][];
  zone3Yellow: [number, number][];
}

export interface SafePlaceItem {
  id: string;
  name: string;
  lat: number;
  lon: number;
  elevation: string;
  distance: string;
  type: string;
  isPrimary?: boolean;
}

interface EvacMapProps {
  userLat: number;
  userLon: number;
  shelterLat: number;
  shelterLon: number;
  routePoints: [number, number][];
  blockedPoints?: [number, number][];
  riskZoneCenter?: [number, number];
  riskRadiusM?: number;
  emergencyMode?: boolean;
  locationMode?: 'DEMO' | 'BROWSER' | 'MANUAL';
  locationName?: string;
  stateName?: string;
  shelterName?: string;
  riverName?: string;
  riskLevel?: string;
  isSafeZone?: boolean;
  floodPolygons?: FloodZonePolygons;
  riverVector?: [number, number][];
  safePlaces?: SafePlaceItem[];
  historicalEventLabel?: string;
}

export const EvacuationLeafletMap: React.FC<EvacMapProps> = ({
  userLat,
  userLon,
  shelterLat,
  shelterLon,
  routePoints,
  blockedPoints = [],
  riskZoneCenter,
  riskRadiusM = 600,
  emergencyMode = false,
  locationMode = 'DEMO',
  locationName = 'Active Location',
  stateName = 'India',
  shelterName = 'Safe High-Ground Refuge',
  riverName = 'River Mainstem',
  riskLevel = 'HIGH',
  isSafeZone = false,
  floodPolygons,
  riverVector,
  safePlaces = [],
  historicalEventLabel,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const [baseMapType, setBaseMapType] = useState<'SATELLITE' | 'STREET'>('SATELLITE');
  const [mapReady, setMapReady] = useState(false);

  // Clean location title for top-left badge
  const displayTitle = locationName
    ? locationName.includes('/')
      ? locationName.split('/')[0].trim()
      : locationName.split('(')[0].trim()
    : 'Example';

  // ── Initialize Map & Tile Layer ──
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    let isCancelled = false;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Inject Leaflet CSS if not present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        await new Promise<void>((r) => setTimeout(r, 120));
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && mapRef.current) {
        const map = L.map(mapRef.current, {
          center: [userLat, userLon],
          zoom: 14,
          zoomControl: false,
          scrollWheelZoom: true,
        });

        // Add standard zoom control to bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;
        layerGroupRef.current = L.layerGroup().addTo(map);
      }

      if (isCancelled || !mapInstanceRef.current) return;
      const map = mapInstanceRef.current;

      // Remove previous tile layer if any
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }

      // Add Satellite or Street tile layer
      let tileUrl = 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'; // Google Satellite Hybrid default
      let subdomains = ['0', '1', '2', '3'];
      let maxZoom = 20;

      if (baseMapType === 'STREET') {
        tileUrl = 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      }

      const newTileLayer = L.tileLayer(tileUrl, {
        subdomains,
        maxZoom,
        attribution: 'Imagery © Google Earth / Google Maps · FloodGuard AI SIH26192',
      }).addTo(map);
      tileLayerRef.current = newTileLayer;

      // Render vector overlays
      renderMapOverlays(L, map);
    };

    initMap();

    return () => {
      isCancelled = true;
    };
  }, [baseMapType]);

  // ── Render Map Overlays ──
  const renderMapOverlays = async (L: any, map: any) => {
    if (!layerGroupRef.current) return;
    const lg = layerGroupRef.current;
    lg.clearLayers();

    const center = riskZoneCenter ?? ([userLat, userLon] as [number, number]);

    // ── 1. 3-ZONE FLOOD RISK POLYGONS (RED, ORANGE, YELLOW) ──
    if (!isSafeZone) {
      if (floodPolygons) {
        // Yellow Zone 3 — Low Risk Zone
        if (floodPolygons.zone3Yellow && floodPolygons.zone3Yellow.length > 2) {
          L.polygon(floodPolygons.zone3Yellow, {
            color: '#ca8a04',
            weight: 1.5,
            fillColor: '#facc15',
            fillOpacity: 0.38,
          })
            .addTo(lg)
            .bindPopup(`
              <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;color:#0f172a;min-width:210px;">
                <b style="color:#ca8a04;font-size:13px;">🟡 Low Risk Zone</b><br/>
                <b>Water Depth:</b> &lt;0.5m (Runoff &amp; outer perimeter)<br/>
                <b>Status:</b> Advisory Watch · Evacuation Readiness
              </div>
            `);
        }

        // Orange Zone 2 — Medium Risk Zone
        if (floodPolygons.zone2Orange && floodPolygons.zone2Orange.length > 2) {
          L.polygon(floodPolygons.zone2Orange, {
            color: '#ea580c',
            weight: 2,
            fillColor: '#f97316',
            fillOpacity: 0.46,
          })
            .addTo(lg)
            .bindPopup(`
              <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;color:#0f172a;min-width:210px;">
                <b style="color:#ea580c;font-size:13px;">🟠 Medium Risk Zone</b><br/>
                <b>Water Depth:</b> 0.6m – 2.0m (High-velocity surge runoff)<br/>
                <b>Warning:</b> Move to designated safe shelter immediately
              </div>
            `);
        }

        // Red Zone 1 — High Risk Zone
        if (floodPolygons.zone1Red && floodPolygons.zone1Red.length > 2) {
          L.polygon(floodPolygons.zone1Red, {
            color: '#dc2626',
            weight: 2.5,
            fillColor: '#ef4444',
            fillOpacity: 0.58,
          })
            .addTo(lg)
            .bindPopup(`
              <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;color:#0f172a;min-width:210px;">
                <b style="color:#dc2626;font-size:13px;">🔴 High Risk Zone (Active Inundation)</b><br/>
                <b>Water Depth:</b> 2.0m – 5.2m (Extreme surge danger)<br/>
                <span style="color:#dc2626;font-weight:bold;">Submerged river corridor — Evacuate uphill now!</span>
              </div>
            `);
        }
      } else {
        // Dynamic concentric 3-zone fallback around coordinates
        // Zone 3: Yellow
        L.circle(center, {
          radius: riskRadiusM * 1.5,
          color: '#ca8a04',
          weight: 1.5,
          fillColor: '#facc15',
          fillOpacity: 0.32,
        })
          .addTo(lg)
          .bindPopup(`<b style="color:#ca8a04">🟡 Low Risk Zone</b><br/>Advisory perimeter (&lt;0.5m)`);

        // Zone 2: Orange
        L.circle(center, {
          radius: riskRadiusM * 0.95,
          color: '#ea580c',
          weight: 2,
          fillColor: '#f97316',
          fillOpacity: 0.44,
        })
          .addTo(lg)
          .bindPopup(`<b style="color:#ea580c">🟠 Medium Risk Zone</b><br/>Surge reach buffer (0.6m - 2.0m)`);

        // Zone 1: Red
        L.circle(center, {
          radius: riskRadiusM * 0.55,
          color: '#dc2626',
          weight: 2.5,
          fillColor: '#ef4444',
          fillOpacity: 0.58,
        })
          .addTo(lg)
          .bindPopup(`<b style="color:#dc2626">🔴 High Risk Zone</b><br/>Active inundation channel (&gt;2.0m)`);
      }
    } else {
      // Safe Baseline (Green buffer circle)
      L.circle(center, {
        radius: 350,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.15,
        weight: 2,
      })
        .addTo(lg)
        .bindPopup(`<b style="color:#10b981">🟢 Elevated Safe Ground</b><br>Normal condition.`);
    }

    // ── 2. REAL RIVER FLOW VECTOR WITH WHITE FLOW DIRECTION ARROWS ──
    if (riverVector && riverVector.length > 1) {
      // Base broad blue river ribbon
      L.polyline(riverVector, {
        color: '#0284c7',
        weight: 16,
        opacity: 0.88,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(lg);

      // Central vibrant blue ribbon
      L.polyline(riverVector, {
        color: '#38bdf8',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      })
        .addTo(lg)
        .bindPopup(`
          <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;color:#0f172a;">
            <b style="color:#0284c7">💧 ${riverName}</b><br/>
            Flow: Active Downstream Valley Gradient<br/>
            Direction: White arrows ➔ indicate flow path
          </div>
        `);

      // White directional flow arrows (➔) spaced along river segments
      for (let i = 0; i < riverVector.length - 1; i++) {
        const p1 = riverVector[i];
        const p2 = riverVector[i + 1];
        const midLat = (p1[0] + p2[0]) / 2;
        const midLon = (p1[1] + p2[1]) / 2;

        // Calculate heading angle in degrees (clockwise from North)
        const dLat = p2[0] - p1[0];
        const dLon = (p2[1] - p1[1]) * Math.cos((p1[0] * Math.PI) / 180);
        let headingDeg = (Math.atan2(dLon, dLat) * 180) / Math.PI;
        headingDeg = (headingDeg + 360) % 360;

        // Custom SVG white arrow rotated to segment bearing
        const arrowIcon = L.divIcon({
          html: `
            <div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;transform:rotate(${headingDeg}deg);pointer-events:none;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.85));">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          `,
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker([midLat, midLon], { icon: arrowIcon, interactive: false, zIndexOffset: 300 }).addTo(lg);
      }
    }

    // ── 3. CANDIDATE EVACUATION ROUTE (GREEN-AND-WHITE DASHED TRAIL) ──
    if (routePoints && routePoints.length > 1) {
      // Base solid green line
      L.polyline(routePoints, {
        color: '#16a34a',
        weight: 7,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(lg);

      // Overlay white dashed dashes
      L.polyline(routePoints, {
        color: '#ffffff',
        weight: 3.5,
        dashArray: '8 8',
        opacity: 1.0,
        lineCap: 'round',
        lineJoin: 'round',
      })
        .addTo(lg)
        .bindPopup(`
          <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;color:#0f172a;">
            <b style="color:#16a34a">🚶 Evacuation Route</b><br/>
            Connecting Affected Village to Safe Shelter on high ground.<br/>
            <b>Path:</b> Uphill escape vector safely outside risk zones.
          </div>
        `);
    }

    // ── 4. BLOCKED ROADWAY (RED DASHED) ──
    if (!isSafeZone && blockedPoints && blockedPoints.length > 1) {
      L.polyline(blockedPoints, {
        color: '#ef4444',
        weight: 5,
        opacity: 0.9,
        dashArray: '6 6',
      })
        .addTo(lg)
        .bindPopup(`
          <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;color:#0f172a;">
            <b style="color:#dc2626">🚫 Submerged Causeway / Blocked Road</b><br/>
            Inundated under active surge water.<br/>
            <span style="color:#dc2626;font-weight:bold;">Do not attempt to cross!</span>
          </div>
        `);
    }

    // ── 5. AFFECTED VILLAGE (HIGH RISK) CALLOUT BADGE ──
    const affectedPillHtml = `
      <div style="position: relative; display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%); border: 2px solid rgba(255,255,255,0.85); border-radius: 9999px; padding: 5px 14px 5px 6px; box-shadow: 0 10px 25px -3px rgba(0,0,0,0.7), 0 0 16px rgba(220,38,38,0.6); cursor: pointer; white-space: nowrap; transform: translate(-28px, -46px);">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.4); flex-shrink: 0;">
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #dc2626; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-family: system-ui, sans-serif; font-size: 16px; line-height: 1;">
            !
          </div>
        </div>
        <div style="display: flex; flex-direction: column; text-align: left; line-height: 1.15;">
          <span style="color: #ffffff; font-weight: 800; font-size: 13px; font-family: system-ui, -apple-system, sans-serif; letter-spacing: 0.1px;">Affected Village</span>
          <span style="color: #fca5a5; font-weight: 600; font-size: 10.5px; font-family: system-ui, -apple-system, sans-serif;">(High Risk)</span>
        </div>
        <!-- Pointer arrow pointing down to the pinpoint -->
        <div style="position: absolute; bottom: -8px; left: 28px; width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 8px solid #7f1d1d;"></div>
      </div>
      <!-- Target dot on terrain -->
      <div style="position: absolute; left: 0px; top: 0px; width: 12px; height: 12px; background: #ef4444; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px #ef4444; transform: translate(-6px, -6px); pointer-events: none;"></div>
    `;

    const affectedIcon = L.divIcon({
      html: affectedPillHtml,
      className: '',
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    L.marker([userLat, userLon], { icon: affectedIcon, zIndexOffset: 1000 })
      .addTo(lg)
      .bindPopup(`
        <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.6;color:#0f172a;min-width:230px;">
          <b style="color:#b91c1c;font-size:13px;">🔴 AFFECTED VILLAGE · ${locationName}</b><br/>
          <b>Coordinates:</b> ${userLat.toFixed(5)}°N, ${userLon.toFixed(5)}°E (${stateName})<br/>
          <b>Zone:</b> High Risk (Active Inundation Envelope)<br/>
          <span style="color:#b91c1c;font-weight:bold;">Directive: Follow green evacuation route to safe shelter.</span>
        </div>
      `);

    // ── 6. SAFE SHELTER (OUTSIDE RISK ZONE) CALLOUT BADGE ──
    const shelterPillHtml = `
      <div style="position: relative; display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #065f46 0%, #064e3b 100%); border: 2px solid rgba(255,255,255,0.85); border-radius: 9999px; padding: 5px 14px 5px 6px; box-shadow: 0 10px 25px -3px rgba(0,0,0,0.7), 0 0 16px rgba(16,185,129,0.6); cursor: pointer; white-space: nowrap; transform: translate(-28px, -46px);">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.4); flex-shrink: 0;">
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #059669; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; line-height: 1;">
            🏠
          </div>
        </div>
        <div style="display: flex; flex-direction: column; text-align: left; line-height: 1.15;">
          <span style="color: #ffffff; font-weight: 800; font-size: 13px; font-family: system-ui, -apple-system, sans-serif; letter-spacing: 0.1px;">Safe Shelter</span>
          <span style="color: #a7f3d0; font-weight: 600; font-size: 10.5px; font-family: system-ui, -apple-system, sans-serif;">(Outside risk zone)</span>
        </div>
        <!-- Pointer arrow pointing down to the shelter pinpoint -->
        <div style="position: absolute; bottom: -8px; left: 28px; width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 8px solid #064e3b;"></div>
      </div>
      <!-- Target dot on terrain -->
      <div style="position: absolute; left: 0px; top: 0px; width: 12px; height: 12px; background: #10b981; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px #10b981; transform: translate(-6px, -6px); pointer-events: none;"></div>
    `;

    const shelterIcon = L.divIcon({
      html: shelterPillHtml,
      className: '',
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    L.marker([shelterLat, shelterLon], { icon: shelterIcon, zIndexOffset: 950 })
      .addTo(lg)
      .bindPopup(`
        <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.6;color:#0f172a;min-width:240px;">
          <b style="color:#059669;font-size:13px;">🟢 DESIGNATED SAFE SHELTER</b><br/>
          <b>Facility:</b> ${shelterName}<br/>
          <b>Location:</b> Elevated High-Ground (Safely outside risk zones)<br/>
          <b>Supplies:</b> Potable Water · Emergency Food · First Aid ✓
        </div>
      `);

    // ── 7. SECONDARY SHELTERS (IF PROVIDED) ──
    if (safePlaces && safePlaces.length > 0) {
      safePlaces.forEach((sp) => {
        if (Math.abs(sp.lat - shelterLat) > 0.002 || Math.abs(sp.lon - shelterLon) > 0.002) {
          const secIcon = L.divIcon({
            html: `
              <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
                <div style="background:#0284c7;border:2px solid #ffffff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,0.5);color:white;">
                  🏛️
                </div>
                <div style="background:rgba(15,23,42,0.92);border:1px solid #38bdf8;color:#e0f2fe;font-family:system-ui,sans-serif;font-size:9px;font-weight:bold;padding:1px 5px;border-radius:4px;margin-top:2px;white-space:nowrap;">
                  ${sp.name.split(' ')[0]}
                </div>
              </div>`,
            className: '',
            iconSize: [70, 40],
            iconAnchor: [35, 20],
          });

          L.marker([sp.lat, sp.lon], { icon: secIcon, zIndexOffset: 850 })
            .addTo(lg)
            .bindPopup(`
              <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;color:#0f172a;">
                <b style="color:#0284c7;">🏛️ Secondary Refuge: ${sp.name}</b><br/>
                <b>Elevation:</b> ${sp.elevation}<br/>
                <b>Type:</b> ${sp.type} · High Ground<br/>
                <b>Distance:</b> ${sp.distance}
              </div>
            `);
        }
      });
    }

    // ── FIT MAP BOUNDS ──
    const allPoints: [number, number][] = [
      [userLat, userLon],
      [shelterLat, shelterLon],
      ...routePoints,
    ];
    if (riverVector && riverVector.length > 0) {
      allPoints.push(riverVector[0], riverVector[riverVector.length - 1]);
    }
    map.fitBounds(L.latLngBounds(allPoints), { padding: [60, 60], maxZoom: 15 });
    setMapReady(true);
  };

  // Re-render overlays when props change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      renderMapOverlays(L.default, mapInstanceRef.current);
    });
  }, [
    userLat,
    userLon,
    shelterLat,
    shelterLon,
    routePoints,
    blockedPoints,
    riskZoneCenter,
    riskRadiusM,
    emergencyMode,
    locationName,
    stateName,
    shelterName,
    riverName,
    riskLevel,
    isSafeZone,
    floodPolygons,
    riverVector,
    safePlaces,
  ]);

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl bg-slate-950">
      {/* ── MAP CONTAINER ── */}
      <div ref={mapRef} className="w-full h-full" />

      {/* ── TOP-LEFT BADGE: Flood Risk Map (Location) ── */}
      <div className="absolute top-4 left-4 z-[400] bg-[#0d2244]/90 border border-blue-400/40 rounded-full px-4 py-1.5 shadow-2xl backdrop-blur-md flex items-center gap-2.5 pointer-events-auto">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-white text-xs sm:text-sm font-bold font-sans tracking-wide">
          Flood Risk Map ({displayTitle})
        </span>
      </div>

      {/* ── TOP-RIGHT LEGEND CARD (MATCHING REFERENCE IMAGE) ── */}
      <div className="absolute top-4 right-4 z-[400] bg-white/95 text-slate-800 rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-200/90 backdrop-blur-md text-[11px] font-sans w-[190px] sm:w-[205px] pointer-events-auto">
        {/* Header with North Compass Arrow */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
          <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Map Legend</span>
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center bg-white shadow-xs">
              <span className="text-[9px] text-slate-800 font-black leading-none">▲</span>
            </div>
            <span className="text-[9px] font-black text-slate-700 tracking-tight leading-none mt-0.5">N</span>
          </div>
        </div>

        {/* Legend items exactly matching media_1788882629381.png */}
        <div className="space-y-1.5 font-medium">
          {/* High Risk Zone */}
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-3 rounded-[3px] bg-[#ef4444] shrink-0 border border-red-600/30" />
            <span className="text-slate-800">High Risk Zone</span>
          </div>

          {/* Medium Risk Zone */}
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-3 rounded-[3px] bg-[#f97316] shrink-0 border border-orange-600/30" />
            <span className="text-slate-800">Medium Risk Zone</span>
          </div>

          {/* Low Risk Zone */}
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-3 rounded-[3px] bg-[#fde047] shrink-0 border border-yellow-500/40" />
            <span className="text-slate-800">Low Risk Zone</span>
          </div>

          {/* River / Water Flow */}
          <div className="flex items-center gap-2.5">
            <span className="text-[#2563eb] font-bold text-base leading-none w-5 text-center shrink-0">➔</span>
            <span className="text-slate-800">River / Water Flow</span>
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
            <span className="text-slate-800">Safe Shelter</span>
          </div>

          {/* Affected Location */}
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[#dc2626] flex items-center justify-center shrink-0 text-white font-black text-[9px] shadow-xs">
              !
            </div>
            <span className="text-slate-800">Affected Location</span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM-LEFT BASEMAP TOGGLE (SATELLITE / STREET) ── */}
      <div className="absolute bottom-4 left-4 z-[400] flex items-center gap-1.5 bg-slate-950/85 border border-slate-700/80 rounded-xl p-1 backdrop-blur-md shadow-xl text-[11px] font-mono pointer-events-auto">
        <button
          onClick={() => setBaseMapType('SATELLITE')}
          className={`px-2.5 py-1 rounded-lg font-bold transition ${
            baseMapType === 'SATELLITE'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          🛰️ Satellite
        </button>
        <button
          onClick={() => setBaseMapType('STREET')}
          className={`px-2.5 py-1 rounded-lg font-bold transition ${
            baseMapType === 'STREET'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          🗺️ Street
        </button>
      </div>
    </div>
  );
};

export default EvacuationLeafletMap;
