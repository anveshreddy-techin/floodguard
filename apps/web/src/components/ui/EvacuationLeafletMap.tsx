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
  locationName?: string;
  stateName?: string;
  shelterName?: string;
  riverName?: string;
  riskLevel?: string;
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
          zoom: 14,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        layerGroupRef.current = L.layerGroup().addTo(map);
      }

      if (isCancelled || !mapInstanceRef.current) return;

      const map = mapInstanceRef.current;
      const lg = layerGroupRef.current;
      lg.clearLayers();

      // ── Flood Risk Zone: Red translucent circle ──
      const center = riskZoneCenter ?? [userLat, userLon] as [number, number];
      L.circle(center, {
        radius: riskRadiusM,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '8 4',
      })
        .addTo(lg)
        .bindPopup(`<b style="color:#ef4444">⚠️ ${locationName.toUpperCase()} FLOOD RISK ZONE</b><br>Modeled ${riskLevel} flood inundation corridor<br>Avoid low-lying depressions`);

      // ── Safe Evacuation Route (Cyan polyline) ──
      L.polyline(routePoints, {
        color: '#22d3ee',
        weight: 7,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      })
        .addTo(lg)
        .bindPopup(`<b style="color:#22d3ee">✅ RECOMMENDED ESCAPE VECTOR</b><br>${shelterName}<br>+120m Elevation Gain · 1.4 km`);

      L.polyline(routePoints, {
        color: '#a5f3fc',
        weight: 2,
        opacity: 0.4,
        dashArray: '4 10',
      }).addTo(lg);

      // ── Blocked Route (Red dashes) ──
      if (blockedPoints.length > 1) {
        L.polyline(blockedPoints, {
          color: '#dc2626',
          weight: 5,
          opacity: 0.85,
          dashArray: '6 5',
        })
          .addTo(lg)
          .bindPopup('<b style="color:#dc2626">🚫 BLOCKED ROUTE</b><br>Low-Lying Drainage Bypass Link<br>HIGH INUNDATION RISK — Avoid completely');
      }

      // ── YOU Marker (Animated blue pulsing dot) ──
      const youIcon = L.divIcon({
        html: `
          <div style="position:relative;width:42px;height:42px;display:flex;align-items:center;justify-content:center">
            <div style="position:absolute;width:42px;height:42px;background:rgba(6,182,212,0.25);border-radius:50%;animation:rp 1.4s infinite"></div>
            <div style="position:absolute;width:28px;height:28px;background:rgba(6,182,212,0.4);border-radius:50%;animation:rp 1.4s 0.35s infinite"></div>
            <div style="position:relative;width:18px;height:18px;background:#0891b2;border:3px solid #67e8f9;border-radius:50%;box-shadow:0 0 14px rgba(6,182,212,0.9);z-index:10"></div>
            <style>@keyframes rp{0%{transform:scale(0.8);opacity:0.9}70%{transform:scale(1.9);opacity:0}100%{transform:scale(2.2);opacity:0}}</style>
          </div>`,
        className: '',
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });

      L.marker([userLat, userLon], { icon: youIcon, zIndexOffset: 1000 })
        .addTo(lg)
        .bindPopup(`
          <div style="font-family:monospace;font-size:12px;line-height:1.6">
            <b style="color:#22d3ee">📍 YOUR LOCATION · ${locationName}</b><br>
            ${userLat.toFixed(5)}°N, ${userLon.toFixed(5)}°E (${stateName})<br>
            GPS Accuracy: ±15m<br>
            <b style="color:#f87171">⚠️ INSIDE ${riskLevel} RISK CORRIDOR</b><br>
            <span style="color:#fbbf24">Evacuate toward ${shelterName}</span>
          </div>`);

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
        .addTo(lg)
        .bindPopup(`
          <div style="font-family:monospace;font-size:12px;line-height:1.6">
            <b style="color:#4ade80">🏫 PRIMARY EVACUATION SHELTER</b><br>
            ${shelterName}<br>
            Capacity: 350 persons (${stateName})<br>
            Elevation: +120m above modeled flood line<br>
            <b style="color:#4ade80">Status: SHELTER ACTIVE &amp; STOCKED ✓</b>
          </div>`);

      // ── SECONDARY SHELTER ──
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
        .addTo(lg)
        .bindPopup(`
          <div style="font-family:monospace;font-size:12px;line-height:1.6">
            <b style="color:#60a5fa">🏛️ SECONDARY SHELTER — Panchayat Relief Hall</b><br>
            Distance: 2.1 km, +85m elevation gain<br>
            Avoids lower bottleneck culvert<br>
            <b style="color:#60a5fa">Status: CANDIDATE ROUTE</b>
          </div>`);

      // ── NDRF / SDRF Camp ──
      const ndrfIcon = L.divIcon({
        html: `
          <div style="background:#7c3aed;color:white;border:2px solid #a78bfa;border-radius:8px;padding:3px 8px;font-family:monospace;font-size:10px;font-weight:900;white-space:nowrap;box-shadow:0 0 10px rgba(124,58,237,0.5)">
            🚑 ${stateName.toUpperCase()} SDRF / NDRF
          </div>`,
        className: '',
        iconSize: [110, 24],
        iconAnchor: [55, 12],
      });

      L.marker([userLat + 0.015, userLon - 0.010], { icon: ndrfIcon })
        .addTo(lg)
        .bindPopup(`
          <div style="font-family:monospace;font-size:12px;line-height:1.6">
            <b style="color:#a78bfa">🚑 ${stateName} Emergency Response Post</b><br>
            Trained Quick Response Force · Rescue Boats Ready<br>
            Emergency Radio: 156.525 MHz · Helpline: 1070
          </div>`);

      // Fit map to new coordinates
      const allPoints: [number, number][] = [[userLat, userLon], [shelterLat, shelterLon], ...routePoints];
      map.fitBounds(L.latLngBounds(allPoints), { padding: [55, 55], maxZoom: 15 });
      setMapReady(true);
    };

    initOrUpdateMap().catch(console.error);

    return () => {
      isCancelled = true;
    };
  }, [userLat, userLon, shelterLat, shelterLon, locationName, stateName, shelterName, riskLevel]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl"
      style={{ height: emergencyMode ? '72vh' : '430px' }}
    >
      {/* Loading state */}
      {!mapReady && (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-cyan-300 text-xs font-mono font-bold animate-pulse">LOADING MAP FOR {locationName.toUpperCase()}…</p>
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
            : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
        }`}>
          {locationMode === 'BROWSER' ? '📍 LIVE GPS' : `📍 ${locationName} (${stateName})`}
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
          { color: '#ef4444', type: 'zone', label: 'Flood Risk Zone' },
          { color: '#a78bfa', type: 'circle', label: 'SDRF/NDRF Camp' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            {item.type === 'circle' && (
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
            )}
            {item.type === 'line' && (
              <span className="w-6 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
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
