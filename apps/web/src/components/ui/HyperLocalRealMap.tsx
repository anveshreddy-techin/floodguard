'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  LocationDossier, 
  LOCATIONS 
} from '@/data/locations';
import { 
  Layers, 
  Eye, 
  Compass, 
  Waves, 
  CloudRain, 
  Mountain, 
  ShieldAlert, 
  Radio, 
  Maximize2, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  Navigation,
  Sparkles,
  MapPin,
  Flame,
  Volume2,
  Droplets,
  RotateCcw
} from 'lucide-react';
import { RiskBadge } from '@/components/ui/Badges';
import {
  getRealRiverWaterways,
  getFloodRiskPolygons,
  evaluateCandidateShelters,
  getEvacuationRoute,
  calculateSegmentBearing,
  type WaterwayFeature,
  type CandidateShelter,
} from '@/services/gisService';

export type BaseMapTileType = 'SATELLITE' | 'TOPO' | 'DARK' | 'STREET';

export interface GisLayerVisibility {
  floodZone: boolean;
  evacuationRoute: boolean;
  sensors: boolean;
  slopeHazards: boolean;
  isochrones: boolean;
  riverVector: boolean;
}

interface HyperLocalRealMapProps {
  location?: LocationDossier;
  selectedNodeId?: string;
  onSelectNode?: (node: any) => void;
  activeLayerFilter?: string;
  gisLang?: 'en' | 'hi';
  className?: string;
  showControlBar?: boolean;
}

export const HyperLocalRealMap: React.FC<HyperLocalRealMapProps> = ({
  location = LOCATIONS[0],
  selectedNodeId,
  onSelectNode,
  activeLayerFilter,
  gisLang = 'en',
  className = '',
  showControlBar = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const labelLayerRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  const [activeBaseMap, setActiveBaseMap] = useState<BaseMapTileType>('SATELLITE');
  const [layers, setLayers] = useState<GisLayerVisibility>({
    floodZone: true,
    evacuationRoute: true,
    sensors: true,
    slopeHazards: true,
    isochrones: true,
    riverVector: true,
  });

  const [mapReady, setMapReady] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [hudExpanded, setHudExpanded] = useState(true);

  // Async OSM waterway fetch state (pre-packaged for Chamoli/Guwahati/Kedarnath/Kullu, live Overpass for others)
  const [osmWaterways, setOsmWaterways] = useState<WaterwayFeature[]>([]);
  useEffect(() => {
    getRealRiverWaterways(location.id, location.lat, location.lon).then(setOsmWaterways);
  }, [location.id, location.lat, location.lon]);

  // Location-specific ground-truth flags
  const isRaini = location.id === 'loc-uk-chamoli' || location.name.toLowerCase().includes('raini');
  const isKedarnath = location.id === 'loc-uk-kedarnath' || location.name.toLowerCase().includes('kedarnath');
  const isKullu = location.id === 'loc-hp-kullu' || location.name.toLowerCase().includes('kullu');
  const isGuwahati = location.id === 'loc-as-guwahati' || location.name.toLowerCase().includes('guwahati');
  const isTeesta = location.id === 'loc-sk-teesta' || location.name.toLowerCase().includes('teesta');

  // Compute hyper-local coordinates relative to village center

  const spatialEntities = useMemo(() => {
    const lat = location.lat;
    const lon = location.lon;
    const baseEle = parseInt(location.elevation.replace(/[^0-9]/g, '')) || 1200;
    const isHigh = location.riskLevel === 'HIGH' || location.riskLevel === 'EXTREME';
    const isExtreme = location.riskLevel === 'EXTREME';

    // 1. Village / Settlement Center
    const village = {
      id: location.id,
      name: location.name,
      type: 'VILLAGE',
      category: 'HUMAN_SETTLEMENT',
      lat,
      lon,
      elevation: location.elevation,
      population: location.population,
      riskLevel: location.riskLevel,
      riskScore: location.riskScore,
      leadTimeMinutes: location.leadTimeMinutes,
      status: isExtreme ? 'CRITICAL EVACUATION' : isHigh ? 'HIGH FLASH THREAT' : 'NORMAL MONITORING',
      desc: gisLang === 'hi'
        ? `${location.name} - मुख्य आबादी क्षेत्र। ${location.region} में स्थित।`
        : `Primary population and infrastructure cluster in ${location.region}. Directly exposed to low-lying drainage surge.`,
      action: isHigh
        ? (gisLang === 'hi' ? 'तुरंत ऊंचाई वाले आश्रय की ओर निकलें।' : 'Prepare immediate evacuation to higher ground shelter.')
        : (gisLang === 'hi' ? 'स्थिति सामान्य है, चेतावनी पर नजर रखें।' : 'Conditions normal. Monitor weather bulletins.'),
    };

    // ── LOCATION-SPECIFIC REAL RIVER & TOPOGRAPHIC ASSET VECTORS ──
    // Coordinates use verified real-world satellite ground-truth coordinates

    let riverVector: [number, number][];
    let tributaryVector: [number, number][] | undefined = undefined;
    let floodPolygon: [number, number][];
    let primaryShelterCoords: [number, number];
    let secondaryShelterCoords: [number, number];
    let radarGaugeCoords: [number, number];
    let awsStationCoords: [number, number];
    let soilSensorCoords: [number, number];
    let geophoneCoords: [number, number];
    let evacuationTrail: [number, number][];
    let blockedTrail: [number, number][];
    let slopeHazardPolygon: [number, number][] = [];

    if (isRaini) {
      // ── RAINI VILLAGE / DHAULIGANGA & RISHIGANGA CONFLUENCE ──
      // River traced precisely along the white rocky gorge centerline visible in Google Earth satellite.
      // Dhauliganga flows East→West through the canyon. The gorge is a deep V-shaped ravine ~300-400m deep.
      riverVector = [
        [30.4869, 79.7300],
        [30.4867, 79.7260],
        [30.4863, 79.7220],
        [30.4860, 79.7180],
        [30.4857, 79.7140],
        [30.4853, 79.7100],
        [30.4851, 79.7060],
        [30.4849, 79.7020],
        [30.4848, 79.6980],
        [30.4847, 79.6945], // Approaching Raini bridge confluence
        [30.4847, 79.6928], // Raini bridge — Rishiganga confluence
        [30.4846, 79.6900],
        [30.4843, 79.6860],
        [30.4841, 79.6820],
        [30.4839, 79.6780],
        [30.4840, 79.6740],
        [30.4843, 79.6700],
        [30.4847, 79.6660],
        [30.4850, 79.6620],
        [30.4851, 79.6580],
        [30.4850, 79.6540],
        [30.4848, 79.6500],
        [30.4850, 79.6460],
        [30.4855, 79.6420],
        [30.4862, 79.6380],
        [30.4871, 79.6340],
        [30.4873, 79.6300], // Tapovan direction
      ];

      // Rishiganga tributary — traced along the actual gorge from Theng/Raini Chak confluence
      tributaryVector = [
        [30.4678, 79.7212], // Theng village (glacial source valley)
        [30.4700, 79.7175],
        [30.4722, 79.7148],
        [30.4743, 79.7115], // Paing village
        [30.4762, 79.7085],
        [30.4780, 79.7055],
        [30.4800, 79.7025],
        [30.4818, 79.6998],
        [30.4832, 79.6970], // Raini Chak Lata gorge floor
        [30.4840, 79.6952],
        [30.4847, 79.6928], // Confluence with Dhauliganga at Raini Bridge
      ];

      // ── 3-ZONE FLOOD RISK POLYGONS ──
      // Zone 1 (RED): Active gorge-floor inundation — certain death zone during surge
      // Zone 2 (ORANGE): High-velocity surge reach buffer — extreme danger
      // Zone 3 (YELLOW): Potential splash/debris zone — caution, evacuate
      // Zones are stored as separate entries, rendered in the useEffect below
      floodPolygon = [
        // Dhauliganga North Canyon Wall (West to East) — ZONE 1 RED inner gorge
        [30.4876, 79.6300],
        [30.4864, 79.6370],
        [30.4854, 79.6450],
        [30.4859, 79.6530],
        [30.4856, 79.6610],
        [30.4849, 79.6690],
        [30.4844, 79.6760],
        [30.4846, 79.6830],
        [30.4849, 79.6890],
        [30.4851, 79.6928],
        [30.4852, 79.6950],
        [30.4854, 79.7000],
        [30.4858, 79.7060],
        [30.4862, 79.7120],
        [30.4866, 79.7180],
        [30.4872, 79.7240],
        [30.4874, 79.7300],
        [30.4866, 79.7300],
        [30.4864, 79.7240],
        [30.4858, 79.7180],
        [30.4854, 79.7120],
        [30.4850, 79.7000],
        [30.4846, 79.6950],
        [30.4843, 79.6932],
        [30.4826, 79.6970],
        [30.4801, 79.7015],
        [30.4771, 79.7060],
        [30.4736, 79.7115],
        [30.4706, 79.7165],
        [30.4676, 79.7215],
        [30.4684, 79.7205],
        [30.4714, 79.7155],
        [30.4744, 79.7105],
        [30.4779, 79.7050],
        [30.4809, 79.7005],
        [30.4834, 79.6960],
        [30.4843, 79.6924],
        [30.4841, 79.6890],
        [30.4838, 79.6830],
        [30.4836, 79.6760],
        [30.4841, 79.6690],
        [30.4848, 79.6610],
        [30.4851, 79.6530],
        [30.4846, 79.6450],
        [30.4856, 79.6370],
        [30.4868, 79.6300],
      ];

      // PRIMARY SHELTER: Lata Village flat terrace (+340m above gorge, 2,380m ASL)
      // Lata Village is a FLAT BENCH terrace — clearly visible in satellite as a level
      // settlement platform with buildings, school, water tank, motor road access.
      // This is NOT a slope — it is an established mountain village on a flat terrace spur.
      primaryShelterCoords = [30.5012, 79.7055];
      // Secondary: Forest Rest House upper spur (flat cleared area above Raini, +180m)
      secondaryShelterCoords = [30.4920, 79.6895];

      radarGaugeCoords = [30.4848, 79.6932]; // Real Raini Confluence Bridge gauge
      awsStationCoords = [30.5005, 79.7030]; // Lata Village plateau AWS
      soilSensorCoords = [30.4895, 79.6950]; // Colluvial mid-slope sensor
      geophoneCoords = [30.4762, 79.7080];   // Upstream Rishiganga gorge seismophone

      // Evacuation trail: switchback path climbing from gorge floor to Lata flat terrace
      evacuationTrail = [
        [30.4850, 79.6920], // Raini Village center (2,040m ASL — gorge floor)
        [30.4872, 79.6942], // Footpath entry point — begin climbing
        [30.4900, 79.6965], // Switchback 1 (+120m · 2,160m ASL)
        [30.4930, 79.6990], // Switchback 2 (+220m · 2,260m ASL)
        [30.4965, 79.7015], // Devaangan spur junction (+300m · 2,340m ASL)
        [30.5000, 79.7040], // Motor road to Lata Village
        [30.5012, 79.7055], // Lata Village flat terrace (2,380m ASL · +340m gain)
      ];

      // Blocked: low riverbed causeway — submerged during surge
      blockedTrail = [
        [30.4850, 79.6920],
        [30.4847, 79.6928],
      ];

      // Steep slope hazard zone (colluvial debris on mid-slope)
      slopeHazardPolygon = [
        [30.4885, 79.6900],
        [30.4920, 79.6950],
        [30.4905, 79.6990],
        [30.4870, 79.6940],
      ];
    } else if (isKedarnath) {
      // ── KEDARNATH / MANDAKINI GLACIATED GORGE ──
      // Flows North (Chorabari moraine) to South past Kedarnath Temple
      riverVector = [
        [30.7480, 79.0620],
        [30.7410, 79.0645],
        [30.7350, 79.0670],
        [30.7250, 79.0700],
        [30.7100, 79.0750],
        [30.6950, 79.0800],
      ];

      floodPolygon = [
        [30.7490, 79.0600],
        [30.7420, 79.0625],
        [30.7360, 79.0645],
        [30.7260, 79.0675],
        [30.7110, 79.0725],
        [30.6960, 79.0775],
        [30.6940, 79.0825],
        [30.7090, 79.0775],
        [30.7240, 79.0725],
        [30.7340, 79.0695],
        [30.7400, 79.0665],
        [30.7470, 79.0640],
      ];

      primaryShelterCoords = [30.7380, 79.0720];
      secondaryShelterCoords = [30.7320, 79.0640];
      radarGaugeCoords = [30.7340, 79.0675];
      awsStationCoords = [30.7420, 79.0710];
      soilSensorCoords = [30.7360, 79.0690];
      geophoneCoords = [30.7450, 79.0640];

      evacuationTrail = [
        [30.7346, 79.0669],
        [30.7360, 79.0690],
        [30.7380, 79.0720],
      ];
      blockedTrail = [
        [30.7346, 79.0669],
        [30.7335, 79.0675],
      ];
      slopeHazardPolygon = [
        [30.7400, 79.0610],
        [30.7450, 79.0630],
        [30.7420, 79.0670],
        [30.7380, 79.0640],
      ];
    } else if (isKullu) {
      // ── KULLU VALLEY / BEAS RIVER ──
      // Flows North to South along the Himalayan valley
      riverVector = [
        [31.9850, 77.1280],
        [31.9700, 77.1180],
        [31.9550, 77.1080],
        [31.9380, 77.0980],
        [31.9200, 77.0900],
      ];

      floodPolygon = [
        [31.9860, 77.1250],
        [31.9710, 77.1150],
        [31.9560, 77.1050],
        [31.9390, 77.0950],
        [31.9210, 77.0870],
        [31.9190, 77.0930],
        [31.9370, 77.1010],
        [31.9540, 77.1110],
        [31.9690, 77.1210],
        [31.9840, 77.1310],
      ];

      primaryShelterCoords = [lat + 0.007, lon + 0.008];
      secondaryShelterCoords = [lat + 0.009, lon - 0.007];
      radarGaugeCoords = [lat - 0.003, lon - 0.0015];
      awsStationCoords = [lat + 0.012, lon - 0.006];
      soilSensorCoords = [lat + 0.005, lon + 0.005];
      geophoneCoords = [lat + 0.015, lon + 0.009];

      evacuationTrail = [
        [lat, lon],
        [lat + 0.003, lon + 0.004],
        [primaryShelterCoords[0], primaryShelterCoords[1]],
      ];
      blockedTrail = [
        [lat, lon],
        [lat - 0.002, lon - 0.001],
      ];
    } else if (isGuwahati) {
      // ── GUWAHATI / BRAHMAPUTRA RIVER & BHARALU CONFLUENCE (ASSAM) ──
      // Brahmaputra flows East to West through the valley past Uzan Bazar, Fancy Bazar, Bharalumukh, Pandu
      riverVector = [
        [26.1950, 91.8200],
        [26.1920, 91.7850],
        [26.1880, 91.7600],
        [26.1820, 91.7400],
        [26.1750, 91.7150], // Confluence with Bharalu river & sluice gate
        [26.1620, 91.6850], // Pandu Port
        [26.1550, 91.6600], // Saraighat Bridge
      ];

      // Bharalu River Tributary (urban stormwater backflow channel during Brahmaputra surge)
      tributaryVector = [
        [26.1250, 91.7750], // Basistha / Beltola headwaters
        [26.1400, 91.7600], // Dispur / Downtown
        [26.1550, 91.7400], // Anil Nagar / Hatigaon lowlands
        [26.1680, 91.7280], // Bharalumukh Sluice Gate
        [26.1750, 91.7150], // Confluence with Brahmaputra
      ];

      // 100-Year Flood Envelope: Active alluvial inundation along riverfront & Bharalu backflow
      floodPolygon = [
        [26.1950, 91.8200], [26.1920, 91.7850], [26.1880, 91.7600],
        [26.1820, 91.7400], [26.1750, 91.7150], [26.1620, 91.6850],
        [26.1550, 91.6600], [26.1480, 91.6600], [26.1550, 91.6850],
        [26.1680, 91.7150], [26.1750, 91.7400], [26.1810, 91.7600],
        [26.1850, 91.7850], [26.1880, 91.8200],
      ];

      // Primary Shelter: Kamakhya Nilachal Hilltop Refuge (215m ASL, +160m above river)
      primaryShelterCoords = [26.1660, 91.7055];
      // Secondary Shelter: Sarania Hill High Ground Relief Center (140m ASL, +85m)
      secondaryShelterCoords = [26.1780, 91.7650];

      radarGaugeCoords = [26.1750, 91.7150]; // Bharalumukh CWC gauge
      awsStationCoords = [26.1660, 91.7055]; // Kamakhya Hilltop AWS
      soilSensorCoords = [26.1400, 91.7450]; // Urban lowland probe
      geophoneCoords = [26.1550, 91.6600];   // Saraighat scour sensor

      // Safe Route: Climbing uphill along Kamakhya Access Road away from riverfront
      evacuationTrail = [
        [26.1550, 91.7300],
        [26.1580, 91.7220],
        [26.1620, 91.7140],
        [26.1660, 91.7055],
      ];

      // Blocked Route: Low-lying MG Road riverfront boulevard (submerged)
      blockedTrail = [
        [26.1550, 91.7300],
        [26.1700, 91.7350],
        [26.1750, 91.7400],
      ];

      slopeHazardPolygon = [
        [26.1600, 91.7000],
        [26.1630, 91.7100],
        [26.1610, 91.7150],
        [26.1580, 91.7050],
      ];
    } else {
      // ── GENERIC LOCATION: USE GIS SERVICE FOR REAL CLOSED POLYGON ZONES ──
      // riverVector: will be overridden in useEffect by real OSM data from osmWaterways.
      // We use a placeholder here aligned to the location; the actual render useEffect
      // uses osmWaterways directly when available.
      riverVector = [
        [lat + 0.014, lon - 0.010],
        [lat + 0.008, lon - 0.005],
        [lat + 0.002, lon - 0.001],
        [lat - 0.004, lon + 0.003],
        [lat - 0.010, lon + 0.008],
        [lat - 0.016, lon + 0.014],
      ];

      // Flood zones: algorithmically constructed CLOSED envelopes (NOT parallel strips).
      // getFloodRiskPolygons() builds proper 2D area polygons expanding from the river centerline.
      const gisZones = getFloodRiskPolygons(location.id, lat, lon, riverVector);
      floodPolygon = gisZones.zone1Red; // legacy field (used for backward compat); 3-zone render done in useEffect

      // Shelter: elevated positions with GIS safety evaluation gate
      // Candidate shelters on ridges/hills ~500-900m from centre
      const candidates: CandidateShelter[] = [
        {
          id: `shelter-primary-${location.id}`,
          name: `${location.name.split('/')[0].trim()} Designated Assembly Shelter (+150m)`,
          coords: [lat + 0.006, lon + 0.007],
          elevationM: (parseInt(location.elevation.replace(/[^0-9]/g, '')) || 1200) + 150,
          capacity: 400,
          type: 'DESIGNATED_ASSEMBLY',
        },
        {
          id: `shelter-secondary-${location.id}`,
          name: `${location.region.split('(')[0].trim()} Panchayat Bhavan (+85m)`,
          coords: [lat + 0.008, lon - 0.006],
          elevationM: (parseInt(location.elevation.replace(/[^0-9]/g, '')) || 1200) + 85,
          capacity: 200,
          type: 'SECONDARY',
        },
      ];
      const evaluated = evaluateCandidateShelters(candidates, gisZones, parseInt(location.elevation.replace(/[^0-9]/g, '')) || 1200);
      const safePrimary = evaluated.find(s => s.isSafe) ?? evaluated[0];
      const safeSecondary = evaluated.find(s => s.isSafe && s.id !== safePrimary.id) ?? evaluated[evaluated.length - 1];

      primaryShelterCoords = safePrimary.coords;
      secondaryShelterCoords = safeSecondary.coords;
      radarGaugeCoords = [lat - 0.004, lon + 0.003];
      awsStationCoords = [lat + 0.011, lon - 0.007];
      soilSensorCoords = [lat + 0.005, lon - 0.004];
      geophoneCoords = [lat + 0.010, lon + 0.005];

      // Evacuation route: road-following path from GIS service
      const evacResult = getEvacuationRoute(location.id, [lat, lon], primaryShelterCoords);
      evacuationTrail = evacResult.safePath;
      blockedTrail = evacResult.blockedPath ?? [[lat, lon], [lat - 0.002, lon - 0.001]];

      slopeHazardPolygon = [
        [lat + 0.008, lon + 0.005],
        [lat + 0.014, lon + 0.008],
        [lat + 0.012, lon + 0.012],
        [lat + 0.006, lon + 0.009],
      ];
    }

    // 2. Primary High-Ground Shelter (Lata Village flat terrace for Raini, Kamakhya for Guwahati, Bhairavnath for Kedarnath)
    const primaryShelter = {
      id: `shelter-primary-${location.id}`,
      name: isRaini
        ? 'Lata Village Assembly Shelter (FLAT TERRACE · +340m ASL)'
        : isGuwahati
        ? 'Kamakhya Nilachal Hilltop Community Refuge (+160m ASL)'
        : isKedarnath
        ? 'Bhairavnath High Ridge Refuge (+220m ASL)'
        : `${location.name.split('/')[0].trim()} Designated Assembly Shelter (+150m)`,
      type: 'SHELTER',
      category: 'DESIGNATED_ASSEMBLY',
      lat: primaryShelterCoords[0],
      lon: primaryShelterCoords[1],
      elevation: isRaini
        ? '2,380 m ASL (+340m Gain · FLAT TERRACE VILLAGE)'
        : isGuwahati
        ? '215 m ASL (+160m Gain · GRANITE HILL BENCH)'
        : `${baseEle + 150} m ASL`,
      capacity: isRaini ? 550 : 450,
      currentOccupancy: 38,
      waterSupply: 'Gravity Spring + Tank (4 days reserve)',
      medicalSupport: 'SDRF First Aid Post Attached',
      riskLevel: 'LOW',
      riskScore: 8,
      status: 'OPERATIONAL & STOCKED',
      desc: isRaini
        ? (gisLang === 'hi'
            ? 'नामित प्राथमिक उच्च-स्तरीय आश्रय केंद्र (लता रिज)। नदी घाटी से +320 मीटर ऊपर सुरक्षित कृषि पठार पर स्थित।'
            : 'Designated high-altitude community refuge on Lata village agricultural plateau. Located +320m above Dhauliganga gorge, completely outside flood surge reach.')
        : (gisLang === 'hi'
            ? 'नामित आपदा राहत आश्रय स्थल। सुरक्षित ऊंचाई पर स्थित।'
            : 'Designated reinforced community shelter on stable rocky spur. Well above 100-year modeled surge level.'),
      action: isRaini
        ? (gisLang === 'hi'
            ? 'प्राथमिक अनुशंसित गंतव्य। भोजन, पेयजल, सैटेलाइट संचार एवं चिकित्सा उपलब्ध।'
            : 'Recommended high-altitude assembly refuge. Safe spring water, satellite comms, and emergency rations.')
        : 'Designated high-ground assembly destination.',
    };

    // 3. Secondary Shelter / Upper Raini Spur (+140m ASL)
    const secondaryShelter = {
      id: `shelter-secondary-${location.id}`,
      name: isRaini
        ? 'Upper Raini Spur Shelter (+140m ASL)'
        : `${location.region.split('(')[0].trim()} Panchayat Bhavan (+85m)`,
      type: 'SHELTER_SECONDARY',
      category: 'DESIGNATED_ASSEMBLY',
      lat: secondaryShelterCoords[0],
      lon: secondaryShelterCoords[1],
      elevation: isRaini ? '2,180 m ASL (+140m Gain)' : `${baseEle + 85} m ASL`,
      capacity: 280,
      currentOccupancy: 0,
      riskLevel: 'LOW',
      riskScore: 16,
      status: 'STANDBY ACTIVE',
      desc: isRaini
        ? 'द्वितीयक आश्रय केंद्र। पश्चिमी पहाड़ी ढलान पर स्थित।'
        : 'Secondary designated relief center on western hill slope. Alternate option if north ridge trail is crowded.',
      action: gisLang === 'hi' ? 'वैकल्पिक नामित केंद्र।' : 'Alternate designated assembly center.',
    };

    // 4. AWS Weather Station (Rainfall Gauge)
    const awsStation = {
      id: `sensor-aws-${location.id}`,
      name: `${location.name.split('/')[0].trim()} AWS Telemetry Station`,
      type: 'AWS_GAUGE',
      category: 'IOT_SENSOR',
      lat: awsStationCoords[0],
      lon: awsStationCoords[1],
      elevation: `${Math.round(baseEle * 1.3)} m ASL`,
      reading: location.rainfall3h,
      intensity: isHigh ? '32 mm/hr (INTENSE)' : '8 mm/hr (MODERATE)',
      status: 'ONLINE (LoRaWAN)',
      riskLevel: location.riskLevel,
      desc: gisLang === 'hi'
        ? `स्वचालित मौसम केंद्र - वर्षा माप: ${location.rainfall3h} (पिछले 3 घंटे)।`
        : `Autonomous solar-powered tipping bucket rain gauge with satellite downlink. Orographic collection zone.`,
      action: isHigh
        ? (gisLang === 'hi' ? 'तीव्र वर्षा दर जारी। अपवाह में तेजी आ रही है।' : 'Extreme precipitation rate. Overland runoff coefficient: 88%.')
        : (gisLang === 'hi' ? 'सामान्य वर्षा।' : 'Precipitation within safe threshold limits.'),
    };

    // 5. Radar River Confluence Gauge
    const riverGauge = {
      id: `sensor-radar-${location.id}`,
      name: `${location.name.split('/')[1]?.trim() || location.region.split('(')[0].trim()} Confluence Radar Gauge`,
      type: 'RADAR_GAUGE',
      category: 'IOT_SENSOR',
      lat: radarGaugeCoords[0],
      lon: radarGaugeCoords[1],
      elevation: `${Math.round(baseEle * 0.95)} m ASL`,
      reading: location.riverStage,
      trend: isHigh ? '↑ +0.40 m/h (RAPID SURGE)' : '→ Steady (+0.02 m/h)',
      dangerLevel: '4.50 m',
      warningLevel: '3.80 m',
      status: 'ONLINE (Radar Telemetry)',
      riskLevel: isHigh ? 'EXTREME' : 'LOW',
      desc: gisLang === 'hi'
        ? `नदी जलस्तर रडार गेज। वर्तमान स्तर: ${location.riverStage}।`
        : `Non-contact frequency-modulated microwave radar gauge measuring stream stage and flow velocity.`,
      action: isHigh
        ? (gisLang === 'hi' ? 'खतरे के निशान से ऊपर! बाढ़ की लहर तीव्र।' : 'CRITICAL: Stage is crossing Danger Mark! Flash flood wave imminent.')
        : (gisLang === 'hi' ? 'जलस्तर सुरक्षित सीमा में।' : 'Water level within safe seasonal margins.'),
    };

    // 6. TDR Soil Moisture Probe
    const soilSensor = {
      id: `sensor-soil-${location.id}`,
      name: `Colluvial Slope Soil Probe (SOIL-02)`,
      type: 'SOIL_PROBE',
      category: 'IOT_SENSOR',
      lat: soilSensorCoords[0],
      lon: soilSensorCoords[1],
      elevation: `${baseEle + 60} m ASL`,
      reading: location.soilMoisture,
      depth: '30 cm & 60 cm double-probe',
      status: 'ONLINE',
      riskLevel: isHigh ? 'HIGH' : 'LOW',
      desc: gisLang === 'hi'
        ? `मृदा आर्द्रता सेंसर: संतृप्ति ${location.soilMoisture}। अवशोषण क्षमता समाप्त।`
        : `Time-Domain Reflectometry (TDR) moisture probe measuring volumetric soil saturation.`,
      action: isHigh
        ? (gisLang === 'hi' ? 'मिट्टी पूरी तरह संतृप्त है, वर्षा का पानी सीधे बहाव बन रहा है।' : 'Soil is saturated: zero infiltration buffer remaining. 90% rain turns into flash runoff.')
        : (gisLang === 'hi' ? 'मृदा अवशोषण क्षमता उपलब्ध।' : 'Soil retains normal water absorption capacity.'),
    };

    // 7. Geophone Acoustic Sensor
    const geophone = {
      id: `sensor-geo-${location.id}`,
      name: `Upper Gorge Geophone (GEO-01)`,
      type: 'GEOPHONE',
      category: 'IOT_SENSOR',
      lat: geophoneCoords[0],
      lon: geophoneCoords[1],
      elevation: `${baseEle + 180} m ASL`,
      reading: isHigh ? '64 dB (Debris Rumble)' : '18 dB (Ambient Baseline)',
      status: 'ONLINE',
      riskLevel: isHigh ? 'HIGH' : 'LOW',
      desc: gisLang === 'hi'
        ? 'ध्वनिक कंपन सेंसर - ऊपरी घाटी में मलबा प्रवाह व भूस्खलन कंपन की पहचान।'
        : 'Tri-axial seismic geophone tuned to 10-50 Hz ground vibrations characteristic of boulder debris torrents.',
      action: isHigh
        ? (gisLang === 'hi' ? 'भारी मलबे के बहाव की आवाज दर्ज। सतर्क रहें।' : 'High-energy acoustic tremor: boulder bedload surge moving downstream.')
        : (gisLang === 'hi' ? 'घाटी में कोई भूस्खलन कंपन नहीं।' : 'No anomalous seismic debris signature detected.'),
    };

    return {
      village,
      primaryShelter,
      secondaryShelter,
      sensors: [awsStation, riverGauge, soilSensor, geophone],
      riverVector,
      tributaryVector,
      floodPolygon,
      evacuationTrail,
      blockedTrail,
      slopeHazardPolygon,
    };
  }, [location, gisLang]);

  // Handle entity selection
  const handleEntityClick = (entity: any) => {
    setSelectedEntity(entity);
    if (onSelectNode) {
      onSelectNode(entity);
    }
  };

  // Sync selectedNodeId prop with selectedEntity
  useEffect(() => {
    if (!selectedNodeId) return;
    const all = [
      spatialEntities.village,
      spatialEntities.primaryShelter,
      spatialEntities.secondaryShelter,
      ...spatialEntities.sensors,
    ];
    const match = all.find((e) => e.id === selectedNodeId);
    if (match) setSelectedEntity(match);
  }, [selectedNodeId, spatialEntities]);

  // Leaflet Map Initialization & Reactive Update
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isCancelled = false;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Inject Leaflet CSS if not already present
      if (!document.getElementById('leaflet-css-bundle')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css-bundle';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        await new Promise<void>((r) => setTimeout(r, 100));
      }

      // Initialize map instance if not exists
      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [location.lat, location.lon],
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: true,
        });

        // Attribution in bottom right corner
        L.control.attribution({ position: 'bottomright', prefix: false })
          .addAttribution('© Google Maps · FloodGuard AI SIH26192')
          .addTo(map);

        mapInstanceRef.current = map;
        layerGroupRef.current = L.layerGroup().addTo(map);
      }

      if (isCancelled || !mapInstanceRef.current) return;
      const map = mapInstanceRef.current;
      const lg = layerGroupRef.current;

      // ── Update Tile Layer ──
      if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
      if (labelLayerRef.current) map.removeLayer(labelLayerRef.current);

      let tileUrl = '';
      let subdomains = ['a', 'b', 'c'];
      let maxZoom = 19;
      let hasLabelOverlay = false;

      switch (activeBaseMap) {
        case 'SATELLITE':
          // Google Earth Hybrid Satellite (High-Res Aerial + Terrain & Feature Markings)
          tileUrl = 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
          subdomains = ['0', '1', '2', '3'];
          hasLabelOverlay = false;
          maxZoom = 21;
          break;
        case 'TOPO':
          // OpenTopoMap with elevation contours & relief
          tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
          subdomains = ['a', 'b', 'c'];
          maxZoom = 17;
          break;
        case 'DARK':
          // CartoDB Dark Matter for night-time tactical disaster operations
          tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
          subdomains = ['a', 'b', 'c', 'd'];
          maxZoom = 19;
          break;
        case 'STREET':
        default:
          // Google Maps Standard Street Map
          tileUrl = 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
          subdomains = ['0', '1', '2', '3'];
          maxZoom = 21;
          break;
      }

      const baseTile = L.tileLayer(tileUrl, {
        subdomains,
        maxZoom,
        attribution: activeBaseMap === 'SATELLITE' || activeBaseMap === 'STREET'
          ? 'Imagery © Google Earth / Google Maps · FloodGuard AI SIH26192'
          : '© OpenStreetMap contributors · FloodGuard AI',
      }).addTo(map);
      tileLayerRef.current = baseTile;

      // Clear previous overlays
      lg.clearLayers();

      const isHighRisk = location.riskLevel === 'HIGH' || location.riskLevel === 'EXTREME';

      // ── 1. MULTI-ZONE FLOOD INUNDATION ENVELOPE ──
      if (layers.floodZone) {
        if (isRaini) {
          // ZONE 1 — RED: Active gorge-floor inundation (certain death during surge)
          // Inner canyon walls, ~50-70m either side of river centerline
          const zone1Red: [number, number][] = [
            [30.4873, 79.6300], [30.4861, 79.6370], [30.4851, 79.6450],
            [30.4856, 79.6530], [30.4853, 79.6610], [30.4847, 79.6690],
            [30.4843, 79.6760], [30.4845, 79.6830], [30.4848, 79.6890],
            [30.4850, 79.6928], [30.4851, 79.6950], [30.4853, 79.7000],
            [30.4857, 79.7060], [30.4861, 79.7120], [30.4865, 79.7180],
            [30.4869, 79.7240], [30.4872, 79.7300],
            // South wall back
            [30.4866, 79.7300], [30.4863, 79.7240], [30.4859, 79.7180],
            [30.4855, 79.7120], [30.4851, 79.7000], [30.4847, 79.6950],
            [30.4845, 79.6928], [30.4843, 79.6890], [30.4840, 79.6830],
            [30.4838, 79.6760], [30.4843, 79.6690], [30.4849, 79.6610],
            [30.4852, 79.6530], [30.4847, 79.6450], [30.4857, 79.6370],
            [30.4869, 79.6300],
          ];
          L.polygon(zone1Red, {
            color: '#dc2626',
            weight: 2,
            fillColor: '#ef4444',
            fillOpacity: 0.55,
          }).addTo(lg).bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.6;min-width:240px;">
              <b style="color:#dc2626;font-size:13px;">🔴 ZONE 1 — ACTIVE INUNDATION (GORGE FLOOR)</b><br/>
              <b>Risk Level:</b> EXTREME — certain fatality during surge<br/>
              <b>Water Depth:</b> 2.0m – 4.5m (debris-laden torrent)<br/>
              <b>Area:</b> Active riverbed + canyon floor terraces<br/>
              <b>Action:</b> <span style="color:#dc2626;font-weight:bold;">EVACUATE IMMEDIATELY — DO NOT ENTER</span>
            </div>
          `);

          // ZONE 2 — ORANGE: High-velocity surge reach buffer (~100-180m from centerline)
          // This covers low terraces and any valley-floor settlement platforms
          const zone2Orange: [number, number][] = [
            [30.4880, 79.6300], [30.4869, 79.6370], [30.4858, 79.6450],
            [30.4863, 79.6530], [30.4860, 79.6610], [30.4853, 79.6690],
            [30.4849, 79.6760], [30.4851, 79.6830], [30.4854, 79.6890],
            [30.4854, 79.6928], [30.4856, 79.6960], [30.4858, 79.7010],
            [30.4862, 79.7070], [30.4866, 79.7130], [30.4870, 79.7190],
            [30.4876, 79.7250], [30.4878, 79.7300],
            // Rishiganga outer surge buffer
            [30.4838, 79.6928], [30.4820, 79.6960], [30.4796, 79.7010],
            [30.4766, 79.7060], [30.4731, 79.7110], [30.4701, 79.7160],
            [30.4671, 79.7210], [30.4685, 79.7218], [30.4715, 79.7168],
            [30.4745, 79.7118], [30.4780, 79.7068], [30.4810, 79.7018],
            [30.4836, 79.6970], [30.4845, 79.6937],
            // South wall return
            [30.4836, 79.6890], [30.4833, 79.6830], [30.4831, 79.6760],
            [30.4836, 79.6690], [30.4844, 79.6610], [30.4847, 79.6530],
            [30.4843, 79.6450], [30.4852, 79.6370], [30.4866, 79.6300],
          ];
          L.polygon(zone2Orange, {
            color: '#ea580c',
            weight: 1.5,
            fillColor: '#f97316',
            fillOpacity: 0.32,
          }).addTo(lg).bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.6;min-width:240px;">
              <b style="color:#ea580c;font-size:13px;">🟠 ZONE 2 — HIGH SURGE REACH (DANGER BUFFER)</b><br/>
              <b>Risk Level:</b> HIGH — high-velocity lateral surge reach<br/>
              <b>Water Depth:</b> 0.6m – 2.0m (fast moving, debris)<br/>
              <b>Area:</b> Low terraces, riverbank settlements<br/>
              <b>Action:</b> <span style="color:#ea580c;font-weight:bold;">EVACUATE — MOVE TO RIDGE (ZONE 3 or above)</span>
            </div>
          `);

          // ZONE 3 — YELLOW: Caution / spray & debris zone (~200-350m from centerline)
          // Slope toes and lower terrace edges — potential splash, seepage, minor debris
          const zone3Yellow: [number, number][] = [
            [30.4892, 79.6300], [30.4880, 79.6370], [30.4868, 79.6450],
            [30.4874, 79.6530], [30.4870, 79.6610], [30.4862, 79.6690],
            [30.4856, 79.6760], [30.4858, 79.6830], [30.4862, 79.6890],
            [30.4862, 79.6928], [30.4864, 79.6970], [30.4868, 79.7020],
            [30.4872, 79.7080], [30.4876, 79.7140], [30.4880, 79.7200],
            [30.4886, 79.7260], [30.4888, 79.7300],
            [30.4828, 79.6928], [30.4810, 79.6955], [30.4786, 79.7005],
            [30.4756, 79.7055], [30.4721, 79.7105], [30.4691, 79.7155],
            [30.4661, 79.7205], [30.4675, 79.7228], [30.4705, 79.7178],
            [30.4735, 79.7128], [30.4770, 79.7078], [30.4800, 79.7028],
            [30.4826, 79.6978], [30.4838, 79.6950],
            [30.4830, 79.6890], [30.4826, 79.6830], [30.4824, 79.6760],
            [30.4829, 79.6690], [30.4837, 79.6610], [30.4840, 79.6530],
            [30.4836, 79.6450], [30.4845, 79.6370], [30.4859, 79.6300],
          ];
          L.polygon(zone3Yellow, {
            color: '#ca8a04',
            weight: 1.5,
            dashArray: '6 4',
            fillColor: '#facc15',
            fillOpacity: 0.18,
          }).addTo(lg).bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.6;min-width:240px;">
              <b style="color:#ca8a04;font-size:13px;">🟡 ZONE 3 — CAUTION (SPLASH & DEBRIS REACH)</b><br/>
              <b>Risk Level:</b> MODERATE — edge spray, soil saturation, minor debris<br/>
              <b>Water Depth:</b> &lt;0.5m (seepage, runoff)<br/>
              <b>Area:</b> Slope toes, lower terrace edges<br/>
              <b>Action:</b> <span style="color:#ca8a04;font-weight:bold;">PREPARE EVACUATION — MONITOR RIVER STAGE</span>
            </div>
          `);

        } else if (isGuwahati) {
          // ── ASSAM (GUWAHATI / BRAHMAPUTRA FLOOD) ──
          // ZONE 1 — RED: Active inundation along Brahmaputra riverfront & Bharalu backflow
          const zone1RedGuwahati: [number, number][] = [
            [26.1950, 91.8200], [26.1920, 91.7850], [26.1880, 91.7600],
            [26.1820, 91.7400], [26.1750, 91.7150], [26.1620, 91.6850],
            [26.1550, 91.6600], [26.1480, 91.6600], [26.1550, 91.6850],
            [26.1680, 91.7150], [26.1750, 91.7400], [26.1810, 91.7600],
            [26.1850, 91.7850], [26.1880, 91.8200],
          ];
          L.polygon(zone1RedGuwahati, {
            color: '#dc2626',
            weight: 2.5,
            fillColor: '#ef4444',
            fillOpacity: 0.52,
          }).addTo(lg).bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.6;min-width:240px;">
              <b style="color:#dc2626;font-size:13px;">🔴 ZONE 1 — ACTIVE BRAHMAPUTRA INUNDATION</b><br/>
              <b>Risk Level:</b> EXTREME — Submerged lowlands &amp; Bharalu backflow<br/>
              <b>Water Depth:</b> 2.0m – 3.5m (River stage 50.25m vs Danger 49.68m)<br/>
              <b>Area:</b> Pandu Port, Bharalumukh, Fancy Bazar ghats<br/>
              <b>Action:</b> <span style="color:#dc2626;font-weight:bold;">EVACUATE IMMEDIATELY TO NILACHAL / KAMAKHYA</span>
            </div>
          `);

          // ZONE 2 — ORANGE: High-velocity surge & urban stormwater waterlogging buffer
          const zone2OrangeGuwahati: [number, number][] = [
            [26.2000, 91.8250], [26.1960, 91.7850], [26.1920, 91.7600],
            [26.1860, 91.7400], [26.1800, 91.7150], [26.1660, 91.6800],
            [26.1500, 91.6500], [26.1380, 91.6600], [26.1450, 91.6900],
            [26.1580, 91.7200], [26.1650, 91.7450], [26.1700, 91.7700],
            [26.1750, 91.8000], [26.1800, 91.8300],
          ];
          L.polygon(zone2OrangeGuwahati, {
            color: '#ea580c',
            weight: 2,
            fillColor: '#f97316',
            fillOpacity: 0.35,
          }).addTo(lg).bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.6;min-width:240px;">
              <b style="color:#ea580c;font-size:13px;">🟠 ZONE 2 — HIGH SURGE BUFFER (LOWLAND WARDS)</b><br/>
              <b>Water Depth:</b> 0.8m – 1.8m (Stormwater backflow)<br/>
              <b>Area:</b> Anil Nagar, Nabin Nagar, Hatigaon, Zoo Road corridors<br/>
              <b>Action:</b> <span style="color:#ea580c;font-weight:bold;">MOVE VALUABLES &amp; ASCEND TO HIGHER GROUND</span>
            </div>
          `);

          // ZONE 3 — YELLOW: Caution & drainage runout perimeter
          const zone3YellowGuwahati: [number, number][] = [
            [26.2050, 91.8300], [26.2000, 91.7850], [26.1950, 91.7600],
            [26.1900, 91.7400], [26.1850, 91.7100], [26.1700, 91.6750],
            [26.1450, 91.6450], [26.1300, 91.6550], [26.1380, 91.6950],
            [26.1500, 91.7250], [26.1580, 91.7500], [26.1620, 91.7800],
            [26.1680, 91.8100], [26.1750, 91.8400],
          ];
          L.polygon(zone3YellowGuwahati, {
            color: '#ca8a04',
            weight: 1.5,
            dashArray: '6 4',
            fillColor: '#facc15',
            fillOpacity: 0.20,
          }).addTo(lg).bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.6;min-width:240px;">
              <b style="color:#ca8a04;font-size:13px;">🟡 ZONE 3 — CAUTION / WATCH (HILL FOOTHILLS)</b><br/>
              <b>Water Depth:</b> &lt;0.5m (Surface runoff &amp; splash)<br/>
              <b>Area:</b> Nilachal / Sarania / Narakasur foothill perimeters<br/>
              <b>Action:</b> Prepare emergency kits · Monitor ASDMA siren broadcasts
            </div>
          `);
        } else {
          // ── GENERIC LOCATIONS: 3-ZONE CLOSED FLOOD POLYGON FROM GIS SERVICE ──
          // Uses OSM waterway geometry if available, falls back to spatialEntities river vector
          const baseRiverCoords = osmWaterways.length > 0
            ? osmWaterways[0].coords
            : spatialEntities.riverVector;
          const gisZones = getFloodRiskPolygons(location.id, location.lat, location.lon, baseRiverCoords);

          // ZONE 1 — RED: High-risk active inundation corridor
          L.polygon(gisZones.zone1Red, {
            color: '#dc2626', weight: 2,
            fillColor: '#ef4444', fillOpacity: 0.52,
          }).addTo(lg).bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.6;min-width:240px;">
              <b style="color:#dc2626;font-size:13px;">🔴 ZONE 1 — ACTIVE INUNDATION CORRIDOR</b><br/>
              <b>Risk Level:</b> ${location.riskLevel} — Active channel + floodplain floor<br/>
              <b>Modeled Water Depth:</b> 1.5m – 3.5m (High velocity, debris-laden)<br/>
              <b>River Basin:</b> ${location.region.split('(')[0]}<br/>
              <b>Data:</b> ⚡ ${gisZones.dataStatus.replace(/_/g,' ')}<br/>
              <b>Action:</b> <span style="color:#dc2626;font-weight:bold;">EVACUATE IMMEDIATELY — MOVE TO HIGH GROUND</span>
            </div>
          `);

          // ZONE 2 — ORANGE: Medium-risk surge buffer
          L.polygon(gisZones.zone2Orange, {
            color: '#ea580c', weight: 1.5,
            fillColor: '#f97316', fillOpacity: 0.32,
          }).addTo(lg).bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.6;min-width:240px;">
              <b style="color:#ea580c;font-size:13px;">🟠 ZONE 2 — HIGH SURGE REACH (BUFFER)</b><br/>
              <b>Modeled Water Depth:</b> 0.5m – 1.5m (Surge wave reach)<br/>
              <b>Area:</b> Low terraces, riverbank settlements<br/>
              <b>Action:</b> <span style="color:#ea580c;font-weight:bold;">EVACUATE — MOVE TO HIGHER GROUND (ZONE 3+)</span>
            </div>
          `);

          // ZONE 3 — YELLOW: Caution / spray perimeter
          L.polygon(gisZones.zone3Yellow, {
            color: '#ca8a04', weight: 1.5, dashArray: '6 4',
            fillColor: '#facc15', fillOpacity: 0.18,
          }).addTo(lg).bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.6;min-width:240px;">
              <b style="color:#ca8a04;font-size:13px;">🟡 ZONE 3 — CAUTION (SPLASH &amp; DEBRIS REACH)</b><br/>
              <b>Modeled Water Depth:</b> &lt;0.5m (Surface runoff &amp; spray)<br/>
              <b>Area:</b> Slope toes, lower terrace edges<br/>
              <b>Action:</b> <span style="color:#ca8a04;font-weight:bold;">PREPARE EVACUATION — MONITOR RIVER STAGE</span>
            </div>
          `);
        }
      }

      // ── 2. REAL STRAHLER RIVER FLOW VECTOR (MAINSTEM & TRIBUTARY) ──
      if (layers.riverVector) {
        // For generic/fallback locations, prefer real OSM waterway if fetched
        const activeRiverCoords = (!isRaini && !isGuwahati && osmWaterways.length > 0)
          ? osmWaterways[0].coords
          : spatialEntities.riverVector;

        // Mainstem River Channel (Dhauliganga / Mandakini / Beas / Brahmaputra)
        L.polyline(activeRiverCoords, {
          color: '#0c4a6e',
          weight: 9,
          opacity: 0.9,
          lineCap: 'round',
        }).addTo(lg);

        L.polyline(activeRiverCoords, {
          color: '#38bdf8',
          weight: 4,
          opacity: 0.95,
          lineCap: 'round',
        })
          .addTo(lg)
          .bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;min-width:220px;">
              <b style="color:#0284c7;">💧 ${location.region.split('(')[0]} Mainstem Channel</b><br/>
              <b>Current Water Stage:</b> ${location.riverStage}<br/>
              <b>Threshold Status:</b> ${isHighRisk ? '⚠️ FLASH DANGER THRESHOLD EXCEEDED' : '✅ NORMAL SEASONAL FLOW'}<br/>
              <b>Geometry:</b> ${(!isRaini && !isGuwahati && osmWaterways.length > 0) ? '✅ Real OSM Waterway Data' : 'Traced along riverbed canyon'}<br/>
              <b>Velocity:</b> 4.2 m/s downstream surge
            </div>
          `);

        // Also render additional OSM waterway segments (tributaries) for generic locations
        if (!isRaini && !isGuwahati && osmWaterways.length > 1) {
          osmWaterways.slice(1, 5).forEach((way) => {
            L.polyline(way.coords, {
              color: '#0369a1',
              weight: 5,
              opacity: 0.75,
              lineCap: 'round',
            }).addTo(lg);
            L.polyline(way.coords, {
              color: '#7dd3fc',
              weight: 2,
              opacity: 0.85,
              lineCap: 'round',
            }).addTo(lg).bindTooltip(`${way.name || 'Tributary waterway'} (OSM)`, { direction: 'top' });
          });
        }

        // ── FLOOD DIRECTION ARROWS (East→West along Dhauliganga for Raini) ──
        if (isRaini) {
          // Place chevron arrow markers at intervals along the river to show surge flow direction
          const arrowPositions: [number, number][] = [
            [30.4867, 79.7230], // Far east
            [30.4854, 79.7080], // Mid-east
            [30.4848, 79.6960], // Confluence area
            [30.4842, 79.6820], // Mid-west
            [30.4849, 79.6600], // Far west
            [30.4858, 79.6420], // Tapovan approach
          ];
          arrowPositions.forEach((pos, i) => {
            const arrowIcon = L.divIcon({
              html: `<div style="
                display:flex;align-items:center;justify-content:center;
                width:32px;height:20px;
                background:rgba(14,116,144,0.88);
                border:1.5px solid #38bdf8;
                border-radius:4px;
                font-size:16px;
                color:#e0f7ff;
                box-shadow:0 0 8px #0ea5e9;
                font-weight:bold;
                line-height:1;
              ">◀</div>`,
              className: '',
              iconSize: [32, 20],
              iconAnchor: [16, 10],
            });
            L.marker(pos, { icon: arrowIcon, zIndexOffset: 700 + i })
              .addTo(lg)
              .bindTooltip(`Surge flow direction (East → West) · ${4.2 - i * 0.1} m/s`, { direction: 'top' });
          });

          // Rishiganga direction arrows (South→North into confluence)
          const risharrowPositions: [number, number][] = [
            [30.4722, 79.7148],
            [30.4780, 79.7055],
            [30.4832, 79.6970],
          ];
          risharrowPositions.forEach((pos, i) => {
            const rishArrow = L.divIcon({
              html: `<div style="
                display:flex;align-items:center;justify-content:center;
                width:32px;height:20px;
                background:rgba(154,52,18,0.88);
                border:1.5px solid #f97316;
                border-radius:4px;
                font-size:14px;
                color:#fff7ed;
                box-shadow:0 0 8px #ea580c;
                font-weight:bold;
                line-height:1;
                transform:rotate(-45deg);
              ">◀</div>`,
              className: '',
              iconSize: [32, 20],
              iconAnchor: [16, 10],
            });
            L.marker(pos, { icon: rishArrow, zIndexOffset: 700 + i })
              .addTo(lg)
              .bindTooltip(`Rishiganga surge direction (North into Dhauliganga) · ${6.4 - i * 0.3} m/s`, { direction: 'top' });
          });
        }

        // ── FLOOD DIRECTION ARROWS (East→West along Brahmaputra for Guwahati) ──
        if (isGuwahati) {
          const assamArrowPositions: [number, number][] = [
            [26.1920, 91.7850],
            [26.1820, 91.7400],
            [26.1680, 91.7000],
            [26.1580, 91.6700],
          ];
          assamArrowPositions.forEach((pos, i) => {
            const arrowIcon = L.divIcon({
              html: `<div style="
                display:flex;align-items:center;justify-content:center;
                width:32px;height:20px;
                background:rgba(14,116,144,0.88);
                border:1.5px solid #38bdf8;
                border-radius:4px;
                font-size:16px;
                color:#e0f7ff;
                box-shadow:0 0 8px #0ea5e9;
                font-weight:bold;
                line-height:1;
              ">◀</div>`,
              className: '',
              iconSize: [32, 20],
              iconAnchor: [16, 10],
            });
            L.marker(pos, { icon: arrowIcon, zIndexOffset: 700 + i })
              .addTo(lg)
              .bindTooltip(`Brahmaputra discharge (East → West) · 3.8 m/s`, { direction: 'top' });
          });
        }

        // ── ALGORITHMIC FLOW ARROWS FOR GENERIC / KEDARNATH / KULLU / OTHER LOCATIONS ──
        // Placed on every 2nd segment of river centerline using bearing-based rotation
        if (!isRaini && !isGuwahati) {
          const arrowCoords = (!isRaini && !isGuwahati && osmWaterways.length > 0)
            ? osmWaterways[0].coords
            : spatialEntities.riverVector;
          const step = Math.max(1, Math.floor(arrowCoords.length / 5)); // up to 5 arrows
          for (let i = 0; i < arrowCoords.length - 1; i += step) {
            const bearing = calculateSegmentBearing(arrowCoords[i], arrowCoords[Math.min(i + 1, arrowCoords.length - 1)]);
            const midLat = (arrowCoords[i][0] + arrowCoords[Math.min(i + 1, arrowCoords.length - 1)][0]) / 2;
            const midLon = (arrowCoords[i][1] + arrowCoords[Math.min(i + 1, arrowCoords.length - 1)][1]) / 2;
            const arrowIcon = L.divIcon({
              html: `<div style="
                display:flex;align-items:center;justify-content:center;
                width:28px;height:18px;
                background:rgba(14,116,144,0.85);
                border:1.5px solid #38bdf8;
                border-radius:4px;
                font-size:14px;
                color:#e0f7ff;
                box-shadow:0 0 6px #0ea5e9;
                font-weight:bold;
                line-height:1;
                transform:rotate(${bearing - 90}deg);
              ">▶</div>`,
              className: '',
              iconSize: [28, 18],
              iconAnchor: [14, 9],
            });
            L.marker([midLat, midLon], { icon: arrowIcon, zIndexOffset: 600 + i })
              .addTo(lg)
              .bindTooltip(`Flow direction · bearing ${Math.round(bearing)}°`, { direction: 'top' });
          }
        }

        // Glacial Tributary Surge Corridor (e.g., Rishiganga Gorge)
        if (spatialEntities.tributaryVector && spatialEntities.tributaryVector.length > 1) {
          L.polyline(spatialEntities.tributaryVector, {
            color: '#7c2d12',
            weight: 7,
            opacity: 0.85,
            lineCap: 'round',
          }).addTo(lg);

          L.polyline(spatialEntities.tributaryVector, {
            color: '#fb923c',
            weight: 3,
            opacity: 0.95,
            lineCap: 'round',
          })
            .addTo(lg)
            .bindPopup(`
              <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;">
                <b style="color:#ea580c;">⚠️ Rishiganga Surge Tributary Gorge</b><br/>
                <b>Hazard Vector:</b> Glacial / Moraine Outburst Surge Corridor<br/>
                <b>Confluence:</b> Raini Bridge Confluence (joins Dhauliganga)<br/>
                <b>Discharge Velocity:</b> 6.4 m/s debris torrent (Illustrative)
              </div>
            `);
        }
      }


      // ── 3. STEEP SLOPE & LANDSLIDE HAZARD ZONE ──
      if (layers.slopeHazards) {
        L.polygon(spatialEntities.slopeHazardPolygon, {
          color: '#dc2626',
          weight: 2,
          dashArray: '4 4',
          fillColor: '#ef4444',
          fillOpacity: 0.25,
        })
          .addTo(lg)
          .bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;">
              <b style="color:#dc2626;">⛰️ CRITICAL SLOPE HAZARD (>38° Slope)</b><br/>
              <b>Soil Saturation:</b> ${location.soilMoisture}<br/>
              <b>Hazard Type:</b> High colluvial slide & debris torrent vulnerability.<br/>
              <b>Advisory:</b> Avoid hillside trails during intense downpours.
            </div>
          `);
      }

      // ── 4. EVACUATION ISOCHRONES (WALKING TIME BUFFERS) ──
      if (layers.isochrones) {
        // 5-minute walk buffer (250m radius) around Primary Shelter
        L.circle([spatialEntities.primaryShelter.lat, spatialEntities.primaryShelter.lon], {
          radius: 250,
          color: '#10b981',
          weight: 1.5,
          dashArray: '4 4',
          fillColor: '#10b981',
          fillOpacity: 0.08,
        })
          .addTo(lg)
          .bindTooltip('5 min walk buffer (250m)', { permanent: false, direction: 'top' });

        // 10-minute walk buffer (500m radius)
        L.circle([spatialEntities.primaryShelter.lat, spatialEntities.primaryShelter.lon], {
          radius: 500,
          color: '#059669',
          weight: 1.5,
          dashArray: '6 6',
          fillColor: '#059669',
          fillOpacity: 0.04,
        })
          .addTo(lg)
          .bindTooltip('10 min walk buffer (500m)', { permanent: false, direction: 'top' });
      }

      // ── 5. CANDIDATE EVACUATION ESCAPE TRAIL (CYAN / EMERALD POLYLINE) ──
      if (layers.evacuationRoute) {
        L.polyline(spatialEntities.evacuationTrail, {
          color: '#10b981',
          weight: 6,
          opacity: 0.95,
          lineCap: 'round',
        }).addTo(lg);

        L.polyline(spatialEntities.evacuationTrail, {
          color: '#a7f3d0',
          weight: 2,
          dashArray: '4 8',
        })
          .addTo(lg)
          .bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;min-width:240px;">
              <b style="color:#059669;">🚶 CANDIDATE ESCAPE VECTOR: ${isRaini ? 'Uphill Ridge Trail to Lata High Ground' : 'North Ridge Trail'}</b><br/>
              <b>Destination:</b> ${spatialEntities.primaryShelter.name}<br/>
              <b>Elevation Gain:</b> ${isRaini ? '+320m uphill climb (Canyon floor 1,980m → Refuge 2,360m)' : '+150m uphill'}<br/>
              <b>Walking Distance:</b> ${isRaini ? '1.4 km (~18-24 minutes uphill)' : '1.2 km (~14-18 minutes)'}<br/>
              <b>Route Status:</b> CLEAR &amp; MONITORED BY SDRF (CANDIDATE · NDMA TIER-1 UPHILL ESCAPE)
            </div>
          `);

        // Blocked low-lying route in red
        if (isHighRisk) {
          L.polyline(spatialEntities.blockedTrail, {
            color: '#ef4444',
            weight: 5,
            dashArray: '6 6',
            opacity: 0.9,
          })
            .addTo(lg)
            .bindPopup(`
              <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;">
                <b style="color:#dc2626;">🚫 DANGER: BLOCKED RIVERBED CAUSEWAY</b><br/>
                <b>Condition:</b> Submerged under 1.8m turbulent flash flood wave.<br/>
                <b>Action:</b> DO NOT ATTEMPT TO CROSS BY FOOT OR VEHICLE!
              </div>
            `);
        }
      }

      // ── 6. PINS: VILLAGE SETTLEMENT ──
      const villageColor = isHighRisk ? '#f43f5e' : '#10b981';
      const villageIcon = L.divIcon({
        html: `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="position:absolute;width:40px;height:40px;border-radius:50%;background:${villageColor};opacity:0.3;animation:pulse 1.4s infinite;"></div>
            <div style="width:28px;height:28px;border-radius:50%;background:${villageColor};border:3px solid #ffffff;box-shadow:0 0 16px ${villageColor};display:flex;align-items:center;justify-content:center;color:white;font-size:14px;font-weight:bold;">
              🏘️
            </div>
            <div style="background:rgba(15,23,42,0.92);border:1px solid ${villageColor};color:white;font-family:monospace;font-size:10px;font-weight:bold;padding:2px 6px;border-radius:6px;margin-top:3px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.6);">
              ${location.name.split('/')[0].trim()} (${location.riskScore}/100)
            </div>
          </div>`,
        className: '',
        iconSize: [120, 56],
        iconAnchor: [60, 24],
      });

      const villageMarker = L.marker([location.lat, location.lon], { icon: villageIcon, zIndexOffset: 1000 })
        .addTo(lg);
      villageMarker.on('click', () => handleEntityClick(spatialEntities.village));

      // ── 7. PINS: PRIMARY DESIGNATED SHELTER ──
      const shelterIcon = L.divIcon({
        html: `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="width:34px;height:34px;border-radius:50%;background:#059669;border:3px solid #34d399;box-shadow:0 0 20px #10b981;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;">
              🏕️
            </div>
            <div style="background:rgba(6,78,59,0.96);border:1.5px solid #34d399;color:#a7f3d0;font-family:monospace;font-size:10px;font-weight:bold;padding:3px 8px;border-radius:6px;margin-top:3px;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.85);letter-spacing:0.02em;">
              ${spatialEntities.primaryShelter.name}
            </div>
          </div>`,
        className: '',
        iconSize: [220, 60],
        iconAnchor: [110, 22],
      });

      const shelterMarker = L.marker([spatialEntities.primaryShelter.lat, spatialEntities.primaryShelter.lon], { icon: shelterIcon, zIndexOffset: 950 })
        .addTo(lg);
      shelterMarker.on('click', () => handleEntityClick(spatialEntities.primaryShelter));

      // ── 8. PINS: SECONDARY SHELTER ──
      const shelter2Icon = L.divIcon({
        html: `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="width:28px;height:28px;border-radius:50%;background:#0284c7;border:2px solid #38bdf8;box-shadow:0 0 14px #0284c7;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;">
              🏛️
            </div>
            <div style="background:rgba(12,74,110,0.94);border:1px solid #38bdf8;color:#bae6fd;font-family:monospace;font-size:9px;font-weight:bold;padding:2px 6px;border-radius:6px;margin-top:2px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.7);">
              ${spatialEntities.secondaryShelter.name}
            </div>
          </div>`,
        className: '',
        iconSize: [180, 52],
        iconAnchor: [90, 18],
      });

      const shelter2Marker = L.marker([spatialEntities.secondaryShelter.lat, spatialEntities.secondaryShelter.lon], { icon: shelter2Icon, zIndexOffset: 900 })
        .addTo(lg);
      shelter2Marker.on('click', () => handleEntityClick(spatialEntities.secondaryShelter));

      // ── 9. PINS: IOT SENSORS ──
      if (layers.sensors) {
        spatialEntities.sensors.forEach((s) => {
          let iconEmoji = '📡';
          let borderCol = '#38bdf8';
          let bgCol = '#0369a1';

          if (s.type === 'AWS_GAUGE') {
            iconEmoji = '🌧️';
            borderCol = '#60a5fa';
            bgCol = '#1e3a8a';
          } else if (s.type === 'RADAR_GAUGE') {
            iconEmoji = '🌊';
            borderCol = '#38bdf8';
            bgCol = '#0284c7';
          } else if (s.type === 'SOIL_PROBE') {
            iconEmoji = '🌱';
            borderCol = '#fbbf24';
            bgCol = '#b45309';
          } else if (s.type === 'GEOPHONE') {
            iconEmoji = '📳';
            borderCol = '#c084fc';
            bgCol = '#6b21a8';
          }

          const sIcon = L.divIcon({
            html: `
              <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
                <div style="width:24px;height:24px;border-radius:50%;background:${bgCol};border:2px solid ${borderCol};box-shadow:0 0 10px ${borderCol};display:flex;align-items:center;justify-content:center;color:white;font-size:12px;">
                  ${iconEmoji}
                </div>
                <div style="background:rgba(15,23,42,0.92);border:1px solid ${borderCol};color:white;font-family:monospace;font-size:9px;font-weight:bold;padding:1px 4px;border-radius:4px;margin-top:2px;white-space:nowrap;">
                  ${s.reading}
                </div>
              </div>`,
            className: '',
            iconSize: [90, 44],
            iconAnchor: [45, 14],
          });

          const sm = L.marker([s.lat, s.lon], { icon: sIcon, zIndexOffset: 850 })
            .addTo(lg);
          sm.on('click', () => handleEntityClick(s));
        });
      }

      // Smoothly pan and fly to the active location
      map.flyTo([location.lat, location.lon], 14, {
        duration: 1.2,
      });

      setMapReady(true);
    };

    initMap();

    return () => {
      isCancelled = true;
    };
  }, [location, activeBaseMap, layers, spatialEntities, osmWaterways]);

  // Quick reset view button
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([location.lat, location.lon], 14, { duration: 0.8 });
    }
  };

  const isHighRisk = location.riskLevel === 'HIGH' || location.riskLevel === 'EXTREME';

  return (
    <div className={`relative w-full h-full min-h-[460px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col select-none ${className}`}>
      {/* ── MAP CONTAINER ── */}
      <div ref={mapContainerRef} className="w-full h-full flex-1" style={{ zIndex: 1 }} />

      {/* ── TOP CONTROL BAR: BASE MAP & LAYER TOGGLES (NEVER OVERLAPS VIEW SWITCHER) ── */}
      {showControlBar && (
        <div className="absolute top-2.5 left-[345px] right-3 z-[400] hidden md:flex items-center justify-end gap-2 pointer-events-none">
          {/* Base Map Switcher */}
          <div className="pointer-events-auto glass-panel p-1 rounded-xl shadow-2xl border border-cyan-500/30 flex items-center gap-1">
            <span className="text-[10px] font-mono font-bold text-cyan-400 px-1.5 uppercase hidden sm:inline">
              MAP STYLE:
            </span>
            {(
              [
                { id: 'SATELLITE', label: '🌍 GOOGLE EARTH', desc: 'Google Satellite Imagery' },
                { id: 'TOPO', label: '🏔️ TOPO', desc: 'Mountain Relief' },
                { id: 'DARK', label: '⬛ DARK OPS', desc: 'Command Center' },
                { id: 'STREET', label: '🗺️ HYBRID', desc: 'Google Satellite + Roads' },
              ] as { id: BaseMapTileType; label: string; desc: string }[]
            ).map((tile) => (
              <button
                key={tile.id}
                onClick={() => setActiveBaseMap(tile.id)}
                title={tile.desc}
                className={`px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-mono font-bold transition-all transform active:scale-95 ${
                  activeBaseMap === tile.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tile.label}
              </button>
            ))}
          </div>

          {/* Quick Layer Checkbox Toggles */}
          <div className="pointer-events-auto hidden md:flex items-center gap-1.5 glass-panel p-1 rounded-xl border border-slate-700/80 shadow-2xl">
            <button
              onClick={() => setLayers((p) => ({ ...p, floodZone: !p.floodZone }))}
              title="100-Year Modeled Inundation Corridor (Illustrative Hydraulic Estimate)"
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition ${
                layers.floodZone ? 'bg-orange-500/30 text-orange-300 border border-orange-500/40' : 'text-slate-500 opacity-60'
              }`}
            >
              <Waves className="w-3 h-3" />
              <span>FLOOD ZONE</span>
              <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">ESTIMATE</span>
            </button>

            <button
              onClick={() => setLayers((p) => ({ ...p, evacuationRoute: !p.evacuationRoute }))}
              title="Candidate High-Ground Escape Trail (Unverified Ground Surface)"
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition ${
                layers.evacuationRoute ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'text-slate-500 opacity-60'
              }`}
            >
              <Navigation className="w-3 h-3" />
              <span>CANDIDATE ROUTE</span>
            </button>

            <button
              onClick={() => setLayers((p) => ({ ...p, sensors: !p.sensors }))}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition ${
                layers.sensors ? 'bg-blue-500/30 text-blue-300 border border-blue-500/40' : 'text-slate-500 opacity-60'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>IOT SENSORS</span>
            </button>

            <button
              onClick={() => setLayers((p) => ({ ...p, slopeHazards: !p.slopeHazards }))}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition ${
                layers.slopeHazards ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' : 'text-slate-500 opacity-60'
              }`}
            >
              <Mountain className="w-3 h-3" />
              <span>SLOPE RISK</span>
            </button>
          </div>

          {/* Reset Zoom & Location Pin HUD */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              onClick={handleResetView}
              className="glass-panel hover:bg-slate-800 p-1.5 rounded-xl text-cyan-300 border border-cyan-500/30 shadow-xl active:scale-95 transition"
              title="Reset View to Village Center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="glass-panel px-2.5 py-1 rounded-xl text-[10px] font-mono text-cyan-300 border border-cyan-500/30 hidden lg:flex items-center gap-1.5 shadow-xl">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E ({location.elevation})</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Map Style Bar (compact right pill, never collides) */}
      {showControlBar && (
        <div className="md:hidden absolute top-14 right-3 z-[400] flex items-center gap-1.5 pointer-events-none">
          <div className="pointer-events-auto glass-panel p-1 rounded-xl shadow-xl border border-cyan-500/30 flex items-center gap-1">
            {(['SATELLITE', 'TOPO', 'DARK'] as BaseMapTileType[]).map((tile) => (
              <button
                key={tile}
                onClick={() => setActiveBaseMap(tile)}
                className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold ${
                  activeBaseMap === tile ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'
                }`}
              >
                {tile === 'SATELLITE' ? 'EARTH' : tile}
              </button>
            ))}
            <button
              onClick={handleResetView}
              className="p-1 rounded-lg text-cyan-300 hover:bg-slate-800"
              title="Reset View"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* ── UNIFIED LEFT-SIDE INFORMATION PANEL (ALL INFORMATION NEATLY ON THE LEFT) ── */}
      <div className="absolute top-14 left-3 z-[450] flex flex-col pointer-events-none">
        {hudExpanded ? (
          <div className="pointer-events-auto w-80 lg:w-[360px] max-h-[calc(100vh-170px)] bg-slate-950/95 border border-cyan-500/40 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.2)] backdrop-blur-2xl flex flex-col space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 animate-fade-in">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isHighRisk ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                <div className="min-w-0">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider font-bold block truncate">
                    {gisLang === 'hi' ? 'धरातलीय जीआईएस स्थिति' : 'HYPER-LOCAL GROUND SITUATION'}
                  </span>
                  <h4 className="text-xs font-black text-white truncate uppercase font-mono">
                    {location.name}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <RiskBadge level={location.riskLevel} />
                <button
                  onClick={() => setHudExpanded(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  title="Collapse Panel"
                >
                  ◀
                </button>
              </div>
            </div>

            {/* Selected Feature / Pin Inspector (If pin clicked, or defaults to village) */}
            {selectedEntity && (
              <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                    📌 {selectedEntity.category || 'MAP FEATURE'}
                  </span>
                  {selectedEntity.id !== spatialEntities.village.id && (
                    <button
                      onClick={() => setSelectedEntity(spatialEntities.village)}
                      className="text-[9px] font-mono text-slate-400 hover:text-white underline"
                    >
                      Reset to Village
                    </button>
                  )}
                </div>
                <h5 className="text-xs font-black text-white">{selectedEntity.name}</h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">{selectedEntity.desc}</p>

                <div className="grid grid-cols-2 gap-1.5 pt-1 font-mono text-[10px]">
                  {selectedEntity.elevation && (
                    <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">ELEVATION:</span>
                      <span className="text-emerald-400 font-bold">{selectedEntity.elevation}</span>
                    </div>
                  )}
                  {selectedEntity.reading && (
                    <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">LIVE READING:</span>
                      <span className="text-cyan-300 font-bold">{selectedEntity.reading}</span>
                    </div>
                  )}
                </div>

                <div className="p-2 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-[10px] text-cyan-200">
                  <strong className="text-cyan-300 block mb-0.5 uppercase">
                    {gisLang === 'hi' ? 'निर्देश:' : 'DIRECTIVE:'}
                  </strong>
                  {selectedEntity.action || 'Continue normal spatial situational monitoring.'}
                </div>
              </div>
            )}

            {/* Real-time Physical Telemetry */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                {gisLang === 'hi' ? 'जमीनी टेलीमेट्री' : 'LIVE HYDROLOGIC TELEMETRY'}
              </span>

              {/* River Status */}
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                <Waves className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-slate-400 text-[9px] uppercase font-bold font-mono">
                    {gisLang === 'hi' ? 'नदी जलस्तर' : 'RIVER STAGE & SURGE'}
                  </div>
                  <div className="text-slate-200 font-bold text-xs mt-0.5 font-mono">
                    {location.riverStage} • Rain: {location.rainfall3h}
                  </div>
                  <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                    {isHighRisk 
                      ? (gisLang === 'hi' ? '⚠️ नदी जलस्तर तेजी से बढ़ रहा है (+0.40m/h)' : '⚠️ River surging rapidly (+0.40m/h)')
                      : (gisLang === 'hi' ? 'प्रवाह सामान्य गति से जारी' : 'Normal stable channel flow')}
                  </div>
                </div>
              </div>

              {/* Lead Time & Warning */}
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                <Clock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-slate-400 text-[9px] uppercase font-bold font-mono">
                    {gisLang === 'hi' ? 'चेतावनी अग्रिम समय' : 'EARLY WARNING LEAD TIME'}
                  </div>
                  <div className="text-white font-black text-xs mt-0.5 font-mono">
                    {isHighRisk ? `${location.leadTimeMinutes} MIN ADVANCE WARNING` : 'NORMAL MONITORING'}
                  </div>
                  <div className="text-[10px] text-rose-300 font-bold font-mono mt-0.5">
                    {isHighRisk 
                      ? (gisLang === 'hi' ? 'निचले मार्ग बंद हैं! लता हाई रिज पथ से निकलें।' : 'Avoid low riverbed! Evacuate uphill to Lata Ridge.')
                      : (gisLang === 'hi' ? 'मार्ग खुले हैं।' : 'All pathways clear.')}
                  </div>
                </div>
              </div>

              {/* Designated Evacuation Shelter Vector */}
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/40 flex items-start gap-2">
                <Navigation className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-slate-400 text-[9px] uppercase font-bold font-mono">
                    {gisLang === 'hi' ? 'नामित शरण स्थल' : 'DESIGNATED ASSEMBLY SHELTER'}
                  </div>
                  <div className="text-emerald-300 font-bold text-xs mt-0.5 truncate font-mono">
                    {spatialEntities.primaryShelter.name}
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                    {isRaini 
                      ? (gisLang === 'hi' ? '+320m ऊंचाई (लता पठार) · 1.4 किमी (20 मिनट)' : '+320m Elevation Gain (Lata Plateau) · 1.4 km (20 min uphill walk)')
                      : (gisLang === 'hi' ? '+150m ऊंचाई · 1.2 किमी (14 मिनट)' : '+150m Ridge Spur · 1.2 km (14 min walk)')}
                  </div>
                </div>
              </div>

              {/* Provenance & Illustrative Disclaimer Banner */}
              <div className="px-2.5 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[9px] font-mono text-amber-300/90 leading-tight">
                ⚠️ <strong>OVERLAY FIDELITY:</strong> Flood corridor &amp; river centerline are illustrative hydraulic estimates (not survey-grade LiDAR/DEM simulations).
              </div>
            </div>

            {/* Quick Action Button */}
            <a
              href="/safety"
              className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono text-center flex items-center justify-center gap-1.5 shadow-lg transition active:scale-95"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{gisLang === 'hi' ? 'मार्ग गाइड (HUD)' : 'OPEN ESCAPE GUIDANCE HUD'}</span>
            </a>
          </div>
        ) : (
          /* Collapsed Pill Button on Left */
          <button
            onClick={() => setHudExpanded(true)}
            className="pointer-events-auto px-3 py-2 rounded-xl bg-slate-950/95 border border-cyan-500/50 text-cyan-300 hover:text-white shadow-2xl flex items-center gap-2 text-xs font-mono font-bold transition active:scale-95"
          >
            <span className={`w-2 h-2 rounded-full ${isHighRisk ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
            <span>GIS INFO &amp; GROUND SITUATION</span>
            <span className="text-[10px] text-cyan-400">▶</span>
          </button>
        )}
      </div>

      {/* ── ON-MAP EXPLANATORY SPATIAL GUIDE / LEGEND (Bottom Right) ── */}
      <div className="absolute bottom-8 right-3 z-[400] hidden lg:flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-950/95 border border-cyan-500/30 backdrop-blur-xl shadow-2xl text-[10px] font-mono pointer-events-auto max-w-[310px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-0.5">
          <span className="text-cyan-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
            <span>🗺️</span>
            <span>HYDRAULIC &amp; REFUGE GUIDE</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
            {location.name.split('/')[0].trim()}
          </span>
        </div>
        <div className="space-y-1.5">
          {/* 3-zone flood risk */}
          {isRaini && (
            <>
              <div className="flex items-start gap-2">
                <span className="w-3.5 h-2 rounded bg-red-600/70 border border-red-500 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-tight">
                  <b className="text-red-400">🔴 Zone 1 — ACTIVE INUNDATION:</b> Gorge floor (2.0–4.5m depth). Certain fatality.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-3.5 h-2 rounded bg-orange-500/60 border border-orange-400 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-tight">
                  <b className="text-orange-400">🟠 Zone 2 — HIGH SURGE REACH:</b> Low terraces (0.6–2.0m). Evacuate.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-3.5 h-2 rounded bg-yellow-400/40 border border-yellow-400 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-tight">
                  <b className="text-yellow-400">🟡 Zone 3 — CAUTION:</b> Slope toes, debris splash (&lt;0.5m). Prepare.
                </div>
              </div>
              <div className="border-t border-slate-800 pt-1.5 mt-1" />
            </>
          )}
          {isGuwahati && (
            <>
              <div className="flex items-start gap-2">
                <span className="w-3.5 h-2 rounded bg-red-600/70 border border-red-500 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-tight">
                  <b className="text-red-400">🔴 Zone 1 — ACTIVE INUNDATION:</b> Brahmaputra riverfront &amp; Bharalu backflow (2.0–3.5m).
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-3.5 h-2 rounded bg-orange-500/60 border border-orange-400 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-tight">
                  <b className="text-orange-400">🟠 Zone 2 — SURGE BUFFER:</b> Anil Nagar, Hatigaon lowlands (0.8–1.8m).
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-3.5 h-2 rounded bg-yellow-400/40 border border-yellow-400 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-tight">
                  <b className="text-yellow-400">🟡 Zone 3 — CAUTION:</b> Hill foothills &amp; drainage perimeter (&lt;0.5m).
                </div>
              </div>
              <div className="border-t border-slate-800 pt-1.5 mt-1" />
            </>
          )}
          {!isRaini && !isGuwahati && (
            <>
              <div className="flex items-start gap-2">
                <span className="w-3.5 h-2 rounded bg-red-600/70 border border-red-500 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-tight">
                  <b className="text-red-400">🔴 Zone 1 — ACTIVE INUNDATION:</b> Floodplain floor (1.5–3.5m). Evacuate.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-3.5 h-2 rounded bg-orange-500/60 border border-orange-400 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-tight">
                  <b className="text-orange-400">🟠 Zone 2 — SURGE BUFFER:</b> Low terraces (0.5–1.5m). Prepare.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-3.5 h-2 rounded bg-yellow-400/40 border border-yellow-400 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-tight">
                  <b className="text-yellow-400">🟡 Zone 3 — CAUTION:</b> Slope toes, debris splash (&lt;0.5m). Monitor.
                </div>
              </div>
              <div className="border-t border-slate-800 pt-1.5 mt-1" />
            </>
          )}
          <div className="flex items-start gap-2">
            <span className="w-3.5 h-1 rounded bg-[#38bdf8] shrink-0 mt-1" />
            <div className="text-slate-300 leading-tight">
              <b className="text-sky-400">{isGuwahati ? 'Brahmaputra River' : isRaini ? 'Dhauliganga' : `${location.region.split('(')[0].trim()} Waterway`}:</b> Flowing downstream. ▶ = surge direction.
            </div>
          </div>
          {spatialEntities.tributaryVector && (
            <div className="flex items-start gap-2">
              <span className="w-3.5 h-1 rounded bg-[#fb923c] border border-dashed border-orange-400 shrink-0 mt-1" />
              <div className="text-slate-300 leading-tight">
                <b className="text-amber-400">{isGuwahati ? 'Bharalu Stormwater Backflow' : 'Rishiganga Surge'}:</b> {isGuwahati ? 'Urban flood backflow channel' : 'Glacial debris flow tributary'}.
              </div>
            </div>
          )}
          <div className="flex items-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-300 shrink-0 mt-0.5" />
            <div className="text-slate-300 leading-tight">
              <b className="text-emerald-300">Designated Shelter:</b> {isRaini ? 'Lata Village FLAT TERRACE (+340m · 2,380m ASL)' : isGuwahati ? 'Kamakhya Nilachal Hilltop Refuge (+160m · 215m ASL)' : 'Elevated Ridge Refuge (Point-in-Polygon verified)'}.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-3.5 h-0.5 border-t-2 border-dashed border-emerald-400 shrink-0 mt-1.5" />
            <div className="text-slate-300 leading-tight">
              <b className="text-emerald-400">Escape Route:</b> {isGuwahati ? 'Kamakhya Access Road uphill' : isRaini ? 'Switchback trail to Lata terrace' : 'GIS-routed high-ground trail'}.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-3.5 h-0.5 border-t-2 border-dashed border-rose-500 shrink-0 mt-1.5" />
            <div className="text-slate-400 leading-tight">
              <b className="text-rose-400">Blocked Vector:</b> {isGuwahati ? 'MG Road riverfront causeway (submerged)' : 'Low riverbed crossing (submerged)'}.
            </div>
          </div>
          {/* Data status banner */}
          <div className="border-t border-slate-800 pt-1.5 mt-1">
            <div className="text-[9px] font-mono bg-slate-900 rounded px-2 py-1 border border-amber-500/40 text-amber-300 text-center leading-tight">
              ⚡ HYBRID: Real GIS + Simulated Flood Scenario<br/>
              <span className="text-slate-500">{osmWaterways.length > 0 ? `✅ OSM river geometry (${osmWaterways.length} segments)` : '⏳ OSM loading...'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HyperLocalRealMap;
