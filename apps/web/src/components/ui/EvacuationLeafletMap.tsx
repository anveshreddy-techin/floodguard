'use client';

import React, { useEffect, useRef, useState } from 'react';

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
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      // Load Leaflet CSS via link tag injection (avoids tsc CSS module error)
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        // Small delay to let CSS load before rendering
        await new Promise<void>((r) => setTimeout(r, 150));
      }

      // Fix broken default marker icons in Webpack/Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [userLat, userLon],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // OpenStreetMap humanitarian tiles — closest to Google/Apple Maps appearance
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // ── Flood Risk Zone: Red translucent circle ──
      const center = riskZoneCenter ?? [userLat, userLon] as [number, number];
      L.circle(center, {
        radius: riskRadiusM,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '8 4',
      })
        .addTo(map)
        .bindPopup(`<b style="color:#ef4444">⚠️ FLOOD RISK ZONE</b><br>Modeled high-risk inundation area<br>Avoid this region`);

      // ── Safe Evacuation Route (Cyan polyline) ──
      L.polyline(routePoints, {
        color: '#22d3ee',
        weight: 7,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      })
        .addTo(map)
        .bindPopup('<b style="color:#22d3ee">✅ SAFE EVACUATION ROUTE</b><br>North Ridge Elevated Trail<br>+120m elevation · 1.4 km');

      // Direction overlay dashes
      L.polyline(routePoints, {
        color: '#a5f3fc',
        weight: 2,
        opacity: 0.35,
        dashArray: '4 10',
      }).addTo(map);

      // ── Blocked Route (Red dashes) ──
      if (blockedPoints.length > 1) {
        L.polyline(blockedPoints, {
          color: '#dc2626',
          weight: 5,
          opacity: 0.85,
          dashArray: '6 5',
        })
          .addTo(map)
          .bindPopup('<b style="color:#dc2626">🚫 BLOCKED</b><br>Riverbed Bypass NH Link<br>HIGH INUNDATION RISK — Avoid');
      }

      // ── River channel overlay ──
      const riverCoords: [number, number][] = [
        [userLat - 0.005, userLon - 0.015],
        [userLat + 0.003, userLon - 0.005],
        [userLat + 0.008, userLon + 0.012],
        [userLat + 0.014, userLon + 0.022],
      ];
      L.polyline(riverCoords, { color: '#2563eb', weight: 8, opacity: 0.55 })
        .addTo(map)
        .bindPopup('<b style="color:#60a5fa">🌊 RIVER CHANNEL</b><br>Stage: 3.80m (RISING +0.40m/h)<br>Do NOT cross');

      // ── YOU Marker (Animated blue pulsing dot) ──
      const youIcon = L.divIcon({
        html: `
          <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center">
            <div style="position:absolute;width:40px;height:40px;background:rgba(6,182,212,0.22);border-radius:50%;animation:rp 1.4s infinite"></div>
            <div style="position:absolute;width:26px;height:26px;background:rgba(6,182,212,0.38);border-radius:50%;animation:rp 1.4s 0.35s infinite"></div>
            <div style="position:relative;width:18px;height:18px;background:#0891b2;border:3px solid #67e8f9;border-radius:50%;box-shadow:0 0 14px rgba(6,182,212,0.9);z-index:10"></div>
            <style>@keyframes rp{0%{transform:scale(0.8);opacity:0.9}70%{transform:scale(1.9);opacity:0}100%{transform:scale(2.2);opacity:0}}</style>
          </div>`,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const youMarker = L.marker([userLat, userLon], { icon: youIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:monospace;font-size:12px;line-height:1.6">
            <b style="color:#22d3ee">📍 YOUR CURRENT LOCATION</b><br>
            ${userLat.toFixed(5)}°N, ${userLon.toFixed(5)}°E<br>
            GPS Accuracy: ±15m<br>
            <b style="color:#f87171">⚠️ INSIDE HIGH RISK FLOOD ZONE</b><br>
            <span style="color:#fbbf24">Evacuate immediately via North Ridge Trail</span>
          </div>`);

      userMarkerRef.current = youMarker;

      // ── PRIMARY SHELTER Marker ──
      const shelterIcon = L.divIcon({
        html: `
          <div style="display:flex;flex-direction:column;align-items:center">
            <div style="background:#15803d;border:3px solid #4ade80;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 16px rgba(22,163,74,0.8)">🏫</div>
            <div style="width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-top:13px solid #15803d;margin-top:-2px"></div>
          </div>`,
        className: '',
        iconSize: [36, 49],
        iconAnchor: [18, 49],
      });

      L.marker([shelterLat, shelterLon], { icon: shelterIcon, zIndexOffset: 900 })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:monospace;font-size:12px;line-height:1.6">
            <b style="color:#4ade80">🏫 PRIMARY EVACUATION SHELTER</b><br>
            Community High School<br>
            Capacity: 250 persons<br>
            Elevation: +120m above flood zone<br>
            Distance: 1.4 km via North Ridge Trail<br>
            <b style="color:#4ade80">Status: SHELTER OPEN ✓</b>
          </div>`);

      // ── SECONDARY SHELTER (Panchayat Bhavan) ──
      const shelter2Icon = L.divIcon({
        html: `
          <div style="display:flex;flex-direction:column;align-items:center">
            <div style="background:#1d4ed8;border:2px solid #60a5fa;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 0 10px rgba(29,78,216,0.6)">🏛️</div>
            <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:10px solid #1d4ed8;margin-top:-1px"></div>
          </div>`,
        className: '',
        iconSize: [28, 38],
        iconAnchor: [14, 38],
      });

      L.marker([userLat + 0.012, userLon + 0.006], { icon: shelter2Icon, zIndexOffset: 800 })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:monospace;font-size:12px;line-height:1.6">
            <b style="color:#60a5fa">🏛️ SECONDARY SHELTER — Panchayat Bhavan</b><br>
            Distance: 2.1 km, +85m elevation<br>
            Avoids low culvert KM 0.6 bottleneck<br>
            <b style="color:#60a5fa">Status: CANDIDATE ROUTE</b>
          </div>`);

      // ── NDRF Staging Area label ──
      const ndrfIcon = L.divIcon({
        html: `
          <div style="background:#7c3aed;color:white;border:2px solid #a78bfa;border-radius:8px;padding:3px 8px;font-family:monospace;font-size:10px;font-weight:900;white-space:nowrap;box-shadow:0 0 10px rgba(124,58,237,0.5)">
            🚑 NDRF CAMP
          </div>`,
        className: '',
        iconSize: [90, 24],
        iconAnchor: [45, 12],
      });

      L.marker([userLat + 0.018, userLon - 0.010], { icon: ndrfIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:monospace;font-size:12px;line-height:1.6">
            <b style="color:#a78bfa">🚑 NDRF 8th Battalion Staging</b><br>
            35 Rescuers · 6 Inflatable Boats<br>
            Radio: 156.525 MHz
          </div>`);

      // Fit map bounds to include all relevant points
      const allPoints: [number, number][] = [[userLat, userLon], [shelterLat, shelterLon], ...routePoints];
      map.fitBounds(L.latLngBounds(allPoints), { padding: [60, 60] });

      mapInstanceRef.current = map;
      setMapReady(true);
    };

    initMap().catch(console.error);
  }, []);

  // Pan map when GPS coords update
  useEffect(() => {
    if (!mapInstanceRef.current || !userMarkerRef.current) return;
    userMarkerRef.current.setLatLng([userLat, userLon]);
    mapInstanceRef.current.panTo([userLat, userLon]);
  }, [userLat, userLon]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl"
      style={{ height: emergencyMode ? '72vh' : '430px' }}
    >
      {/* Loading state */}
      {!mapReady && (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-cyan-300 text-xs font-mono font-bold animate-pulse">LOADING REAL-WORLD MAP…</p>
          <p className="text-slate-500 text-[10px] font-mono">Fetching OpenStreetMap tiles · Projecting flood perimeters</p>
        </div>
      )}

      {/* Leaflet DOM target */}
      <div ref={mapRef} className="w-full h-full z-0" />

      {/* GPS / Demo badge top-left */}
      <div className="absolute top-3 left-12 z-[500] flex flex-col gap-1.5 pointer-events-none">
        <div className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold shadow-xl ${
          locationMode === 'BROWSER'
            ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
            : 'bg-amber-950 text-amber-300 border border-amber-700'
        }`}>
          {locationMode === 'BROWSER' ? '📍 LIVE GPS' : '📍 DEMO LOCATION (Chamoli, UK)'}
        </div>
        <div className="bg-slate-950/90 text-cyan-300 text-[10px] font-mono border border-cyan-800 px-2 py-1 rounded-lg">
          {userLat.toFixed(4)}°N · {userLon.toFixed(4)}°E
        </div>
      </div>

      {/* Map Legend bottom-right */}
      <div className="absolute bottom-8 right-2 z-[500] bg-slate-950/95 backdrop-blur border border-slate-700 rounded-2xl p-3 space-y-1.5 text-[10px] font-mono pointer-events-none shadow-2xl min-w-[155px]">
        <div className="text-slate-400 font-bold uppercase tracking-wider mb-1.5">MAP LEGEND</div>
        {[
          { color: '#22d3ee', type: 'circle', label: 'Your Location' },
          { color: '#4ade80', type: 'circle', label: 'Primary Shelter' },
          { color: '#60a5fa', type: 'circle', label: 'Secondary Shelter' },
          { color: '#22d3ee', type: 'line', label: 'Safe Route' },
          { color: '#ef4444', type: 'dash', label: 'Blocked Route' },
          { color: '#2563eb', type: 'line', label: 'River Channel', opacity: 0.5 },
          { color: '#ef4444', type: 'zone', label: 'Flood Risk Zone' },
          { color: '#a78bfa', type: 'circle', label: 'NDRF Camp' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            {item.type === 'circle' && (
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color, opacity: item.opacity ?? 1 }} />
            )}
            {item.type === 'line' && (
              <span className="w-6 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color, opacity: item.opacity ?? 1 }} />
            )}
            {item.type === 'dash' && (
              <span className="w-6 h-1.5 flex-shrink-0" style={{ background: `repeating-linear-gradient(90deg,${item.color} 0 4px,transparent 4px 8px)` }} />
            )}
            {item.type === 'zone' && (
              <span className="w-3 h-3 rounded flex-shrink-0 border" style={{ background: `${item.color}33`, borderColor: item.color }} />
            )}
            <span style={{ color: item.color }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Emergency pulse border */}
      {emergencyMode && (
        <div className="absolute inset-0 z-[490] pointer-events-none border-4 border-rose-600 animate-pulse rounded-2xl" />
      )}
    </div>
  );
};

export default EvacuationLeafletMap;
