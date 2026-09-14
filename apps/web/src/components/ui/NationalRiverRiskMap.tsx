'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  NATIONAL_RIVER_POINTS,
  NATIONAL_RIVER_PATHS,
  RIVER_BASINS_META,
  RiverPoint,
  RiverBasinId,
} from '@/data/riverBasinsData';
import {
  Waves, ShieldAlert, Droplets, Activity,
  AlertTriangle, Filter,
  Compass,
  ZoomIn, ZoomOut, RotateCcw, ChevronDown, ChevronUp, X,
  MapPin, TrendingUp,
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

// ── Geo projection: convert real lat/lon → SVG coordinates ──
// India bounding box: lat 6.5°N–37.1°N, lon 68.1°E–97.4°E
// SVG canvas: 900×1000 (portrait)
const PROJECT_LAT_MIN = 6.0;
const PROJECT_LAT_MAX = 37.6;
const PROJECT_LON_MIN = 67.5;
const PROJECT_LON_MAX = 98.0;
const SVG_W = 900;
const SVG_H = 1000;

function geoToSvg(lat: number, lon: number): [number, number] {
  const x = ((lon - PROJECT_LON_MIN) / (PROJECT_LON_MAX - PROJECT_LON_MIN)) * SVG_W;
  const y = ((PROJECT_LAT_MAX - lat) / (PROJECT_LAT_MAX - PROJECT_LAT_MIN)) * SVG_H;
  return [Math.round(x), Math.round(y)];
}

// ── Risk color scale ──
const getRiskColor = (risk: number) => {
  if (risk >= 85) return '#ef4444'; // Red-500
  if (risk >= 75) return '#f97316'; // Orange-500
  if (risk >= 60) return '#eab308'; // Yellow-500
  return '#22c55e';                 // Green-500
};

const getRiskBg = (cat: string) => {
  switch (cat) {
    case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-200';
    case 'HIGH':     return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'MODERATE': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    default:         return 'bg-green-50 text-green-800 border-green-200';
  }
};

// ── Geographically accurate India outline (simplified polygon, ~90 points) ──
// Lat/Lon pairs traced from India's actual border, projected via geoToSvg
const INDIA_BORDER_LATLON: [number, number][] = [
  // Northwest - J&K, Pakistan border
  [36.5, 75.0],[37.0, 76.5],[36.8, 78.5],[35.5, 78.6],[35.2, 77.0],
  [34.5, 76.5],[34.0, 75.8],[33.8, 74.5],[33.2, 73.8],[32.5, 74.2],
  // Himachal, Punjab, Haryana
  [31.6, 75.0],[31.0, 74.4],[30.5, 73.9],[29.6, 73.5],
  // Rajasthan (Pakistan border)
  [28.5, 70.5],[27.5, 70.0],[26.5, 69.5],[25.5, 69.8],[24.0, 70.5],
  [23.5, 68.2],[23.0, 68.0],
  // Gujarat coast (Arabian Sea)
  [22.8, 68.5],[22.3, 69.5],[21.5, 70.5],[20.8, 71.0],
  [20.0, 73.0],[19.0, 72.8],[18.5, 73.0],[17.0, 73.5],
  // Goa, Karnataka coast
  [15.5, 74.0],[14.0, 74.5],[13.0, 74.8],[12.0, 75.2],
  // Kerala coast (south tip)
  [10.0, 76.2],[8.5, 77.0],[8.0, 77.5],[8.1, 78.0],
  // Tamil Nadu coast (Bay of Bengal)
  [8.5, 78.5],[9.5, 79.5],[10.8, 79.8],[11.5, 79.9],
  // Andhra coast
  [13.0, 80.2],[14.0, 80.5],[15.5, 80.5],[16.5, 81.0],
  [17.5, 82.3],[18.5, 83.5],[19.5, 84.8],[20.5, 86.5],
  // Odisha coast
  [21.5, 87.5],[22.0, 87.5],[22.5, 88.0],
  // West Bengal, Bangladesh border
  [22.8, 88.5],[23.0, 89.0],[23.5, 89.5],[24.0, 89.0],
  [24.5, 88.5],[25.5, 88.5],[26.0, 89.0],[26.5, 89.5],
  // Meghalaya, Assam, Bangladesh border
  [25.0, 90.0],[25.2, 91.5],[25.0, 92.0],[24.5, 92.5],
  // Mizoram, Tripura
  [23.5, 93.0],[23.0, 93.5],[22.5, 92.5],[23.0, 92.0],[22.5, 91.5],
  // Bangladesh border back to Assam
  [24.0, 91.0],[24.5, 90.5],[25.5, 89.5],[26.0, 90.0],
  // Assam, Arunachal border
  [27.0, 91.0],[27.5, 92.0],[28.0, 95.0],[28.5, 97.0],[28.0, 97.5],
  [27.5, 97.0],[27.0, 96.0],[26.5, 95.5],[27.0, 93.5],[26.5, 92.0],
  // Nagaland, Manipur, Myanmar border
  [26.0, 94.0],[25.5, 95.0],[24.5, 94.0],[24.0, 93.0],[23.0, 94.0],
  // Back north through Arunachal
  [26.0, 96.0],[27.0, 97.0],[28.0, 97.5],
  // Close back to J&K
  [33.0, 79.5],[34.5, 79.0],[35.5, 78.6],
];

const INDIA_PATH = (() => {
  const pts = INDIA_BORDER_LATLON.map(([lat, lon]) => geoToSvg(lat, lon));
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join(' ') + ' Z';
})();

// ── Key Indian cities as landmarks ──
const CITY_LANDMARKS: { name: string; lat: number; lon: number; capital?: boolean }[] = [
  { name: 'New Delhi', lat: 28.61, lon: 77.21, capital: true },
  { name: 'Mumbai',    lat: 19.08, lon: 72.88 },
  { name: 'Kolkata',   lat: 22.57, lon: 88.36 },
  { name: 'Chennai',   lat: 13.08, lon: 80.27 },
  { name: 'Bengaluru', lat: 12.97, lon: 77.59 },
  { name: 'Hyderabad', lat: 17.38, lon: 78.49 },
  { name: 'Patna',     lat: 25.61, lon: 85.14 },
  { name: 'Guwahati',  lat: 26.18, lon: 91.74 },
  { name: 'Bhubaneswar', lat: 20.30, lon: 85.82 },
  { name: 'Jaipur',    lat: 26.91, lon: 75.79 },
  { name: 'Ahmedabad', lat: 23.03, lon: 72.57 },
  { name: 'Lucknow',   lat: 26.85, lon: 80.94 },
  { name: 'Haridwar',  lat: 29.95, lon: 78.16 },
  { name: 'Varanasi',  lat: 25.32, lon: 83.00 },
];

// ── State label centroids ──
const STATE_LABELS: { name: string; lat: number; lon: number; abbr: string }[] = [
  { name: 'Rajasthan', abbr: 'RJ', lat: 27.0, lon: 73.0 },
  { name: 'Gujarat',   abbr: 'GJ', lat: 22.5, lon: 71.5 },
  { name: 'MP',        abbr: 'MP', lat: 23.5, lon: 78.5 },
  { name: 'UP',        abbr: 'UP', lat: 27.0, lon: 80.0 },
  { name: 'Bihar',     abbr: 'BR', lat: 25.5, lon: 85.5 },
  { name: 'WB',        abbr: 'WB', lat: 23.0, lon: 87.5 },
  { name: 'Odisha',    abbr: 'OD', lat: 20.5, lon: 84.5 },
  { name: 'Maharashtra', abbr: 'MH', lat: 19.5, lon: 76.0 },
  { name: 'AP',        abbr: 'AP', lat: 15.0, lon: 79.5 },
  { name: 'Telangana', abbr: 'TG', lat: 17.5, lon: 79.0 },
  { name: 'Karnataka', abbr: 'KA', lat: 14.5, lon: 76.0 },
  { name: 'Kerala',    abbr: 'KL', lat: 10.0, lon: 76.5 },
  { name: 'Tamil Nadu',abbr: 'TN', lat: 11.0, lon: 78.5 },
  { name: 'Assam',     abbr: 'AS', lat: 26.2, lon: 93.0 },
  { name: 'J&K',       abbr: 'JK', lat: 34.0, lon: 76.0 },
  { name: 'HP',        abbr: 'HP', lat: 31.5, lon: 77.5 },
  { name: 'Uttarakhand', abbr: 'UK', lat: 30.0, lon: 79.5 },
];

// ── Geographically accurate river paths (lat/lon control points) ──
// Each river path is a series of lat/lon waypoints
interface GeoRiverPath {
  id: string;
  name: string;
  basin: RiverBasinId;
  color: string;
  width: number;
  points: [number, number][];
}

const GEO_RIVER_PATHS: GeoRiverPath[] = [
  // GANGA SYSTEM
  {
    id: 'ganga-main',
    name: 'Ganga (Haridwar→Varanasi→Patna→Farakka)',
    basin: 'GANGA',
    color: '#06b6d4',
    width: 4,
    points: [
      [30.0, 78.2],  // Haridwar
      [29.9, 78.5],[29.5, 79.0],[28.8, 79.5],[27.8, 79.9],[27.0, 80.5],
      [26.5, 81.2],[26.0, 82.0],[25.6, 82.6],[25.3, 83.0], // Varanasi
      [25.0, 83.6],[25.3, 84.5],[25.6, 85.1],[25.6, 85.7],  // Patna
      [25.0, 87.0],[24.8, 87.9],[25.0, 88.0], // Farakka
    ],
  },
  {
    id: 'yamuna-main',
    name: 'Yamuna (Himalayas→Delhi→Agra→Allahabad)',
    basin: 'GANGA',
    color: '#0284c7',
    width: 3,
    points: [
      [31.0, 78.3],[30.5, 78.0],[29.9, 77.7],[28.7, 77.2],[28.0, 77.3],
      [27.2, 77.9],[26.5, 78.5],[25.5, 81.8],
    ],
  },
  {
    id: 'alaknanda',
    name: 'Alaknanda',
    basin: 'GANGA',
    color: '#22d3ee',
    width: 2,
    points: [[30.6, 79.6],[30.3, 79.0],[30.1, 78.7],[30.0, 78.2]],
  },
  {
    id: 'kosi',
    name: 'Kosi (Nepal→Bihar)',
    basin: 'GANGA',
    color: '#06b6d4',
    width: 2.5,
    points: [[27.5, 87.0],[27.0, 87.0],[26.5, 87.0],[25.8, 86.9]],
  },
  {
    id: 'gandak',
    name: 'Gandak (Nepal→Bihar)',
    basin: 'GANGA',
    color: '#06b6d4',
    width: 2,
    points: [[27.5, 84.0],[27.0, 84.0],[26.5, 84.5],[26.0, 85.0],[25.7, 85.2]],
  },
  // BRAHMAPUTRA
  {
    id: 'brahmaputra-main',
    name: 'Brahmaputra (Arunachal→Assam→Bangladesh)',
    basin: 'BRAHMAPUTRA',
    color: '#a855f7',
    width: 4.5,
    points: [
      [28.5, 96.0],[28.0, 95.0],[27.8, 94.0],[27.3, 93.0],
      [27.0, 92.0],[26.5, 91.5],[26.2, 91.7],[26.0, 91.0],
      [25.5, 90.0],[25.8, 89.5],[25.5, 89.0],
    ],
  },
  {
    id: 'teesta',
    name: 'Teesta (Sikkim→Bengal)',
    basin: 'BRAHMAPUTRA',
    color: '#c084fc',
    width: 2,
    points: [[27.5, 88.6],[27.0, 88.5],[26.5, 88.7],[25.0, 88.5],[24.0, 88.5]],
  },
  // INDUS SYSTEM
  {
    id: 'jhelum',
    name: 'Jhelum (J&K)',
    basin: 'INDUS',
    color: '#3b82f6',
    width: 2,
    points: [[34.5, 75.3],[34.0, 74.8],[33.5, 74.0],[32.5, 73.5]],
  },
  {
    id: 'satluj',
    name: 'Satluj (Himachal→Punjab)',
    basin: 'INDUS',
    color: '#60a5fa',
    width: 2,
    points: [[31.5, 77.5],[31.0, 76.8],[30.5, 76.0],[30.0, 75.5],[29.5, 74.5],[29.0, 73.5]],
  },
  // GODAVARI
  {
    id: 'godavari-main',
    name: 'Godavari (Nashik→Rajahmundry)',
    basin: 'GODAVARI',
    color: '#f59e0b',
    width: 3.5,
    points: [
      [20.0, 73.9],[20.0, 74.8],[19.5, 76.0],[19.0, 77.5],
      [18.5, 79.0],[18.0, 80.0],[17.5, 81.0],[17.0, 81.5],
      [16.9, 82.3], // Rajahmundry
    ],
  },
  {
    id: 'pranhita',
    name: 'Pranhita (Godavari tributary)',
    basin: 'GODAVARI',
    color: '#fbbf24',
    width: 2,
    points: [[20.0, 79.5],[19.5, 80.0],[18.5, 80.5],[18.0, 80.0]],
  },
  // KRISHNA
  {
    id: 'krishna-main',
    name: 'Krishna (Mahabaleshwar→Vijayawada)',
    basin: 'KRISHNA',
    color: '#ec4899',
    width: 3,
    points: [
      [17.9, 73.7],[17.5, 74.5],[17.0, 76.0],[16.5, 77.0],
      [16.0, 77.5],[16.2, 79.0],[16.5, 80.4],[16.5, 80.6], // Vijayawada
    ],
  },
  {
    id: 'tungabhadra',
    name: 'Tungabhadra',
    basin: 'KRISHNA',
    color: '#f472b6',
    width: 2,
    points: [[15.0, 75.5],[15.3, 76.3],[15.8, 77.0],[16.0, 77.5]],
  },
  // CAUVERY
  {
    id: 'cauvery-main',
    name: 'Cauvery (Coorg→Cauvery Delta)',
    basin: 'CAUVERY',
    color: '#10b981',
    width: 3,
    points: [
      [12.4, 75.7],[12.0, 76.0],[12.0, 77.0],[12.5, 78.0],
      [11.5, 79.0],[11.0, 79.5],[10.9, 79.8],
    ],
  },
  // NARMADA & TAPI
  {
    id: 'narmada',
    name: 'Narmada (Amarkantak→Gulf of Khambhat)',
    basin: 'NARMADA_TAPI',
    color: '#f97316',
    width: 3,
    points: [
      [22.7, 81.8],[22.5, 80.5],[22.3, 79.0],[22.5, 77.5],
      [22.5, 76.0],[22.3, 75.0],[22.0, 74.0],[21.9, 73.0],
      [21.8, 72.5],
    ],
  },
  {
    id: 'tapi',
    name: 'Tapi (Betul→Surat)',
    basin: 'NARMADA_TAPI',
    color: '#fb923c',
    width: 2,
    points: [[21.5, 78.0],[21.3, 77.0],[21.0, 75.5],[21.0, 74.0],[21.2, 72.9]],
  },
  // MAHANADI
  {
    id: 'mahanadi',
    name: 'Mahanadi (Chhattisgarh→Cuttack Delta)',
    basin: 'MAHANADI',
    color: '#e11d48',
    width: 3,
    points: [
      [21.5, 82.0],[21.0, 82.5],[20.5, 83.0],[20.3, 83.5],
      [20.5, 84.5],[20.5, 85.5],[20.5, 86.4],[20.5, 86.7],
    ],
  },
  // WESTERN COASTAL
  {
    id: 'periyar',
    name: 'Periyar (Kerala)',
    basin: 'WESTERN_COASTAL',
    color: '#6366f1',
    width: 2,
    points: [[10.3, 76.8],[10.2, 76.3],[10.0, 76.2]],
  },
  {
    id: 'pamba',
    name: 'Pamba (Kerala)',
    basin: 'WESTERN_COASTAL',
    color: '#818cf8',
    width: 2,
    points: [[9.5, 77.2],[9.2, 76.8],[9.0, 76.5]],
  },
];

// Convert geo river paths to SVG path strings
function buildSvgPath(points: [number, number][]): string {
  if (points.length < 2) return '';
  const svgPts = points.map(([lat, lon]) => geoToSvg(lat, lon));
  let d = `M ${svgPts[0][0]},${svgPts[0][1]}`;
  for (let i = 1; i < svgPts.length; i++) {
    const [x, y] = svgPts[i];
    const [px, py] = svgPts[i - 1];
    const cpx = (px + x) / 2;
    d += ` Q ${cpx},${py} ${x},${y}`;
  }
  return d;
}

// Recalculate svgX/svgY for all river points using real lat/lon
function getPointSvg(pt: RiverPoint): [number, number] {
  return geoToSvg(pt.lat, pt.lon);
}

export const NationalRiverRiskMap: React.FC<{
  onSelectRiverPoint?: (point: RiverPoint) => void;
  className?: string;
}> = ({ onSelectRiverPoint, className = '' }) => {
  const [selectedBasin, setSelectedBasin] = useState<RiverBasinId | 'ALL'>('ALL');
  const [minRiskFilter, setMinRiskFilter] = useState<number>(0);
  const [selectedPoint, setSelectedPoint] = useState<RiverPoint | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<RiverPoint | null>(null);
  const [viewMode, setViewMode] = useState<'MAP' | 'DIAGRAM' | 'ANALYTICS'>('MAP');
  const [statsExpanded, setStatsExpanded] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showCities, setShowCities] = useState<boolean>(true);
  const [showStates, setShowStates] = useState<boolean>(false);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<[number, number]>([0, 0]);
  const [panOffset, setPanOffset] = useState<[number, number]>([0, 0]);
  const [cardMinimized, setCardMinimized] = useState<boolean>(false);

  const filteredPoints = useMemo(() => {
    return NATIONAL_RIVER_POINTS.filter((p) => {
      const matchBasin = selectedBasin === 'ALL' || p.basin === selectedBasin;
      const matchRisk = p.riskPercentage >= minRiskFilter;
      return matchBasin && matchRisk;
    });
  }, [selectedBasin, minRiskFilter]);

  const nationalStats = useMemo(() => {
    const total = NATIONAL_RIVER_POINTS.length;
    const criticalCount = NATIONAL_RIVER_POINTS.filter((p) => p.riskCategory === 'CRITICAL').length;
    const highCount = NATIONAL_RIVER_POINTS.filter((p) => p.riskCategory === 'HIGH').length;
    const avgRisk = Math.round(
      NATIONAL_RIVER_POINTS.reduce((acc, curr) => acc + curr.riskPercentage, 0) / total
    );
    const maxDischargePoint = [...NATIONAL_RIVER_POINTS].sort((a, b) => b.dischargeCumecs - a.dischargeCumecs)[0];
    return { total, criticalCount, highCount, avgRisk, maxDischargePoint };
  }, []);

  const handlePointClick = (pt: RiverPoint) => {
    setSelectedPoint(pt);
    setCardMinimized(false);
    if (onSelectRiverPoint) onSelectRiverPoint(pt);
  };

  const handleBasinSelect = (bId: RiverBasinId | 'ALL') => {
    setSelectedBasin(bId);
    if (bId !== 'ALL') {
      const top = [...NATIONAL_RIVER_POINTS.filter((p) => p.basin === bId)]
        .sort((a, b) => b.riskPercentage - a.riskPercentage)[0];
      if (top) { setSelectedPoint(top); if (onSelectRiverPoint) onSelectRiverPoint(top); }
    }
  };

  const resetView = () => { setZoomLevel(1); setPanX(0); setPanY(0); setPanOffset([0, 0]); };

  // Mouse pan handling
  const onMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart([e.clientX, e.clientY]);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanOffset([e.clientX - panStart[0], e.clientY - panStart[1]]);
  };
  const onMouseUp = () => {
    if (!isPanning) return;
    setPanX((x) => x + panOffset[0]);
    setPanY((y) => y + panOffset[1]);
    setPanOffset([0, 0]);
    setIsPanning(false);
  };

  return (
    <div className={`flex flex-col bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-sm overflow-y-auto lg:overflow-hidden font-sans ${className}`}>

      {/* ── Header ── */}
      <div className="p-3 sm:p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                National River Flood Risk Map
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {NATIONAL_RIVER_POINTS.length} CWC gauge stations · 9 river basins · Real geo-projection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* View tabs */}
          <div className="flex items-center bg-slate-100 border border-slate-200 p-0.5 rounded-xl">
            {(['MAP', 'DIAGRAM', 'ANALYTICS'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition ${
                  viewMode === v ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {v === 'MAP' ? '🗺️ MAP' : v === 'DIAGRAM' ? '📊 CASCADE' : '📈 BASINS'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStatsExpanded(!statsExpanded)}
            className="sm:hidden px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 text-blue-700 flex items-center gap-0.5"
          >
            {statsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            KPI
          </button>
        </div>
      </div>

      {/* ── National Stats Ribbon ── */}
      <div className={`${statsExpanded ? 'grid' : 'hidden'} sm:grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 sm:p-3 bg-slate-50 border-b border-slate-200 text-xs font-mono`}>
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] text-slate-500 font-semibold">NATIONAL AVG RISK</div>
          <div className="text-xl font-black text-orange-600 mt-0.5">{nationalStats.avgRisk}%</div>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-red-200 shadow-sm">
          <div className="text-[10px] text-red-600 font-semibold">CRITICAL GAUGES</div>
          <div className="text-xl font-black text-red-600 mt-0.5">
            {nationalStats.criticalCount}
            <span className="text-xs font-normal text-slate-400"> / {nationalStats.total}</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-blue-200 shadow-sm">
          <div className="text-[10px] text-blue-600 font-semibold">PEAK DISCHARGE</div>
          <div className="text-sm font-bold text-slate-900 mt-0.5 truncate">{nationalStats.maxDischargePoint.river}</div>
          <div className="text-[10px] text-blue-600 font-bold">{nationalStats.maxDischargePoint.dischargeCumecs.toLocaleString()} m³/s</div>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[10px] text-slate-500 font-semibold">HIGH RISK GAUGES</div>
          <div className="text-xl font-black text-amber-600 mt-0.5">
            {nationalStats.highCount}
            <span className="text-xs font-normal text-slate-400"> stations</span>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="px-3 py-2 bg-white border-b border-slate-200 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0">
          <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3 h-3 text-blue-600" /> BASIN:
          </span>
          <button
            onClick={() => handleBasinSelect('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition ${
              selectedBasin === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            ALL ({NATIONAL_RIVER_POINTS.length})
          </button>
          {(Object.keys(RIVER_BASINS_META) as RiverBasinId[]).map((bId) => {
            const meta = RIVER_BASINS_META[bId];
            const pts = NATIONAL_RIVER_POINTS.filter((p) => p.basin === bId);
            return (
              <button
                key={bId}
                onClick={() => handleBasinSelect(bId)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 flex items-center gap-1.5 transition ${
                  selectedBasin === bId ? 'text-white shadow-sm' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs'
                }`}
                style={selectedBasin === bId ? { backgroundColor: meta.color } : {}}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                <span className="hidden md:inline">{meta.name}</span>
                <span className="md:hidden">{bId.split('_')[0]}</span>
                <span className="opacity-70">({pts.length})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="text-[11px] text-slate-500 font-semibold">RISK ≥</label>
          <select
            value={minRiskFilter}
            onChange={(e) => setMinRiskFilter(Number(e.target.value))}
            className="bg-white border border-slate-200 text-blue-700 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none cursor-pointer"
          >
            <option value={0}>All (0%+)</option>
            <option value={60}>Moderate+ (60%+)</option>
            <option value={75}>High+ (75%+)</option>
            <option value={85}>Critical (85%+)</option>
          </select>
        </div>
      </div>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">

        {/* MAP VIEW */}
        {viewMode === 'MAP' && (
          <div
            className="flex-1 relative min-h-[540px] lg:min-h-0 overflow-hidden select-none"
            style={{ cursor: isPanning ? 'grabbing' : 'grab', background: 'linear-gradient(160deg, #e0f2fe 0%, #bae6fd 40%, #dbeafe 100%)' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >

            {/* Map Controls — top right */}
            <div className="absolute top-2 right-2 z-20 flex flex-col gap-1.5">
              {/* Zoom controls */}
              <div className="bg-white/95 border border-slate-200 rounded-xl shadow-md p-1 flex flex-col gap-1">
                <button onClick={() => setZoomLevel((z) => Math.min(3, z + 0.3))}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600 transition" title="Zoom In">
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="h-px bg-slate-200" />
                <button onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.3))}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600 transition" title="Zoom Out">
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <div className="h-px bg-slate-200" />
                <button onClick={resetView}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition" title="Reset View">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Toggle controls */}
              <div className="bg-white/95 border border-slate-200 rounded-xl shadow-md p-1 flex flex-col gap-1 text-[9px] font-mono font-bold">
                <button
                  onClick={() => setShowLabels((v) => !v)}
                  className={`px-2 py-1 rounded-lg transition ${showLabels ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  🏷️ LABELS
                </button>
                <button
                  onClick={() => setShowCities((v) => !v)}
                  className={`px-2 py-1 rounded-lg transition ${showCities ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  🏙️ CITIES
                </button>
                <button
                  onClick={() => setShowStates((v) => !v)}
                  className={`px-2 py-1 rounded-lg transition ${showStates ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  📋 STATES
                </button>
              </div>
            </div>

            {/* Zoom level badge */}
            <div className="absolute bottom-14 right-2 z-10 bg-white/90 border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] font-mono text-slate-500">
              {Math.round(zoomLevel * 100)}%
            </div>

            {/* Selected gauge floating card */}
            {selectedPoint && !cardMinimized && (
              <div className="absolute top-2 left-2 z-20 w-[280px] sm:w-[320px] bg-white/97 border border-slate-200 rounded-2xl shadow-2xl backdrop-blur-sm text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 border-b border-slate-100 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold text-white"
                        style={{ backgroundColor: RIVER_BASINS_META[selectedPoint.basin]?.color }}>
                        {selectedPoint.basinName}
                      </span>
                      <span className="text-[10px] text-slate-500">{selectedPoint.state}</span>
                    </div>
                    <div className="font-black text-slate-900 text-[13px] mt-1 leading-tight truncate max-w-[200px]">
                      {selectedPoint.name}
                    </div>
                    <div className="text-[10px] text-blue-600 mt-0.5">{selectedPoint.river} · {selectedPoint.cwcStationCode}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border ${getRiskBg(selectedPoint.riskCategory)}`}>
                      {selectedPoint.riskPercentage}%
                    </span>
                    <button onClick={() => setCardMinimized(true)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setSelectedPoint(null)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {/* Risk bar */}
                  <div>
                    <div className="flex justify-between text-[9px] text-slate-500 mb-1">
                      <span>STAGE / DANGER RATIO</span>
                      <span className="font-bold" style={{ color: getRiskColor(selectedPoint.riskPercentage) }}>
                        {Math.round((selectedPoint.currentStageM / selectedPoint.dangerLevelM) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (selectedPoint.currentStageM / selectedPoint.dangerLevelM) * 100)}%`,
                          backgroundColor: getRiskColor(selectedPoint.riskPercentage),
                        }} />
                    </div>
                  </div>
                  {/* 3-stat grid */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="bg-slate-50 rounded-xl p-1.5 text-center border border-slate-100">
                      <div className="text-[8px] text-slate-500">STAGE</div>
                      <div className="text-sm font-black text-slate-900">{selectedPoint.currentStageM}m</div>
                      <div className="text-[8px] text-red-500">Dnger:{selectedPoint.dangerLevelM}m</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-1.5 text-center border border-slate-100">
                      <div className="text-[8px] text-slate-500">DISCHARGE</div>
                      <div className="text-sm font-black text-blue-700">{(selectedPoint.dischargeCumecs/1000).toFixed(1)}k</div>
                      <div className="text-[8px] text-slate-500">m³/s</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-1.5 text-center border border-slate-100">
                      <div className="text-[8px] text-slate-500">3H RAIN</div>
                      <div className="text-sm font-black text-emerald-700">{selectedPoint.rainfall3hMm}mm</div>
                      <div className="text-[8px] text-slate-500">{selectedPoint.trend.replace('_', ' ')}</div>
                    </div>
                  </div>
                  {/* Hazard */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 text-[10px] text-amber-900 leading-snug">
                    ⚠️ {selectedPoint.primaryHazard}
                  </div>
                </div>
              </div>
            )}

            {/* Minimized card pill */}
            {selectedPoint && cardMinimized && (
              <button
                onClick={() => setCardMinimized(false)}
                className="absolute top-2 left-2 z-20 flex items-center gap-2 px-3 py-1.5 bg-white/95 border border-blue-300 rounded-xl text-xs font-mono font-bold text-blue-700 shadow-md hover:bg-slate-50 transition"
              >
                <Waves className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>{selectedPoint.name.split(' at ')[0]} — {selectedPoint.riskPercentage}%</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}

            {/* ── SVG Map Canvas ── */}
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full h-full"
              style={{
                transform: `scale(${zoomLevel}) translate(${(panX + panOffset[0]) / zoomLevel}px, ${(panY + panOffset[1]) / zoomLevel}px)`,
                transformOrigin: 'center center',
                transition: isPanning ? 'none' : 'transform 0.2s ease',
              }}
            >
              <defs>
                {/* Ocean gradient */}
                <linearGradient id="ocean" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.6" />
                </linearGradient>

                {/* Land gradient — plains light, hills slightly shaded */}
                <linearGradient id="landFill" x1="0%" y1="0%" x2="60%" y2="100%">
                  <stop offset="0%" stopColor="#f1f5f9" />
                  <stop offset="40%" stopColor="#e7f0f7" />
                  <stop offset="100%" stopColor="#dde9f7" />
                </linearGradient>

                {/* River glow filter */}
                <filter id="riverGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>

                {/* Gauge dot glow */}
                <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>

                {/* Animated flow */}
                <style>{`
                  @keyframes flow { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
                  .river-flow { animation: flow 2.5s linear infinite; }
                  @keyframes pulse-ring { 0%,100% { r: 8; opacity: 0.8; } 50% { r: 13; opacity: 0.3; } }
                  .gauge-pulse { animation: pulse-ring 2s ease-in-out infinite; }
                `}</style>
              </defs>

              {/* Ocean backdrop */}
              <rect x="-50" y="-50" width={SVG_W + 100} height={SVG_H + 100} fill="url(#ocean)" />

              {/* Himalayan mountain backdrop (top strip) */}
              <path
                d="M 0,0 L 900,0 L 900,220 Q 750,180 600,195 Q 480,210 370,190 Q 250,175 150,200 Q 80,215 0,230 Z"
                fill="#e2e8f0"
                fillOpacity="0.35"
              />

              {/* Deccan Plateau (slightly warmer tone) */}
              <ellipse cx="490" cy="700" rx="240" ry="190" fill="#f59e0b" fillOpacity="0.05" />

              {/* India land mass */}
              <path
                d={INDIA_PATH}
                fill="url(#landFill)"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />

              {/* Northern border dashes (international) */}
              <path
                d="M 0,240 Q 150,200 370,190 Q 480,210 600,195 Q 750,180 900,220"
                fill="none"
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="8 4"
                opacity="0.5"
              />

              {/* Himalayan snow peaks label area */}
              <text x="310" y="165" textAnchor="middle" fill="#94a3b8" fontSize="11"
                fontFamily="sans-serif" opacity="0.7">▲ HIMALAYAS</text>
              <text x="670" y="175" textAnchor="middle" fill="#94a3b8" fontSize="9"
                fontFamily="sans-serif" opacity="0.6">▲ ARUNACHAL</text>

              {/* Ocean labels */}
              <text x="130" y="650" textAnchor="middle" fill="#60a5fa" fontSize="12"
                fontFamily="sans-serif" fontStyle="italic" opacity="0.6">Arabian Sea</text>
              <text x="730" y="700" textAnchor="middle" fill="#60a5fa" fontSize="12"
                fontFamily="sans-serif" fontStyle="italic" opacity="0.6">Bay of Bengal</text>
              <text x="430" y="990" textAnchor="middle" fill="#60a5fa" fontSize="11"
                fontFamily="sans-serif" fontStyle="italic" opacity="0.6">Indian Ocean</text>

              {/* State labels */}
              {showStates && STATE_LABELS.map((s) => {
                const [sx, sy] = geoToSvg(s.lat, s.lon);
                return (
                  <text key={s.abbr} x={sx} y={sy} textAnchor="middle" fill="#64748b"
                    fontSize="10" fontFamily="sans-serif" fontWeight="600" opacity="0.7">
                    {s.abbr}
                  </text>
                );
              })}

              {/* ── River paths (geo-projected) ── */}
              {GEO_RIVER_PATHS.map((rp) => {
                const isActive = selectedBasin === 'ALL' || rp.basin === selectedBasin;
                const svgPath = buildSvgPath(rp.points);
                if (!svgPath) return null;
                return (
                  <g key={rp.id} opacity={isActive ? 1 : 0.18}>
                    {/* Glow shadow */}
                    <path d={svgPath} fill="none" stroke={rp.color}
                      strokeWidth={rp.width * 3} strokeOpacity={0.15}
                      strokeLinecap="round" strokeLinejoin="round" />
                    {/* Main channel */}
                    <path d={svgPath} fill="none" stroke={rp.color}
                      strokeWidth={rp.width} strokeOpacity={isActive ? 0.9 : 0.4}
                      strokeLinecap="round" strokeLinejoin="round" />
                    {/* Animated white flow shimmer */}
                    <path d={svgPath} fill="none" stroke="#ffffff"
                      strokeWidth={rp.width * 0.5}
                      strokeDasharray="10 20"
                      strokeOpacity={isActive ? 0.7 : 0.2}
                      strokeLinecap="round"
                      className="river-flow" />
                  </g>
                );
              })}

              {/* ── City landmarks ── */}
              {showCities && CITY_LANDMARKS.map((city) => {
                const [cx, cy] = geoToSvg(city.lat, city.lon);
                return (
                  <g key={city.name}>
                    <circle cx={cx} cy={cy} r={city.capital ? 4.5 : 3}
                      fill={city.capital ? '#f59e0b' : '#94a3b8'}
                      stroke={city.capital ? '#d97706' : '#64748b'}
                      strokeWidth="1" />
                    <text x={cx + 6} y={cy + 3.5} fill={city.capital ? '#78350f' : '#475569'}
                      fontSize={city.capital ? '9' : '8'} fontFamily="sans-serif"
                      fontWeight={city.capital ? '700' : '500'}>
                      {city.name}
                    </text>
                  </g>
                );
              })}

              {/* ── Gauge station dots ── */}
              {filteredPoints.map((pt) => {
                const [px, py] = getPointSvg(pt);
                const isSelected = selectedPoint?.id === pt.id;
                const isHovered = hoveredPoint?.id === pt.id;
                const riskColor = getRiskColor(pt.riskPercentage);
                const dotR = isSelected ? 9 : isHovered ? 7.5 : pt.riskCategory === 'CRITICAL' ? 6.5 : 5.5;

                return (
                  <g key={pt.id}
                    className="cursor-pointer"
                    onClick={() => handlePointClick(pt)}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}>
                    <title>{`${pt.name} | ${pt.riskPercentage}% ${pt.riskCategory} | ${pt.river}`}</title>

                    {/* Pulse ring for CRITICAL */}
                    {pt.riskCategory === 'CRITICAL' && (
                      <circle cx={px} cy={py} r={dotR + 4} fill={riskColor}
                        fillOpacity="0.2" strokeOpacity="0" className="gauge-pulse" />
                    )}

                    {/* Selection ring */}
                    {isSelected && (
                      <circle cx={px} cy={py} r={dotR + 7} fill="none"
                        stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" opacity="0.9" />
                    )}

                    {/* Outer halo */}
                    <circle cx={px} cy={py} r={dotR}
                      fill={riskColor} fillOpacity="0.25"
                      stroke={riskColor} strokeWidth="1.5" />

                    {/* Inner core */}
                    <circle cx={px} cy={py} r={isSelected ? 5.5 : 3.5}
                      fill={isSelected ? '#0ea5e9' : '#ffffff'}
                      stroke={riskColor} strokeWidth="1.5" />

                    {/* Label shown on hover / selection / showLabels */}
                    {(isSelected || isHovered || showLabels) && (
                      <g transform={`translate(${px},${py})`} className="pointer-events-none">
                        <rect x="6" y="-9" width={Math.max(50, pt.river.length * 4.5)} height="16"
                          rx="4" fill="#0f172a" fillOpacity="0.88" />
                        <text x="10" y="2" fill="#ffffff" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">
                          {pt.river.split(' ')[0]} {pt.riskPercentage}%
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Hover callout */}
              {hoveredPoint && hoveredPoint.id !== selectedPoint?.id && (() => {
                const [hx, hy] = getPointSvg(hoveredPoint);
                return (
                  <g transform={`translate(${hx},${hy - 22})`} className="pointer-events-none">
                    <rect x="-65" y="-12" width="130" height="22" rx="5"
                      fill="#1e293b" fillOpacity="0.97"
                      stroke={getRiskColor(hoveredPoint.riskPercentage)} strokeWidth="1.2" />
                    <text x="0" y="4" textAnchor="middle" fill="#ffffff"
                      fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                      {hoveredPoint.name.split(' at ')[0].slice(0, 22)} · {hoveredPoint.riskPercentage}%
                    </text>
                    <polygon points="-3,10 3,10 0,14" fill="#1e293b"
                      stroke={getRiskColor(hoveredPoint.riskPercentage)} strokeWidth="1" />
                  </g>
                );
              })()}

            </svg>

            {/* ── Risk Legend ── */}
            <div className="absolute bottom-2 left-2 bg-white/95 border border-slate-200 rounded-2xl p-2.5 text-[10px] font-mono space-y-1.5 shadow-md hidden sm:block">
              <div className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">FLOOD RISK SCALE</div>
              {[
                { color: '#ef4444', label: '≥ 85%  CRITICAL', dotCls: '' },
                { color: '#f97316', label: '75–84%  HIGH', dotCls: '' },
                { color: '#eab308', label: '60–74%  MODERATE', dotCls: '' },
                { color: '#22c55e', label: '< 60%   SAFE', dotCls: '' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: color }} />
                  <span style={{ color }} className="font-bold">{label}</span>
                </div>
              ))}
              <div className="pt-1 border-t border-slate-100 text-[9px] text-slate-400">
                ● City  ● Gauge Station
              </div>
            </div>

            {/* Gauge count */}
            <div className="absolute bottom-2 right-2 bg-white/90 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[10px] font-mono text-slate-600">
              <span className="font-bold text-blue-700">{filteredPoints.length}</span> gauges shown
            </div>
          </div>
        )}

        {/* CASCADE DIAGRAM VIEW */}
        {viewMode === 'DIAGRAM' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50 space-y-4 min-h-[450px]">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <h3 className="text-sm font-bold text-blue-900 uppercase flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Upstream-to-Downstream Energy Cascade
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                India's flood process chain: from Himalayan cloudbursts & glacial outbursts → reservoir buffering → valley convergence → coastal delta tidal trap.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { stage: '1. MOUNTAIN HEADWATERS', icon: '🏔️', risk: '88–94%', color: 'border-red-200 bg-red-50',
                  location: 'Alaknanda (Joshimath) · Teesta (Sikkim) · Siang (Arunachal)',
                  desc: 'Steep orographic rainfall + glacial melt → high kinetic wave speed (>6 m/s). GLOF risk in June–Sep.' },
                { stage: '2. RESERVOIR / BARRAGE', icon: '🏗️', risk: '74–85%', color: 'border-orange-200 bg-orange-50',
                  location: 'Tehri Dam · Kosi Barrage · Hirakud · Sardar Sarovar',
                  desc: 'Dams buffer peak discharge. Surcharge beyond Full Reservoir Level triggers emergency spillway release, amplifying downstream flood.' },
                { stage: '3. MIDSTREAM VALLEY CONVERGENCE', icon: '🌊', risk: '79–89%', color: 'border-amber-200 bg-amber-50',
                  location: 'Haridwar · Delhi · Patna · Bhadrachalam · Sangli',
                  desc: 'Tributaries merge into mainstem. River cross-sections widen → rapid floodplain inundation affecting densely populated corridors.' },
                { stage: '4. COASTAL DELTA & TIDAL BACKWATER', icon: '🏝️', risk: '70–91%', color: 'border-blue-200 bg-blue-50',
                  location: 'Kolkata (Hooghly) · Rajahmundry · Cuttack · Aluva (Kochi)',
                  desc: 'High tide blocks river outflow → severe backwater stagnation → prolonged urban waterlogging. Cyclone synergy possible.' },
              ].map((s, idx) => (
                <div key={idx} className={`p-4 rounded-2xl bg-white border ${s.color.split(' ')[0]} shadow-sm flex items-start gap-4`}>
                  <div className={`text-2xl p-2.5 rounded-2xl border ${s.color}`}>{s.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">{s.stage}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                        Risk: {s.risk}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-blue-800 mt-1">{s.location}</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BASIN ANALYTICS VIEW */}
        {viewMode === 'ANALYTICS' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50 space-y-4 min-h-[450px]">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Basin Vulnerability Comparison
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {(Object.keys(RIVER_BASINS_META) as RiverBasinId[]).map((bId) => {
                const meta = RIVER_BASINS_META[bId];
                const pts = NATIONAL_RIVER_POINTS.filter((p) => p.basin === bId);
                const peakDis = Math.max(...pts.map((p) => p.dischargeCumecs));
                const critCount = pts.filter((p) => p.riskCategory === 'CRITICAL').length;
                return (
                  <button
                    key={bId}
                    onClick={() => { handleBasinSelect(bId); setViewMode('MAP'); }}
                    className="text-left p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition hover:border-blue-300 active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: meta.color }} />
                        <span className="text-xs font-black text-slate-900">{meta.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        meta.avgRisk >= 80 ? 'bg-red-50 text-red-700 border-red-200' :
                        meta.avgRisk >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {meta.avgRisk}% AVG
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full" style={{ width: `${meta.avgRisk}%`, backgroundColor: meta.color }} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>{pts.length} stations</span>
                      <span className="text-red-600 font-bold">{critCount} critical</span>
                      <span className="text-blue-600">{(peakDis / 1000).toFixed(1)}k m³/s</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">{meta.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Right Inspector Panel ── */}
        <div className="w-full lg:w-88 xl:w-96 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-4 flex flex-col overflow-y-auto shrink-0 space-y-3">
          {!selectedPoint ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-700">Select a Gauge Station</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-[180px] mx-auto leading-relaxed">
                  Tap any dot on the map to inspect live hydrological telemetry for that river station.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full text-[10px] font-mono">
                {[
                  { color: '#ef4444', bg: 'bg-red-50 border-red-200', label: 'CRITICAL', sub: '≥ 85% risk' },
                  { color: '#f97316', bg: 'bg-orange-50 border-orange-200', label: 'HIGH', sub: '75–84%' },
                  { color: '#eab308', bg: 'bg-yellow-50 border-yellow-200', label: 'MODERATE', sub: '60–74%' },
                  { color: '#22c55e', bg: 'bg-green-50 border-green-200', label: 'SAFE', sub: '< 60%' },
                ].map(({ color, bg, label, sub }) => (
                  <div key={label} className={`p-2 rounded-xl border ${bg} text-center`}>
                    <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1" style={{ backgroundColor: color }} />
                    <div className="font-bold" style={{ color }}>{label}</div>
                    <div className="text-slate-500">{sub}</div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-mono">{NATIONAL_RIVER_POINTS.length} CWC gauges across 9 basins</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Inspector header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wide">
                    {selectedPoint.basinName} · {selectedPoint.state}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5 leading-tight">{selectedPoint.name}</h3>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">{selectedPoint.cwcStationCode}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border block ${getRiskBg(selectedPoint.riskCategory)}`}>
                    {selectedPoint.riskPercentage}% RISK
                  </span>
                  <span className="text-[9px] font-mono text-red-600 font-bold mt-1 block">
                    {selectedPoint.trend.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Stage & Discharge */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-[10px] text-slate-500 font-semibold">WATER STAGE</div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">{selectedPoint.currentStageM} <span className="text-xs font-normal text-slate-400">m</span></div>
                  <div className="text-[10px] text-red-500 font-bold">Danger: {selectedPoint.dangerLevelM}m</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-sm">
                  <div className="text-[10px] text-blue-600 font-semibold">DISCHARGE</div>
                  <div className="text-xl font-black text-blue-700 mt-0.5">{selectedPoint.dischargeCumecs.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">m³/s (cumecs)</div>
                </div>
              </div>

              {/* Stage bar */}
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 text-xs font-mono">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-semibold">STAGE TO DANGER</span>
                  <span className="font-bold" style={{ color: getRiskColor(selectedPoint.riskPercentage) }}>
                    {Math.round((selectedPoint.currentStageM / selectedPoint.dangerLevelM) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (selectedPoint.currentStageM / selectedPoint.dangerLevelM) * 100)}%`,
                      backgroundColor: getRiskColor(selectedPoint.riskPercentage),
                    }} />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>Warning: {selectedPoint.warningLevelM}m</span>
                  <span>Danger: {selectedPoint.dangerLevelM}m</span>
                  <span>HFL: {selectedPoint.hflLevelM}m</span>
                </div>
              </div>

              {/* Rainfall & velocity */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-sm text-center">
                  <div className="text-[10px] text-emerald-600 font-semibold">3HR RAINFALL</div>
                  <div className="text-lg font-black text-emerald-700">{selectedPoint.rainfall3hMm}<span className="text-xs font-normal text-slate-400"> mm</span></div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
                  <div className="text-[10px] text-slate-500 font-semibold">FLOW VELOCITY</div>
                  <div className="text-lg font-black text-slate-700">{selectedPoint.flowVelocityMs}<span className="text-xs font-normal text-slate-400"> m/s</span></div>
                </div>
              </div>

              {/* Hazard */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm space-y-1">
                <div className="text-[10px] font-mono font-bold text-amber-700 uppercase flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> HYDROLOGICAL THREAT
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{selectedPoint.primaryHazard}</p>
              </div>

              {/* Cascade links */}
              {(selectedPoint.upstreamNodeId || selectedPoint.downstreamNodeId) && (
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs font-mono space-y-1.5">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">CASCADE LINKAGES</div>
                  {selectedPoint.upstreamNodeId && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">↑ Upstream:</span>
                      <span className="text-blue-600 font-bold">{selectedPoint.upstreamNodeId}</span>
                    </div>
                  )}
                  {selectedPoint.downstreamNodeId && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">↓ Downstream:</span>
                      <span className="text-emerald-600 font-bold">{selectedPoint.downstreamNodeId}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Dam info */}
              {selectedPoint.damControlled && selectedPoint.damName && (
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[10px] font-mono">
                  <span className="text-blue-600 font-bold">🏗️ DAM CONTROLLED: </span>
                  <span className="text-slate-700">{selectedPoint.damName}</span>
                </div>
              )}

              {/* Action link */}
              <Link
                href="/safety"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
              >
                <Compass className="w-4 h-4" />
                EVACUATION GUIDE — {selectedPoint.state.toUpperCase()}
              </Link>

              {/* Other stations in basin */}
              <div className="pt-1 border-t border-slate-200">
                <div className="text-[10px] text-slate-400 font-mono font-bold mb-1.5 uppercase">
                  Other Stations in {selectedPoint.basinName}:
                </div>
                <div className="flex flex-wrap gap-1">
                  {NATIONAL_RIVER_POINTS.filter((p) => p.basin === selectedPoint.basin).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handlePointClick(p)}
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold transition ${
                        selectedPoint.id === p.id
                          ? 'text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                      style={selectedPoint.id === p.id ? { backgroundColor: RIVER_BASINS_META[p.basin]?.color } : {}}
                    >
                      {p.river.split(' ')[0]} {p.riskPercentage}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NationalRiverRiskMap;
