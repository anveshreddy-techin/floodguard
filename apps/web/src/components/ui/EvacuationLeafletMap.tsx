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
  isSafeZone?: boolean;
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

      const center = riskZoneCenter ?? [userLat, userLon] as [number, number];

      // ── Buffer Circle: Green if SAFE, Red dashed if HAZARD ──
      if (isSafeZone) {
        L.circle(center, {
          radius: 350,
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.12,
          weight: 2,
        })
          .addTo(lg)
          .bindPopup(`<b style="color:#10b981">✅ SAFE ZONE · NORMAL ELEVATED GROUND</b><br>No active river flood inundation detected at this location.`);
      } else {
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
      }

      // ── Safe Evacuation Route (Cyan polyline) ──
      L.polyline(routePoints, {
        color: isSafeZone ? '#10b981' : '#22d3ee',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      })
        .addTo(lg)
        .bindPopup(`<b style="color:#22d3ee">📍 ${isSafeZone ? 'PRIMARY RIDGE TRAIL' : 'RECOMMENDED ESCAPE VECTOR'}</b><br>${shelterName}<br>+120m Elevation Gain · 1.4 km`);

      L.polyline(routePoints, {
        color: isSafeZone ? '#6ee7b7' : '#a5f3fc',
        weight: 2,
        opacity: 0.4,
        dashArray: '4 10',
      }).addTo(lg);

      // ── Blocked Route (Red dashes) — only shown if in flood hazard ──
      if (!isSafeZone && blockedPoints.length > 1) {
        L.polyline(blockedPoints, {
          color: '#dc2626',
          weight: 5,
          opacity: 0.85,
          dashArray: '6 5',
        })
          .addTo(lg)
          .bindPopup('<b style="color:#dc2626">🚫 BLOCKED ROUTE</b><br>Low-Lying Drainage Bypass Link<br>HIGH INUNDATION RISK — Avoid completely');
      }

      // ── YOU Marker (Animated pulsing dot: Emerald if Safe, Cyan if Operational) ──
      const youColor = isSafeZone ? '#10b981' : '#0891b2';
      const youGlow = isSafeZone ? 'rgba(16,185,129,0.3)' : 'rgba(6,182,212,0.3)';
      const youBorder = isSafeZone ? '#34d399' : '#67e8f9';

      const youIcon = L.divIcon({
        html: `
          <div style="position:relative;width:42px;height:42px;display:flex;align-items:center;justify-content:center">
            <div style="position:absolute;width:42px;height:42px;background:${youGlow};border-radius:50%;animation:rp 1.4s infinite"></div>
            <div style="position:absolute;width:28px;height:28px;background:${youGlow};border-radius:50%;animation:rp 1.4s 0.35s infinite"></div>
            <div style="position:relative;width:18px;height:18px;background:${youColor};border:3px solid ${youBorder};border-radius:50%;box-shadow:0 0 14px ${youColor};z-index:10"></div>
            <style>@keyframes rp{0%{transform:scale(0.8);opacity:0.9}70%{transform:scale(1.9);opacity:0}100%{transform:scale(2.2);opacity:0}}</style>
          </div>`,
        className: '',
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });

      const userPopup = isSafeZone ? `
        <div style="font-family:monospace;font-size:12px;line-height:1.6">
          <b style="color:#10b981">📍 YOUR LOCATION · ${locationName}</b><br>
          ${userLat.toFixed(5)}°N, ${userLon.toFixed(5)}°E (${stateName})<br>
          <b style="color:#10b981">✅ STATUS: SAFE ZONE</b><br>
          <span style="color:#94a3b8">Normal dry ground. No active flood threat detected.</span>
        </div>` : `
        <div style="font-family:monospace;font-size:12px;line-height:1.6">
          <b style="color:#22d3ee">📍 YOUR LOCATION · ${locationName}</b><br>
          ${userLat.toFixed(5)}°N, ${userLon.toFixed(5)}°E (${stateName})<br>
          GPS Accuracy: ±15m<br>
          <b style="color:#f87171">⚠️ INSIDE ${riskLevel} RISK CORRIDOR</b><br>
          <span style="color:#fbbf24">Evacuate toward ${shelterName}</span>
        </div>`;

      L.marker([userLat, userLon], { icon: youIcon, zIndexOffset: 1000 })
        .addTo(lg)
        .bindPopup(userPopup);

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
            Elevation: +120m above modeled base terrain<br>
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
            Emergency Radio: 156.525 MHz · Helpline: 112 / 1070
          </div>`);

      // Fit map to new coordinates
      const allPoints: [number, number][] = [[userLat, userLon], [shelterLat, shelterLon], ...routePoints];
      map.fitBounds(L.latLngBounds(allPoints), { padding: [55, 55], maxZoom: 15 });
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
  ]);

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      <div ref={mapRef} className="w-full h-full" style={{ zIndex: 1 }} />

      {/* Floating Mode Pill Top-Center */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-[400] bg-slate-950/90 border border-slate-800/90 rounded-full px-3.5 py-1 text-xs font-mono font-bold backdrop-blur-md shadow-xl flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isSafeZone ? 'bg-emerald-400' : 'bg-cyan-400'} animate-ping`} />
        <span className={isSafeZone ? 'text-emerald-300' : 'text-cyan-300'}>
          {locationMode === 'BROWSER' ? '📍 LIVE GPS' : 'DEMO DRILL LOCATION'}
        </span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-300">{stateName}</span>
      </div>

      {/* Floating Coordinates Bar */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-[400] bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-0.5 text-[10px] font-mono text-slate-300 backdrop-blur-md">
        {userLat.toFixed(4)}°N · {userLon.toFixed(4)}°E
      </div>

      {/* Mini Map Legend in Bottom Right */}
      <div className="absolute bottom-3 right-3 z-[400] bg-slate-950/95 border border-slate-800 rounded-2xl p-2.5 text-[10px] font-mono space-y-1 backdrop-blur-md shadow-2xl hidden sm:block">
        <span className="text-slate-400 font-bold uppercase tracking-wider block">MAP LEGEND</span>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isSafeZone ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
          <span className="text-slate-200">Your Location ({isSafeZone ? 'Safe' : 'Active'})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-200">Primary Shelter (Elevated)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-slate-200">Secondary Shelter</span>
        </div>
        {!isSafeZone && (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-rose-300">Modeled Flood Zone</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvacuationLeafletMap;
