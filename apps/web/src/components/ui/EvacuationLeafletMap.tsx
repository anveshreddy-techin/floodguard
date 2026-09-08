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
  // Enhanced Multi-Zone & River Inputs
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
  shelterName = 'Community High School Shelter',
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
  const layerGroupRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    let isCancelled = false;

    const initOrUpdateMap = async () => {
      const L = (await import('leaflet')).default;

      // Inject CSS if missing
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

      // Initialize map once
      if (!mapInstanceRef.current && mapRef.current) {
        const map = L.map(mapRef.current, {
          center: [userLat, userLon],
          zoom: 13.5,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · FloodGuard AI',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        layerGroupRef.current = L.layerGroup().addTo(map);
      }

      if (isCancelled || !mapInstanceRef.current) return;

      const map = mapInstanceRef.current;
      const lg = layerGroupRef.current;
      lg.clearLayers();

      const center = riskZoneCenter ?? ([userLat, userLon] as [number, number]);

      // ── 1. 3-ZONE FLOOD RISK OVERLAYS (RED, ORANGE, YELLOW) ──
      if (!isSafeZone) {
        if (floodPolygons) {
          // Yellow Zone 3 — Outer Advisory / Waterlogging
          if (floodPolygons.zone3Yellow && floodPolygons.zone3Yellow.length > 2) {
            L.polygon(floodPolygons.zone3Yellow, {
              color: '#ca8a04',
              weight: 1.5,
              dashArray: '6 4',
              fillColor: '#facc15',
              fillOpacity: 0.22,
            })
              .addTo(lg)
              .bindPopup(`
                <div style="font-family:monospace;font-size:12px;line-height:1.6;color:#0f172a;min-width:230px;">
                  <b style="color:#ca8a04;font-size:13px;">🟡 ZONE 3 — CAUTION / ADVISORY BUFFER</b><br/>
                  <b>Water Depth:</b> &lt;0.5m (Urban waterlogging &amp; splash runout)<br/>
                  <b>Area:</b> Slope toes, outer drainage perimeter<br/>
                  <b>Status:</b> Prepare to evacuate · Keep battery devices charged
                </div>
              `);
          }

          // Orange Zone 2 — High Surge Reach Buffer
          if (floodPolygons.zone2Orange && floodPolygons.zone2Orange.length > 2) {
            L.polygon(floodPolygons.zone2Orange, {
              color: '#ea580c',
              weight: 2,
              fillColor: '#f97316',
              fillOpacity: 0.35,
            })
              .addTo(lg)
              .bindPopup(`
                <div style="font-family:monospace;font-size:12px;line-height:1.6;color:#0f172a;min-width:230px;">
                  <b style="color:#ea580c;font-size:13px;">🟠 ZONE 2 — HIGH SURGE REACH BUFFER</b><br/>
                  <b>Water Depth:</b> 0.6m – 2.0m (High velocity runoff)<br/>
                  <b>Area:</b> Low alluvial terraces, riverfront municipal wards<br/>
                  <b>Directive:</b> <span style="color:#ea580c;font-weight:bold;">MOVE TO HIGHER GROUND IMMEDIATELY</span>
                </div>
              `);
          }

          // Red Zone 1 — Active Inundation / Submerged Channel
          if (floodPolygons.zone1Red && floodPolygons.zone1Red.length > 2) {
            L.polygon(floodPolygons.zone1Red, {
              color: '#dc2626',
              weight: 2.5,
              fillColor: '#ef4444',
              fillOpacity: 0.52,
            })
              .addTo(lg)
              .bindPopup(`
                <div style="font-family:monospace;font-size:12px;line-height:1.6;color:#0f172a;min-width:230px;">
                  <b style="color:#dc2626;font-size:13px;">🔴 ZONE 1 — ACTIVE INUNDATION (CRITICAL)</b><br/>
                  <b>Water Depth:</b> 2.0m – 4.5m (Torrential Surge)<br/>
                  <b>Area:</b> Submerged riverbed, breached embankments, ghats<br/>
                  <b>Danger:</b> <span style="color:#dc2626;font-weight:bold;">EXTREME SURGE DANGER — DO NOT ENTER!</span>
                </div>
              `);
          }
        } else {
          // Dynamic Concentric Multi-Zone fallback centered on coordinates
          // Zone 3 (Yellow): 1000m radius
          L.circle(center, {
            radius: riskRadiusM * 1.6,
            color: '#ca8a04',
            weight: 1.5,
            dashArray: '6 4',
            fillColor: '#facc15',
            fillOpacity: 0.20,
          })
            .addTo(lg)
            .bindPopup(`<b style="color:#ca8a04">🟡 ZONE 3 — CAUTION BUFFER</b><br/>Precautionary perimeter (<0.5m waterlogging)`);

          // Zone 2 (Orange): 650m radius
          L.circle(center, {
            radius: riskRadiusM,
            color: '#ea580c',
            weight: 2,
            fillColor: '#f97316',
            fillOpacity: 0.32,
          })
            .addTo(lg)
            .bindPopup(`<b style="color:#ea580c">🟠 ZONE 2 — HIGH SURGE BUFFER</b><br/>Low-lying areas at risk (0.6m–2.0m)`);

          // Zone 1 (Red): 380m radius
          L.circle(center, {
            radius: riskRadiusM * 0.58,
            color: '#dc2626',
            weight: 2.5,
            fillColor: '#ef4444',
            fillOpacity: 0.50,
          })
            .addTo(lg)
            .bindPopup(`<b style="color:#dc2626">🔴 ZONE 1 — ACTIVE INUNDATION</b><br/>Submerged flash flood channel (2.0m–4.0m)`);
        }
      } else {
        // Safe condition: Green buffer circle
        L.circle(center, {
          radius: 380,
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.12,
          weight: 2,
        })
          .addTo(lg)
          .bindPopup(`<b style="color:#10b981">✅ LOWEST EXPOSURE · ELEVATED GROUND</b><br>Dry roadway terrain with no active inundation.`);
      }

      // ── 2. REAL RIVER FLOW VECTOR (IF PROVIDED) ──
      if (riverVector && riverVector.length > 1) {
        L.polyline(riverVector, {
          color: '#0369a1',
          weight: 8,
          opacity: 0.85,
          lineCap: 'round',
        }).addTo(lg);

        L.polyline(riverVector, {
          color: '#38bdf8',
          weight: 3.5,
          opacity: 0.95,
          lineCap: 'round',
        })
          .addTo(lg)
          .bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;">
              <b style="color:#0284c7">💧 ${riverName}</b><br/>
              Current State: Active Monsoon / Surge Hydrograph<br/>
              <b>Surge Flow Direction:</b> Downstream Valley Gradient
            </div>
          `);
      }

      // ── 3. CANDIDATE EVACUATION ESCAPE VECTOR (GREEN / CYAN) ──
      L.polyline(routePoints, {
        color: isSafeZone ? '#10b981' : '#059669',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(lg);

      L.polyline(routePoints, {
        color: '#a7f3d0',
        weight: 2,
        dashArray: '4 8',
      })
        .addTo(lg)
        .bindPopup(`
          <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;">
            <b style="color:#059669">🚶 CANDIDATE ESCAPE ROUTE</b><br/>
            Destination: ${shelterName}<br/>
            <b>Path:</b> Uphill / High-ground corridor safely outside inundation zone.
          </div>
        `);

      // ── 4. BLOCKED ROUTE (RED DASHES) ──
      if (!isSafeZone && blockedPoints.length > 1) {
        L.polyline(blockedPoints, {
          color: '#ef4444',
          weight: 5,
          opacity: 0.9,
          dashArray: '6 6',
        })
          .addTo(lg)
          .bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;">
              <b style="color:#dc2626">🚫 BLOCKED ROADWAY / SUBMERGED CAUSEWAY</b><br/>
              Condition: Inundated under active surge water.<br/>
              <span style="color:#dc2626;font-weight:bold;">DO NOT ATTEMPT TO CROSS!</span>
            </div>
          `);
      }

      // ── 5. USER POSITION PIN ──
      const youColor = isSafeZone ? '#10b981' : '#f97316';
      const youBorder = isSafeZone ? '#34d399' : '#fed7aa';

      const youIcon = L.divIcon({
        html: `
          <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center">
            <div style="position:absolute;width:34px;height:34px;background:${isSafeZone ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.35)'};border-radius:50%;"></div>
            <div style="position:relative;width:18px;height:18px;background:${youColor};border:3px solid ${youBorder};border-radius:50%;box-shadow:0 0 14px ${youColor};z-index:10"></div>
          </div>`,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker([userLat, userLon], { icon: youIcon, zIndexOffset: 1000 })
        .addTo(lg)
        .bindPopup(`
          <div style="font-family:monospace;font-size:12px;line-height:1.6;color:#0f172a;">
            <b style="color:#0f172a">📍 YOUR CURRENT POSITION · ${locationName}</b><br/>
            ${userLat.toFixed(5)}°N, ${userLon.toFixed(5)}°E (${stateName})<br/>
            Status: <b style="color:${isSafeZone ? '#059669' : '#dc2626'}">${isSafeZone ? 'SAFE (ELEVATED)' : 'EXPOSED IN SURGE AREA'}</b><br/>
            ${!isSafeZone ? `<span style="color:#dc2626;font-weight:bold;">Follow green route to ${shelterName}</span>` : ''}
          </div>
        `);

      // ── 6. PRIMARY & SECONDARY DESIGNATED SHELTERS ──
      const shelterIcon = L.divIcon({
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="background:#059669;border:3px solid #6ee7b7;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 16px rgba(16,185,129,0.8);color:white;">
              🏕️
            </div>
            <div style="background:rgba(15,23,42,0.92);border:1px solid #10b981;color:#a7f3d0;font-family:monospace;font-size:9px;font-weight:bold;padding:2px 5px;border-radius:4px;margin-top:2px;white-space:nowrap;">
              SAFE REFUGE
            </div>
          </div>`,
        className: '',
        iconSize: [90, 52],
        iconAnchor: [45, 26],
      });

      L.marker([shelterLat, shelterLon], { icon: shelterIcon, zIndexOffset: 950 })
        .addTo(lg)
        .bindPopup(`
          <div style="font-family:monospace;font-size:12px;line-height:1.6;color:#0f172a;min-width:240px;">
            <b style="color:#059669;font-size:13px;">🏕️ PRIMARY DESIGNATED SAFE REFUGE</b><br/>
            <b>Name:</b> ${shelterName}<br/>
            <b>Elevation:</b> High Ground (Safely above flood hazard)<br/>
            <b>Supplies:</b> Potable Water, Emergency Food, First-Aid ✓<br/>
            <b>State Agency:</b> ${stateName} Disaster Management Authority
          </div>
        `);

      // Additional Safe Places (if provided)
      if (safePlaces && safePlaces.length > 0) {
        safePlaces.forEach((sp) => {
          if (Math.abs(sp.lat - shelterLat) > 0.001 || Math.abs(sp.lon - shelterLon) > 0.001) {
            const secIcon = L.divIcon({
              html: `
                <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
                  <div style="background:#0284c7;border:2px solid #38bdf8;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 0 10px rgba(2,132,199,0.6);color:white;">
                    🏛️
                  </div>
                  <div style="background:rgba(15,23,42,0.92);border:1px solid #0284c7;color:#bae6fd;font-family:monospace;font-size:9px;font-weight:bold;padding:1px 4px;border-radius:4px;margin-top:2px;white-space:nowrap;">
                    ${sp.name.split(' ')[0]}
                  </div>
                </div>`,
              className: '',
              iconSize: [70, 44],
              iconAnchor: [35, 20],
            });

            L.marker([sp.lat, sp.lon], { icon: secIcon, zIndexOffset: 850 })
              .addTo(lg)
              .bindPopup(`
                <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;">
                  <b style="color:#0284c7;">🏛️ SECONDARY SAFE REFUGE: ${sp.name}</b><br/>
                  <b>Elevation:</b> ${sp.elevation}<br/>
                  <b>Type:</b> ${sp.type} · High Ground<br/>
                  <b>Distance:</b> ${sp.distance}
                </div>
              `);
          }
        });
      }

      // ── 7. SDRF / EMERGENCY POST ──
      const ndrfIcon = L.divIcon({
        html: `
          <div style="background:#6d28d9;color:white;border:2px solid #c4b5fd;border-radius:8px;padding:3px 8px;font-family:monospace;font-size:10px;font-weight:900;white-space:nowrap;box-shadow:0 0 10px rgba(109,40,217,0.6)">
            🚑 ${stateName.toUpperCase()} SDRF / 112
          </div>`,
        className: '',
        iconSize: [110, 24],
        iconAnchor: [55, 12],
      });

      L.marker([shelterLat + 0.003, shelterLon + 0.003], { icon: ndrfIcon, zIndexOffset: 800 })
        .addTo(lg)
        .bindPopup(`
          <div style="font-family:monospace;font-size:12px;line-height:1.6;color:#0f172a;">
            <b style="color:#6d28d9">🚑 ${stateName} Emergency Response Unit</b><br/>
            Trained Rescue Boats &amp; Paramedic Post<br/>
            <b>Emergency Helpline:</b> 112 / 1070
          </div>
        `);

      // Fit map to points
      const allPoints: [number, number][] = [
        [userLat, userLon],
        [shelterLat, shelterLon],
        ...routePoints,
      ];
      if (riverVector && riverVector.length > 0) {
        allPoints.push(riverVector[0], riverVector[riverVector.length - 1]);
      }
      map.fitBounds(L.latLngBounds(allPoints), { padding: [50, 50], maxZoom: 15 });
      setMapReady(true);
    };

    initOrUpdateMap();

    return () => {
      isCancelled = true;
    };
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
    locationMode,
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
    <div className="relative w-full h-[460px] sm:h-[520px] rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl">
      <div ref={mapRef} className="w-full h-full" />

      {/* ── ON-MAP EXPLANATORY HUD COLOR LEGEND (Bottom Right) ── */}
      <div className="absolute bottom-3 right-3 z-[400] bg-slate-950/95 border border-cyan-500/40 rounded-xl p-2.5 backdrop-blur-xl text-[10px] font-mono shadow-2xl space-y-1.5 pointer-events-auto max-w-[260px]">
        <div className="text-cyan-300 font-bold uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>🗺️ FLOOD RISK &amp; REFUGE</span>
          <span className="text-[9px] text-slate-400">{stateName}</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded bg-red-600/80 border border-red-500 shrink-0" />
            <span className="text-red-300 font-bold">🔴 Active Inundation (Fatal surge)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded bg-orange-500/70 border border-orange-400 shrink-0" />
            <span className="text-orange-300 font-bold">🟠 High Surge Buffer (Low ground)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded bg-yellow-400/50 border border-yellow-400 shrink-0" />
            <span className="text-yellow-300 font-bold">🟡 Caution Zone (Waterlogging)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-300 shrink-0" />
            <span className="text-emerald-300 font-bold">🟢 Safe Elevated Shelter</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-500 shrink-0" />
            <span className="text-rose-400 font-bold">🚫 Submerged Roadway</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EvacuationLeafletMap;
