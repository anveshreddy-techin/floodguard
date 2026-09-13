'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  MapPin, 
  Home, 
  Layers, 
  Crosshair, 
  Plus, 
  Minus, 
  AlertTriangle,
  Compass,
  Maximize2
} from 'lucide-react';

export interface VillageData {
  id: string;
  name: string;
  mandal: string;
  lat: number;
  lon: number;
  riskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  population: number;
  households: number;
  elevation: string;
  riverDistance: string;
  rainfall1h: string;
  waterLevel: string;
  soilMoisture: string;
  leadTime: string;
  shelterName: string;
  shelterDistance: string;
  shelterCapacity: number;
}

export const DEMO_VILLAGES: VillageData[] = [
  {
    id: 'rangapur',
    name: 'Rangapur',
    mandal: 'Veligonda',
    lat: 16.5200,
    lon: 78.1800,
    riskScore: 8.2,
    riskLevel: 'HIGH',
    population: 1842,
    households: 462,
    elevation: '134 m',
    riverDistance: 'Krishna River (2.1 km)',
    rainfall1h: '42 mm',
    waterLevel: '4.8 m (rising)',
    soilMoisture: '68%',
    leadTime: '6 - 8 hours',
    shelterName: 'Govt. High School',
    shelterDistance: '1.4 km',
    shelterCapacity: 420,
  },
  {
    id: 'veligonda',
    name: 'Veligonda',
    mandal: 'Veligonda',
    lat: 16.4800,
    lon: 78.2300,
    riskScore: 6.4,
    riskLevel: 'MODERATE',
    population: 3120,
    households: 780,
    elevation: '148 m',
    riverDistance: 'Krishna River (3.4 km)',
    rainfall1h: '36 mm',
    waterLevel: '3.9 m (rising)',
    soilMoisture: '62%',
    leadTime: '8 - 10 hours',
    shelterName: 'Panchayat Community Hall',
    shelterDistance: '2.1 km',
    shelterCapacity: 350,
  },
  {
    id: 'kondapur',
    name: 'Kondapur',
    mandal: 'Veligonda',
    lat: 16.5600,
    lon: 78.2200,
    riskScore: 5.8,
    riskLevel: 'MODERATE',
    population: 1450,
    households: 360,
    elevation: '162 m',
    riverDistance: 'Krishna Tributary (1.8 km)',
    rainfall1h: '28 mm',
    waterLevel: '3.2 m',
    soilMoisture: '59%',
    leadTime: '12+ hours',
    shelterName: 'Zilla Parishad School',
    shelterDistance: '1.8 km',
    shelterCapacity: 300,
  },
  {
    id: 'cheruvu',
    name: 'Cheruvu',
    mandal: 'Veligonda',
    lat: 16.4700,
    lon: 78.1300,
    riskScore: 3.2,
    riskLevel: 'LOW',
    population: 920,
    households: 210,
    elevation: '185 m',
    riverDistance: 'Krishna River (6.2 km)',
    rainfall1h: '14 mm',
    waterLevel: '2.1 m',
    soilMoisture: '42%',
    leadTime: '24+ hours',
    shelterName: 'Primary Health Center',
    shelterDistance: '0.9 km',
    shelterCapacity: 150,
  },
  {
    id: 'peddapalli',
    name: 'Peddapalli',
    mandal: 'Veligonda',
    lat: 16.4200,
    lon: 78.2100,
    riskScore: 2.8,
    riskLevel: 'LOW',
    population: 2680,
    households: 610,
    elevation: '172 m',
    riverDistance: 'Krishna River (5.5 km)',
    rainfall1h: '12 mm',
    waterLevel: '1.9 m',
    soilMoisture: '38%',
    leadTime: 'Safe',
    shelterName: 'Model School Hostel',
    shelterDistance: '1.2 km',
    shelterCapacity: 500,
  },
  {
    id: 'mannur',
    name: 'Mannur',
    mandal: 'Veligonda',
    lat: 16.5700,
    lon: 78.1200,
    riskScore: 3.5,
    riskLevel: 'LOW',
    population: 840,
    households: 190,
    elevation: '190 m',
    riverDistance: 'Ridge Sector (7.8 km)',
    rainfall1h: '16 mm',
    waterLevel: '1.8 m',
    soilMoisture: '40%',
    leadTime: 'Safe',
    shelterName: 'Community Center',
    shelterDistance: '0.8 km',
    shelterCapacity: 200,
  }
];

interface CommandCenterMapProps {
  selectedVillageId?: string;
  onSelectVillage?: (village: VillageData) => void;
}

export const CommandCenterMap: React.FC<CommandCenterMapProps> = ({
  selectedVillageId = 'rangapur',
  onSelectVillage
}) => {
  const [mapType, setMapType] = useState<'MAP' | 'SATELLITE'>('SATELLITE');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  const activeVillage = DEMO_VILLAGES.find(v => v.id === selectedVillageId) || DEMO_VILLAGES[0];

  useEffect(() => {
    // Dynamic Leaflet import
    let mapInstance: any = null;
    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      try {
        const L = (await import('leaflet')).default;

        // Ensure Leaflet CSS is present
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (!isMounted || !mapContainerRef.current) return;

        // Center on Rangapur / Krishna Basin
        const centerLat = 16.5050;
        const centerLon = 78.1850;

        mapInstance = L.map(mapContainerRef.current, {
          center: [centerLat, centerLon],
          zoom: 12,
          zoomControl: false,
          attributionControl: false,
        });

        leafletMapRef.current = mapInstance;

        // Base Tile Layer
        const tileUrl = mapType === 'SATELLITE'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        const baseLayer = L.tileLayer(tileUrl, {
          maxZoom: 18,
        }).addTo(mapInstance);

        // ── 1. MULTI-ZONE FLOOD RISK GRADIENT CONTOURS (Red, Orange, Yellow, Green) ──
        // Low Zone (Green outer)
        const greenZone = [
          [16.5900, 78.1100], [16.6000, 78.2300], [16.5400, 78.2800],
          [16.4500, 78.2600], [16.3900, 78.1800], [16.4200, 78.1000],
          [16.5000, 78.0800], [16.5900, 78.1100]
        ];
        L.polygon(greenZone as any, {
          color: '#22C55E',
          weight: 2,
          fillColor: '#22C55E',
          fillOpacity: 0.22,
          dashArray: '4, 4'
        }).addTo(mapInstance);

        // Moderate Zone (Yellow)
        const yellowZone = [
          [16.5650, 78.1350], [16.5700, 78.2250], [16.5250, 78.2500],
          [16.4650, 78.2350], [16.4350, 78.1750], [16.4550, 78.1250],
          [16.5100, 78.1150], [16.5650, 78.1350]
        ];
        L.polygon(yellowZone as any, {
          color: '#EAB308',
          weight: 2,
          fillColor: '#EAB308',
          fillOpacity: 0.35,
        }).addTo(mapInstance);

        // High Zone (Orange)
        const orangeZone = [
          [16.5450, 78.1500], [16.5500, 78.2100], [16.5100, 78.2250],
          [16.4750, 78.2100], [16.4600, 78.1700], [16.4800, 78.1400],
          [16.5450, 78.1500]
        ];
        L.polygon(orangeZone as any, {
          color: '#F97316',
          weight: 2.5,
          fillColor: '#F97316',
          fillOpacity: 0.48,
        }).addTo(mapInstance);

        // Critical Zone (Red - Center on river & Rangapur)
        const redZone = [
          [16.5350, 78.1650], [16.5380, 78.1950], [16.5150, 78.2050],
          [16.4950, 78.1900], [16.4850, 78.1700], [16.5050, 78.1550],
          [16.5350, 78.1650]
        ];
        L.polygon(redZone as any, {
          color: '#EF4444',
          weight: 3,
          fillColor: '#EF4444',
          fillOpacity: 0.60,
        }).addTo(mapInstance);

        // ── 2. RIVER / WATER BODY CHANNEL (Blue) ──
        const riverCoords = [
          [16.6000, 78.1400], [16.5700, 78.1600], [16.5400, 78.1750],
          [16.5200, 78.1800], [16.5000, 78.1950], [16.4800, 78.2100],
          [16.4500, 78.2300], [16.4200, 78.2450], [16.3900, 78.2700]
        ];
        // River glow & core
        L.polyline(riverCoords as any, {
          color: '#0284C7',
          weight: 12,
          opacity: 0.4,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(mapInstance);
        L.polyline(riverCoords as any, {
          color: '#38BDF8',
          weight: 5,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(mapInstance);

        // ── 3. EVACUATION ROUTE (Dashed Cyan) ──
        const evacRoute = [
          [16.5200, 78.1800], // Rangapur
          [16.5100, 78.1900],
          [16.5000, 78.2100],
          [16.4850, 78.2250],
          [16.4750, 78.2350]  // High School / Shelter
        ];
        L.polyline(evacRoute as any, {
          color: '#2563EB',
          weight: 4,
          dashArray: '6, 6',
          opacity: 0.9
        }).addTo(mapInstance);

        // ── 4. SENSOR MARKERS (Green antenna pins) ──
        const sensors = [
          { lat: 16.5550, lon: 78.2150, name: 'AWS Sensor 01' },
          { lat: 16.5350, lon: 78.1350, name: 'Soil Moisture 02' },
          { lat: 16.4950, lon: 78.2450, name: 'River Radar 03' },
        ];
        sensors.forEach(s => {
          const sensorIcon = L.divIcon({
            className: 'custom-sensor-icon',
            html: `
              <div class="relative flex items-center justify-center">
                <div class="w-6 h-6 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center animate-ping absolute"></div>
                <div class="w-5 h-5 rounded-full bg-emerald-600 border border-white flex items-center justify-center shadow-lg relative z-10">
                  <span class="text-white text-[9px] font-bold">📡</span>
                </div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          L.marker([s.lat, s.lon], { icon: sensorIcon }).addTo(mapInstance);
        });

        // ── 5. SAFE SHELTER MARKER ──
        const shelterIcon = L.divIcon({
          className: 'custom-shelter-icon',
          html: `
            <div class="flex items-center gap-1.5 bg-blue-600 border-2 border-white text-white px-2 py-1 rounded-full shadow-lg text-[10px] font-bold">
              <span>🏠</span>
              <span>Govt. School</span>
            </div>
          `,
          iconSize: [90, 24],
          iconAnchor: [45, 12],
        });
        L.marker([16.4750, 78.2350], { icon: shelterIcon }).addTo(mapInstance);

        // ── 6. VILLAGE MARKERS ──
        DEMO_VILLAGES.forEach(v => {
          const isSelected = v.id === selectedVillageId;
          const badgeBg = v.riskLevel === 'HIGH' ? '#EF4444' : v.riskLevel === 'MODERATE' ? '#F97316' : '#22C55E';

          const villageIcon = L.divIcon({
            className: 'custom-village-icon',
            html: `
              <div class="cursor-pointer transition-transform hover:scale-110 flex flex-col items-center">
                <div class="flex items-center gap-1 px-2.5 py-1 rounded-full text-white font-bold text-[11px] shadow-lg border-2 ${isSelected ? 'border-yellow-300 ring-4 ring-yellow-400/40' : 'border-white'}" style="background: ${badgeBg}">
                  ${v.riskLevel === 'HIGH' ? '⚠️' : '📍'}
                  <span>${v.name}</span>
                </div>
                ${isSelected ? '<div class="w-2 h-2 rotate-45 -mt-1 bg-red-600"></div>' : ''}
              </div>
            `,
            iconSize: [100, 32],
            iconAnchor: [50, 16],
          });

          const marker = L.marker([v.lat, v.lon], { icon: villageIcon }).addTo(mapInstance);
          marker.on('click', () => {
            onSelectVillage?.(v);
          });
        });

        setLeafletLoaded(true);
      } catch (err) {
        console.error('Leaflet load error:', err);
      }
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [mapType, selectedVillageId]);

  return (
    <div className="w-full h-full min-h-[460px] rounded-xl overflow-hidden relative border border-slate-200 shadow-sm bg-slate-900 select-none">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* TOP LEFT: Map / Satellite switcher */}
      <div className="absolute top-3 left-3 z-10 flex bg-white/95 backdrop-blur rounded-lg p-0.5 shadow-md border border-slate-200">
        <button
          onClick={() => setMapType('MAP')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
            mapType === 'MAP'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setMapType('SATELLITE')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
            mapType === 'SATELLITE'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Satellite
        </button>
      </div>

      {/* TOP RIGHT: Floating Flood Risk Level Legend */}
      <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-slate-200 text-xs w-44">
        <div className="font-bold text-slate-800 text-xs mb-2.5 pb-1 border-b border-slate-100">
          Flood Risk Level
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shrink-0"></span>
            <span className="text-slate-700 font-medium">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0"></span>
            <span className="text-slate-700 font-medium">High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400 shrink-0"></span>
            <span className="text-slate-700 font-medium">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="text-slate-700 font-medium">Low</span>
          </div>
        </div>

        <div className="border-t border-slate-100 my-2 pt-2 space-y-1.5 text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-blue-500 shrink-0"></span>
            <span>River / Water Body</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 border-b-2 border-dashed border-blue-500 shrink-0"></span>
            <span>Evacuation Route</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">📡</span>
            <span>Sensor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">🏠</span>
            <span>Safe Shelter</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-2.5 border border-dashed border-slate-400 rounded-sm shrink-0"></span>
            <span>Village Boundary</span>
          </div>
        </div>
      </div>

      {/* BOTTOM LEFT: Scale bar */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur rounded px-2 py-0.5 text-[10px] text-slate-700 font-mono shadow-sm flex items-center gap-2 border border-slate-200">
        <span className="border-l border-b border-r border-slate-800 h-1.5 w-12 inline-block"></span>
        <span>0  2  5 km</span>
      </div>

      {/* BOTTOM RIGHT: Zoom controls + Locate */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1">
        <button
          onClick={() => {
            if (leafletMapRef.current) leafletMapRef.current.zoomIn();
          }}
          className="w-8 h-8 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition active:scale-95"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (leafletMapRef.current) leafletMapRef.current.zoomOut();
          }}
          className="w-8 h-8 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition active:scale-95"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (leafletMapRef.current) leafletMapRef.current.setView([16.5200, 78.1800], 12);
          }}
          className="w-8 h-8 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition active:scale-95"
          title="Reset to Rangapur"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
