import { RiverBasinId, RiverPoint } from './riverBasinsData';

// ── Geo projection: convert real lat/lon → SVG coordinates ──
// India bounding box: lat 6.5°N–37.1°N, lon 68.1°E–97.4°E
// SVG canvas: 900×1000 (portrait)
export const PROJECT_LAT_MIN = 6.0;
export const PROJECT_LAT_MAX = 37.6;
export const PROJECT_LON_MIN = 67.5;
export const PROJECT_LON_MAX = 98.0;
export const SVG_W = 900;
export const SVG_H = 1000;

export function geoToSvg(lat: number, lon: number): [number, number] {
  const x = ((lon - PROJECT_LON_MIN) / (PROJECT_LON_MAX - PROJECT_LON_MIN)) * SVG_W;
  const y = ((PROJECT_LAT_MAX - lat) / (PROJECT_LAT_MAX - PROJECT_LAT_MIN)) * SVG_H;
  return [Math.round(x), Math.round(y)];
}

// ── Risk color scale ──
export const getRiskColor = (risk: number) => {
  if (risk >= 85) return '#ef4444'; // Red-500
  if (risk >= 75) return '#f97316'; // Orange-500
  if (risk >= 60) return '#eab308'; // Yellow-500
  return '#22c55e';                 // Green-500
};

export const getRiskBg = (cat: string) => {
  switch (cat) {
    case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-200';
    case 'HIGH':     return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'MODERATE': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    default:         return 'bg-green-50 text-green-800 border-green-200';
  }
};

// ── Geographically accurate India outline (simplified polygon, ~90 points) ──
// Lat/Lon pairs traced from India's actual border, projected via geoToSvg
export const INDIA_BORDER_LATLON: [number, number][] = [
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

export const INDIA_PATH = (() => {
  const pts = INDIA_BORDER_LATLON.map(([lat, lon]) => geoToSvg(lat, lon));
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join(' ') + ' Z';
})();

// ── Key Indian cities as landmarks ──
export const CITY_LANDMARKS: { name: string; lat: number; lon: number; capital?: boolean }[] = [
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
export const STATE_LABELS: { name: string; lat: number; lon: number; abbr: string }[] = [
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
export interface GeoRiverPath {
  id: string;
  name: string;
  basin: RiverBasinId;
  color: string;
  width: number;
  points: [number, number][];
}

export const GEO_RIVER_PATHS: GeoRiverPath[] = [
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
export function buildSvgPath(points: [number, number][]): string {
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
export function getPointSvg(pt: RiverPoint): [number, number] {
  return geoToSvg(pt.lat, pt.lon);
}

