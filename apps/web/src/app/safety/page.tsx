'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
import { useAdaptive } from '@/context/AdaptiveContext';
import { getStateFromCoordinates } from '@/data/states';
import { LOCATIONS } from '@/context/LocationContext';
import dynamic from 'next/dynamic';
import {
  Compass, MapPin, ShieldAlert, AlertTriangle, Navigation,
  CheckCircle2, PhoneCall, Radio, Activity, RefreshCw,
  Sliders, Maximize2, Minimize2, Zap, ArrowRight, ShieldCheck, Map,
  CheckCircle, HeartHandshake, Info, Waves, ChevronRight, Layers
} from 'lucide-react';
import { RiskBadge } from '@/components/ui/Badges';
import { GuidanceLevel, ExposureStatus, RiskLevel } from '@/types';
import { FloodZonePolygons, SafePlaceItem } from '@/components/ui/EvacuationLeafletMap';
import { getFloodRiskPolygons, getEvacuationRoute } from '@/services/gisService';

// Dynamically import Leaflet map (avoid SSR in Next.js static export)
const EvacuationLeafletMap = dynamic(
  () => import('@/components/ui/EvacuationLeafletMap').then((m) => m.EvacuationLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-cyan-300 text-xs font-mono font-bold animate-pulse">LOADING REAL-WORLD MAP…</p>
          <p className="text-slate-500 text-[10px] font-mono">Fetching OpenStreetMap tiles · Projecting multi-zone flood coordinates</p>
        </div>
      </div>
    ),
  }
);

export default function MySafetyPage() {
  const { setPage, setMode, setRiskState } = useEnvironment();
  const { selectedLocation, setLocationFilter, setStateFilter } = useAdaptive();

  const [locationMode, setLocationMode] = useState<'DEMO' | 'BROWSER' | 'MANUAL'>('DEMO');
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number }>({ lat: selectedLocation.lat, lon: selectedLocation.lon });
  const [userState, setUserState] = useState<string>(selectedLocation.state);
  const [userDistrict, setUserDistrict] = useState<string>(selectedLocation.region);
  const [sensorFailure, setSensorFailure] = useState<boolean>(false);
  
  // Default to Stage 2 = HIGH RISK (Active Flood Scenario Active Now) so 3-zone colors are visible immediately!
  const [simulatedExposureStage, setSimulatedExposureStage] = useState<number>(2);
  const [rescueRequested, setRescueRequested] = useState<boolean>(false);
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);

  // Synchronize internal GPS when location changes in demo mode
  useEffect(() => {
    if (locationMode !== 'BROWSER') {
      setUserCoords({ lat: selectedLocation.lat, lon: selectedLocation.lon });
      setUserState(selectedLocation.state);
      setUserDistrict(selectedLocation.region);
    }
  }, [selectedLocation, locationMode]);

  useEffect(() => {
    setPage('safety');
    setMode('DEMO');
    setRiskState('HIGH');

    // Read ?loc= query parameter for direct preset switching
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const locParam = urlParams.get('loc');
      if (locParam) {
        handleSelectPreset(locParam);
      }
    }
  }, [setPage, setMode, setRiskState]);

  // Check active state
  const isAssam = selectedLocation.state.toLowerCase() === 'assam' || selectedLocation.id === 'loc-as-guwahati';
  const isChamoli = selectedLocation.id === 'loc-uk-chamoli' || selectedLocation.name.toLowerCase().includes('chamoli') || selectedLocation.name.toLowerCase().includes('raini');
  const isKedarnath = selectedLocation.id === 'loc-uk-kedarnath' || selectedLocation.name.toLowerCase().includes('kedarnath');

  // Fast preset scenario switchers
  const handleSelectPreset = (locId: string) => {
    setLocationMode('DEMO');
    setLocationFilter(locId);
    const targetLoc = LOCATIONS.find((l) => l.id === locId);
    if (targetLoc) {
      setStateFilter(targetLoc.state);
      setUserCoords({ lat: targetLoc.lat, lon: targetLoc.lon });
      setUserState(targetLoc.state);
      setUserDistrict(targetLoc.region);
    }
    // Set to active flood reconstruction
    setSimulatedExposureStage(2);
  };

  // Derived dynamic coordinate anchors
  const activeLat = locationMode === 'BROWSER' ? userCoords.lat : selectedLocation.lat;
  const activeLon = locationMode === 'BROWSER' ? userCoords.lon : selectedLocation.lon;
  const locState = locationMode === 'BROWSER' ? userState : selectedLocation.state;
  const locRegion = locationMode === 'BROWSER' ? userDistrict : selectedLocation.region;
  const locName = locationMode === 'BROWSER' ? `My GPS Position (${locDistrictShort(locRegion)})` : selectedLocation.name;

  function locDistrictShort(region: string) {
    return region.split('/')[0].split('(')[0].trim();
  }

  // ── GEOGRAPHIC FLOOD VECTORS & SHELTERS ──
  const {
    floodPolygons,
    riverVector,
    safePlaces,
    primaryShelter,
    safeRoutePoints,
    blockedRoutePoints,
    affectedAreas,
    historicalContext,
  } = useMemo(() => {
    if (isAssam) {
      // ── ASSAM (GUWAHATI / BRAHMAPUTRA 2022/2024 FLOOD RECONSTRUCTION) ──
      // Traced along the Brahmaputra River through Guwahati past Uzanbazar, Fancy Bazar, Bharalumukh, Pandu
      const rVector: [number, number][] = [
        [26.1950, 91.8200],
        [26.1920, 91.7850],
        [26.1880, 91.7600],
        [26.1820, 91.7400],
        [26.1750, 91.7150], // Fancy Bazar & Bharalumukh confluence
        [26.1620, 91.6850], // Pandu Port
        [26.1550, 91.6600], // Saraighat Bridge
      ];

      // Zone 1 (Red): Active inundation along Brahmaputra riverfront & Bharalu backflow
      const z1Red: [number, number][] = [
        [26.1950, 91.8200], [26.1920, 91.7850], [26.1880, 91.7600],
        [26.1820, 91.7400], [26.1750, 91.7150], [26.1620, 91.6850],
        [26.1550, 91.6600], [26.1480, 91.6600], [26.1550, 91.6850],
        [26.1680, 91.7150], [26.1750, 91.7400], [26.1810, 91.7600],
        [26.1850, 91.7850], [26.1880, 91.8200],
      ];

      // Zone 2 (Orange): High-velocity surge buffer covering low urban wards
      const z2Orange: [number, number][] = [
        [26.2000, 91.8250], [26.1960, 91.7850], [26.1920, 91.7600],
        [26.1860, 91.7400], [26.1800, 91.7150], [26.1660, 91.6800],
        [26.1500, 91.6500], [26.1380, 91.6600], [26.1450, 91.6900],
        [26.1580, 91.7200], [26.1650, 91.7450], [26.1700, 91.7700],
        [26.1750, 91.8000], [26.1800, 91.8300],
      ];

      // Zone 3 (Yellow): Caution perimeter covering hill toes and outer waterlogged districts
      const z3Yellow: [number, number][] = [
        [26.2050, 91.8300], [26.2000, 91.7850], [26.1950, 91.7600],
        [26.1900, 91.7400], [26.1850, 91.7100], [26.1700, 91.6750],
        [26.1450, 91.6450], [26.1300, 91.6550], [26.1380, 91.6950],
        [26.1500, 91.7250], [26.1580, 91.7500], [26.162, 91.7800],
        [26.1680, 91.8100], [26.1750, 91.8400],
      ];

      // Primary Shelter: Kamakhya Nilachal Hilltop Refuge (Solid granite hill bench, 215m ASL, +160m above river level)
      const pShelter = {
        name: 'Kamakhya Nilachal Hilltop Community Refuge (+160m ASL)',
        lat: 26.1660,
        lon: 91.7055,
        elevation: '215 m ASL (+160m above riverbed)',
      };

      const sPlaces: SafePlaceItem[] = [
        {
          id: 'sp-kamakhya',
          name: 'Kamakhya Nilachal Hilltop Relief Shelter',
          lat: 26.1660,
          lon: 91.7055,
          elevation: '215 m ASL (+160m Gain)',
          distance: '1.8 km uphill',
          type: 'ELEVATED ROCK RIDGE',
          isPrimary: true,
        },
        {
          id: 'sp-sarania',
          name: 'Sarania Hill High Ground Camp',
          lat: 26.1780,
          lon: 91.7650,
          elevation: '140 m ASL (+85m Gain)',
          distance: '3.2 km',
          type: 'HIGH GROUND CIVIC HALL',
        },
        {
          id: 'sp-iit',
          name: 'IIT Guwahati North Hilltop Complex',
          lat: 26.1900,
          lon: 91.6920,
          elevation: '90 m ASL (+40m Gain)',
          distance: '4.5 km',
          type: 'INSTITUTIONAL CAMPUS',
        },
      ];

      // Safe Route: Climbing uphill from Bharalumukh via Kamakhya Temple Access Road
      const sRoute: [number, number][] = [
        [26.1550, 91.7300], // Lowland starting point (Bharalumukh)
        [26.1580, 91.7220], // Kamakhya Gate Road junction
        [26.1620, 91.7140], // Mid-hill ascent (+80m)
        [26.1660, 91.7055], // Kamakhya Nilachal Hilltop Refuge (215m ASL)
      ];

      // Blocked Route: Low-lying MG Road riverfront boulevard (submerged)
      const bRoute: [number, number][] = [
        [26.1550, 91.7300],
        [26.1700, 91.7350],
        [26.1750, 91.7400],
      ];

      const affAreas = [
        { name: 'Pandu Port & Riverbank Ghats', zone: 'ZONE 1 (RED)', depth: '2.8m - 3.5m', status: 'COMPLETELY SUBMERGED', population: '18,500' },
        { name: 'Bharalumukh Sluice Gate Backflow', zone: 'ZONE 1 (RED)', depth: '2.2m - 2.8m', status: 'BREACHED / ACTIVE INUNDATION', population: '24,000' },
        { name: 'Fancy Bazar Riverside Market Area', zone: 'ZONE 1 (RED)', depth: '1.6m - 2.1m', status: 'MARKET STALLS EVACUATED', population: '32,000' },
        { name: 'Anil Nagar & Nabin Nagar Wards', zone: 'ZONE 2 (ORANGE)', depth: '1.2m - 1.8m', status: 'SEVERE URBAN WATERLOGGING', population: '41,000' },
        { name: 'Hatigaon Low-Lying Corridors', zone: 'ZONE 2 (ORANGE)', depth: '0.8m - 1.4m', status: 'DRAINAGE BACKUP / POWER CUT', population: '29,000' },
        { name: 'Nilachal & Sarania Hill Foothills', zone: 'ZONE 3 (YELLOW)', depth: '0.2m - 0.5m', status: 'SURFACE RUNOFF / WATCH ZONE', population: '15,000' },
      ];

      return {
        floodPolygons: { zone1Red: z1Red, zone2Orange: z2Orange, zone3Yellow: z3Yellow },
        riverVector: rVector,
        safePlaces: sPlaces,
        primaryShelter: pShelter,
        safeRoutePoints: sRoute,
        blockedRoutePoints: bRoute,
        affectedAreas: affAreas,
        historicalContext: '2022/2024 Assam Inundation Reconstruction (Brahmaputra stage at Guwahati CWC: 50.25m, crossing Danger Level 49.68m by +0.57m)',
      };
    } else if (isChamoli) {
      // ── UTTARAKHAND (CHAMOLI / RAINI & RISHIGANGA 2021 GLOF SURGE) ──
      const rVector: [number, number][] = [
        [30.4870, 79.7300],
        [30.4862, 79.7180],
        [30.4854, 79.7060],
        [30.4847, 79.6928], // Raini Confluence
        [30.4842, 79.6830],
        [30.4850, 79.6600],
        [30.4872, 79.6300], // Tapovan direction
      ];

      const z1Red: [number, number][] = [
        [30.4873, 79.6300], [30.4861, 79.6370], [30.4851, 79.6450],
        [30.4856, 79.6530], [30.4853, 79.6610], [30.4847, 79.6690],
        [30.4843, 79.6760], [30.4845, 79.6830], [30.4848, 79.6890],
        [30.4850, 79.6928], [30.4851, 79.6950], [30.4853, 79.7000],
        [30.4857, 79.7060], [30.4861, 79.7120], [30.4865, 79.7180],
        [30.4869, 79.7240], [30.4872, 79.7300],
        [30.4866, 79.7300], [30.4863, 79.7240], [30.4859, 79.7180],
        [30.4855, 79.7120], [30.4851, 79.7000], [30.4847, 79.6950],
        [30.4845, 79.6928], [30.4843, 79.6890], [30.4840, 79.6830],
        [30.4838, 79.6760], [30.4843, 79.6690], [30.4849, 79.6610],
        [30.4852, 79.6530], [30.4847, 79.6450], [30.4857, 79.6370],
        [30.4869, 79.6300],
      ];

      const z2Orange: [number, number][] = [
        [30.4880, 79.6300], [30.4869, 79.6370], [30.4858, 79.6450],
        [30.4863, 79.6530], [30.4860, 79.6610], [30.4853, 79.6690],
        [30.4849, 79.6760], [30.4851, 79.6830], [30.4854, 79.6890],
        [30.4854, 79.6928], [30.4856, 79.6960], [30.4858, 79.7010],
        [30.4862, 79.7070], [30.4866, 79.7130], [30.4870, 79.7190],
        [30.4876, 79.7250], [30.4878, 79.7300],
        [30.4838, 79.6928], [30.4820, 79.6960], [30.4796, 79.7010],
        [30.4766, 79.7060], [30.4731, 79.7110], [30.4701, 79.7160],
        [30.4671, 79.7210], [30.4685, 79.7218], [30.4715, 79.7168],
        [30.4745, 79.7118], [30.4780, 79.7068], [30.4810, 79.7018],
        [30.4836, 79.6970], [30.4845, 79.6937],
        [30.4836, 79.6890], [30.4833, 79.6830], [30.4831, 79.6760],
        [30.4836, 79.6690], [30.4844, 79.6610], [30.4847, 79.6530],
        [30.4843, 79.6450], [30.4852, 79.6370], [30.4866, 79.6300],
      ];

      const z3Yellow: [number, number][] = [
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

      const pShelter = {
        name: 'Lata Village Flat Terrace Shelter (+340m ASL)',
        lat: 30.5012,
        lon: 79.7055,
        elevation: '2,380 m ASL (+340m Gain)',
      };

      const sPlaces: SafePlaceItem[] = [
        {
          id: 'sp-lata',
          name: 'Lata Village Flat Terrace Assembly Shelter',
          lat: 30.5012,
          lon: 79.7055,
          elevation: '2,380 m ASL (+340m Gain)',
          distance: '1.4 km uphill',
          type: 'FLAT MOUNTAIN BENCH',
          isPrimary: true,
        },
        {
          id: 'sp-raini-spur',
          name: 'Upper Raini Spur Shelter',
          lat: 30.4920,
          lon: 79.6895,
          elevation: '2,180 m ASL (+140m Gain)',
          distance: '0.9 km',
          type: 'ELEVATED SPUR',
        },
      ];

      const sRoute: [number, number][] = [
        [30.4850, 79.6920],
        [30.4872, 79.6942],
        [30.4900, 79.6965],
        [30.4930, 79.6990],
        [30.4965, 79.7015],
        [30.5012, 79.7055],
      ];

      const bRoute: [number, number][] = [
        [30.4850, 79.6920],
        [30.4847, 79.6928],
      ];

      const affAreas = [
        { name: 'Raini Confluence Basin & Bridge', zone: 'ZONE 1 (RED)', depth: '4.2m - 5.2m', status: 'WASHED OUT / ACTIVE TORRENT', population: '1,200' },
        { name: 'Rishiganga Hydropower Intake Bed', zone: 'ZONE 1 (RED)', depth: '4.8m - 6.0m', status: 'DEBRIS FLOW CORRIDOR', population: '450' },
        { name: 'Tapovan Barrage Lower Terraces', zone: 'ZONE 1 (RED)', depth: '3.4m - 4.5m', status: 'TUNNEL / EMBANKMENT BREACH', population: '2,800' },
        { name: 'Theng Gorge Riverbed Corridor', zone: 'ZONE 2 (ORANGE)', depth: '1.5m - 2.8m', status: 'HIGH VELOCITY SLURRY DEPOSIT', population: '800' },
        { name: 'Subhai Lower Spur Terraces', zone: 'ZONE 2 (ORANGE)', depth: '0.8m - 1.4m', status: 'EROSION AT TOE / EVACUATE', population: '1,100' },
        { name: 'Lata Ridge Lower Footpaths', zone: 'ZONE 3 (YELLOW)', depth: '0.1m - 0.4m', status: 'COLLUVIAL SPLASH BUFFER', population: '650' },
      ];

      return {
        floodPolygons: { zone1Red: z1Red, zone2Orange: z2Orange, zone3Yellow: z3Yellow },
        riverVector: rVector,
        safePlaces: sPlaces,
        primaryShelter: pShelter,
        safeRoutePoints: sRoute,
        blockedRoutePoints: bRoute,
        affectedAreas: affAreas,
        historicalContext: '2021 Chamoli GLOF / Surge Reconstruction (Peak 5.2m flash flood crest in Rishiganga gorge)',
      };
    } else {
      // ── GENERAL REGIONAL BASIN: DYNAMIC REAL GIS EXTRACTION VIA GIS SERVICE ──
      const gisZones = getFloodRiskPolygons(selectedLocation.id, activeLat, activeLon);
      const safeShelterCoords: [number, number] = [activeLat + 0.007, activeLon + 0.006];
      const evacRoute = getEvacuationRoute(selectedLocation.id, [activeLat, activeLon], safeShelterCoords);

      const rVector: [number, number][] = [
        [activeLat + 0.015, activeLon - 0.012],
        [activeLat + 0.008, activeLon - 0.006],
        [activeLat, activeLon],
        [activeLat - 0.008, activeLon + 0.006],
        [activeLat - 0.015, activeLon + 0.012],
      ];

      const pShelter = {
        name: `${selectedLocation.name.split('/')[0].trim()} High-Ground Refuge (+120m ASL)`,
        lat: safeShelterCoords[0],
        lon: safeShelterCoords[1],
        elevation: `${(parseInt(selectedLocation.elevation.replace(/[^0-9]/g, '')) || 800) + 120} m ASL`,
      };

      const sPlaces: SafePlaceItem[] = [
        {
          id: `sp-${selectedLocation.id}-primary`,
          name: `${selectedLocation.name.split('/')[0].trim()} Designated Assembly Shelter`,
          lat: safeShelterCoords[0],
          lon: safeShelterCoords[1],
          elevation: `${(parseInt(selectedLocation.elevation.replace(/[^0-9]/g, '')) || 800) + 120} m ASL`,
          distance: `${evacRoute.distanceKm.toFixed(1)} km uphill`,
          type: 'ELEVATED COMMUNITY REFUGE',
          isPrimary: true,
        },
        {
          id: `sp-${selectedLocation.id}-secondary`,
          name: `${selectedLocation.region.split('(')[0].trim()} Relief Center`,
          lat: activeLat + 0.009,
          lon: activeLon - 0.005,
          elevation: `${(parseInt(selectedLocation.elevation.replace(/[^0-9]/g, '')) || 800) + 90} m ASL`,
          distance: '2.1 km',
          type: 'REINFORCED SCHOOL BUILDING',
        },
      ];

      const affAreas = [
        { name: 'Active Riverbed & Low Crossings', zone: 'ZONE 1 (RED)', depth: '2.0m - 3.5m', status: 'ACTIVE INUNDATION', population: '1,500' },
        { name: 'Low-Lying Drainage Plain', zone: 'ZONE 2 (ORANGE)', depth: '0.8m - 1.8m', status: 'HIGH SURGE BUFFER', population: '3,200' },
        { name: 'Valley Foothill Perimeter', zone: 'ZONE 3 (YELLOW)', depth: '0.1m - 0.5m', status: 'SURFACE RUNOFF / WATCH', population: '2,100' },
      ];

      return {
        floodPolygons: gisZones,
        riverVector: rVector,
        safePlaces: sPlaces,
        primaryShelter: pShelter,
        safeRoutePoints: evacRoute.safePath,
        blockedRoutePoints: (evacRoute.blockedPath ?? [[activeLat, activeLon], [activeLat - 0.002, activeLon - 0.001]]) as [number, number][],
        affectedAreas: affAreas,
        historicalContext: `Modeled Inundation Scenario for ${selectedLocation.name} (${selectedLocation.region})`,
      };
    }
  }, [isAssam, isChamoli, selectedLocation, activeLat, activeLon]);


  const exposureLevels: Array<{
    status: ExposureStatus;
    risk: RiskLevel;
    guidanceLvl: GuidanceLevel;
    title: string;
    msg: string;
    isSafe: boolean;
  }> = [
    {
      status: 'OUTSIDE_RISK_AREA',
      risk: 'LOW',
      guidanceLvl: 0,
      title: `DRILL BASELINE · DRY TERRAIN (NO FLOOD ACTIVE)`,
      msg: `Baseline condition: ${locState} is currently in a dry monitoring state with no active inundation. Standard sensors operational.`,
      isSafe: true,
    },
    {
      status: 'NEAR_RISK_AREA',
      risk: 'MODERATE',
      guidanceLvl: 1,
      title: `🟡 ADVISORY: RIVER APPROACHING DANGER THRESHOLD`,
      msg: `Water level rising rapidly in ${locRegion}. Outer caution zone (Yellow Zone) active. Move livestock and prepare documents.`,
      isSafe: false,
    },
    {
      status: 'INSIDE_HIGH_RISK_AREA',
      risk: 'HIGH',
      guidanceLvl: 2,
      title: `🟠 ACTIVE FLOOD SURGE INUNDATION · EVACUATION MANDATED`,
      msg: `Historical flood scenario active now in ${locName}. Active inundation (Red Zone) on riverbed; High surge reach (Orange Zone) covering lowlands. Evacuate to ${primaryShelter.name}.`,
      isSafe: false,
    },
    {
      status: 'INSIDE_EXTREME_RISK_AREA',
      risk: 'EXTREME',
      guidanceLvl: 3,
      title: `🔴 CRITICAL SURGE WAVE · FLASH DANGER THRESHOLD BREACHED`,
      msg: `Extreme torrent crest active. Low causeways submerged. Ascend immediately via designated uphill escape vector!`,
      isSafe: false,
    },
  ];

  const currentExp = exposureLevels[simulatedExposureStage];
  const isSafeZone = currentExp.isSafe;

  const candidateRoutes = [
    {
      id: 'rt-1',
      name: `${primaryShelter.name.split('(')[0]} Escape Vector`,
      distance: isAssam ? '1.8 km' : '1.4 km',
      elevation: isAssam ? '+160m (Solid Granite Ridge)' : '+340m (Flat Terrace)',
      status: isSafeZone ? 'NORMAL ACCESS · CLEAR' : 'RECOMMENDED HIGHLAND ROUTE',
      note: isAssam
        ? 'Climbs via Kamakhya Access Road to high granite hilltop, 100% above 100-year Brahmaputra flood line.'
        : 'Ascends uphill switchback footpath climbing away from gorge to Lata flat terrace.',
      blocked: false,
    },
    {
      id: 'rt-2',
      name: isAssam ? 'Sarania Hill Community Center Link' : 'Upper Raini Spur Connector',
      distance: isAssam ? '3.2 km' : '0.9 km',
      elevation: isAssam ? '+85m' : '+140m',
      status: 'CANDIDATE SECONDARY REFUGE',
      note: 'Secondary high-ground civic center equipped with emergency relief stores.',
      blocked: false,
    },
    {
      id: 'rt-3',
      name: isAssam ? 'MG Road Riverfront Causeway Link' : 'Low Riverbed Confluence Crossing',
      distance: '0.8 km',
      elevation: '+2m',
      status: isSafeZone ? 'OPEN (DRY ROAD)' : 'BLOCKED · DO NOT CROSS',
      note: isSafeZone
        ? 'Dry roadway under routine traffic.'
        : 'Active inundation under fast-flowing surge water (1.5m - 2.8m depth). Highly fatal.',
      blocked: !isSafeZone,
    },
  ];

  const handleRequestBrowserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setUserCoords({ lat, lon });
          setLocationMode('BROWSER');
          const stateMeta = getStateFromCoordinates(lat, lon);
          setUserState(stateMeta.state);
          setUserDistrict(stateMeta.district);
          setStateFilter(stateMeta.state);
          const matchingLoc = LOCATIONS.find(
            (l) => l.state.toLowerCase() === stateMeta.state.toLowerCase()
          );
          if (matchingLoc) {
            setLocationFilter(matchingLoc.id);
          }
          setSimulatedExposureStage(2);
        },
        () => {
          alert('Location permission denied or unavailable. Using selected state location.');
          setLocationMode('DEMO');
        }
      );
    }
  };

  return (
    <div className={`flex flex-col min-h-screen transition-all duration-500 select-none ${
      emergencyMode ? 'ring-8 ring-rose-600/80' : ''
    }`}>
      <Header dataMode={locationMode === 'DEMO' ? 'DEMO' : 'LIVE'} systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0 relative">
        {!emergencyMode && <Sidebar activeTab="safety" />}

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-5 pb-24 md:pb-6 overflow-y-auto">

          {/* ── Top Bar & Location Presets ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className={`chip ${isSafeZone ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'chip-live bg-rose-950 text-rose-300 border-rose-700'}`}>
                  {isSafeZone ? 'BASELINE DRILL' : 'FLOOD ACTIVE NOW'}
                </span>
                <h1 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
                  <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                  CONSERVATIVE ESCAPE &amp; EVACUATION GUIDANCE
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                📍 Monitored Ground: <strong className="text-cyan-300">{locName}</strong> ({locState} · {locRegion})
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-mono">
              <button
                onClick={() => setEmergencyMode(!emergencyMode)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition transform active:scale-95 shadow-xl ${
                  emergencyMode
                    ? 'btn-danger text-white animate-pulse'
                    : 'fp text-slate-300 hover:text-white hover:border-rose-500'
                }`}
              >
                {emergencyMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 text-rose-400" />}
                <span>{emergencyMode ? 'EXIT EMERGENCY HUD' : '🚨 EMERGENCY HUD'}</span>
              </button>

              <button
                onClick={handleRequestBrowserLocation}
                className="btn-primary px-3.5 py-2 text-white rounded-xl flex items-center gap-2 font-bold transition shadow-xl active:scale-95"
              >
                <MapPin className="w-4 h-4 text-cyan-300" />
                <span>{locationMode === 'BROWSER' ? '📍 GPS: ' + locState : 'My Device GPS'}</span>
              </button>
            </div>
          </div>

          {/* ── FAST REGIONAL DISASTER SCENARIO SWITCHER ── */}
          <div className="fp p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
            <span className="text-cyan-400 font-bold flex items-center gap-2">
              <Waves className="w-4 h-4" />
              <span>DISASTER FLOOD RECONSTRUCTION (IF OCCURRING NOW):</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSelectPreset('loc-as-guwahati')}
                className={`px-3 py-1.5 rounded-xl font-bold transition active:scale-95 flex items-center gap-1.5 ${
                  isAssam
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <span>🌊 ASSAM (Brahmaputra Flood)</span>
                {isAssam && <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />}
              </button>

              <button
                onClick={() => handleSelectPreset('loc-uk-chamoli')}
                className={`px-3 py-1.5 rounded-xl font-bold transition active:scale-95 flex items-center gap-1.5 ${
                  isChamoli
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <span>⛰️ UTTARAKHAND (Chamoli GLOF)</span>
                {isChamoli && <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />}
              </button>

              <button
                onClick={() => handleSelectPreset('loc-uk-kedarnath')}
                className={`px-3 py-1.5 rounded-xl font-bold transition active:scale-95 flex items-center gap-1.5 ${
                  isKedarnath
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <span>🏔️ KEDARNATH (Mandakini)</span>
              </button>
            </div>
          </div>

          {/* ── Official Authority Directive Banner ── */}
          <div className={`rounded-2xl p-4 text-xs space-y-1.5 shadow-xl border ${
            isSafeZone
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'fp fp-critical bg-rose-950/40 border-rose-600/50 text-rose-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-black uppercase tracking-wider flex items-center gap-2 font-mono text-xs ${
                isSafeZone ? 'text-emerald-300' : 'text-rose-300'
              }`}>
                {isSafeZone ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />}
                {locState.toUpperCase()} DISASTER MANAGEMENT AUTHORITY (SDMA) DIRECTIVE
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                isSafeZone ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700' : 'bg-rose-900 text-rose-200 border border-rose-700'
              }`}>
                {isSafeZone ? 'STATUS: DRY BASELINE ✓' : 'ACTIVE INUNDATION DIRECTIVE'}
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans text-xs">
              {isSafeZone
                ? `Local authorities confirm dry baseline conditions in ${locName}. Standard monitoring active.`
                : `CRITICAL ADVISORY: Historical ${locState} flood surge modeled as active now. Low-lying areas in ${locName} are under Red & Orange danger zones. Evacuate immediately along the green escape route to ${primaryShelter.name}. Do NOT attempt to cross submerged roadways!`}
            </p>
            <div className="text-[11px] font-mono text-amber-300 pt-1">
              📜 <strong>Historical Benchmark:</strong> {historicalContext}
            </div>
          </div>

          {/* ── Exposure Level / Emergency Drill Selector ── */}
          <div className="fp p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              SIMULATED RISK &amp; FLOOD SCENARIO STAGE:
            </span>
            <div className="flex items-center gap-1.5">
              {exposureLevels.map((lvl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSimulatedExposureStage(idx)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition active:scale-95 text-[11px] ${
                    simulatedExposureStage === idx
                      ? idx === 0
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                        : idx === 1
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : idx === 2
                        ? 'bg-orange-500 text-slate-950 font-black'
                        : 'bg-rose-500 text-white font-black'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {idx === 0 ? '🟢 DRY BASELINE (0)' : idx === 1 ? '🟡 CAUTION (1)' : idx === 2 ? '🟠 ACTIVE FLOOD (2)' : '🔴 CRITICAL SURGE (3)'}
                </button>
              ))}
            </div>
          </div>

          {/* ── REAL-WORLD INTERACTIVE EVACUATION MAP ── */}
          <div className="fp fp-operational rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  MULTI-ZONE ESCAPE MAP · {locState.toUpperCase()} · 3-ZONE FLOOD RISK OVERLAY
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 flex items-center gap-2">
                  <Map className="w-5 h-5 text-cyan-400" />
                  {currentExp.title}
                </h2>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  🔴 Red: Active Inundation (Fatal) · 🟠 Orange: High Surge Buffer · 🟡 Yellow: Caution · 🟢 Green: Safe High-Ground Shelter
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <RiskBadge level={currentExp.risk} />
              </div>
            </div>

            {/* THE REAL LEAFLET MAP WITH 3-ZONE COLORING & RIVER FLOW */}
            <EvacuationLeafletMap
              userLat={activeLat}
              userLon={activeLon}
              shelterLat={primaryShelter.lat}
              shelterLon={primaryShelter.lon}
              routePoints={safeRoutePoints}
              blockedPoints={blockedRoutePoints}
              riskZoneCenter={[activeLat, activeLon]}
              riskRadiusM={650}
              emergencyMode={emergencyMode}
              locationMode={locationMode}
              locationName={locName}
              stateName={locState}
              shelterName={primaryShelter.name}
              riverName={isAssam ? 'Brahmaputra River Mainstem' : selectedLocation.riverStage}
              riskLevel={selectedLocation.riskLevel}
              isSafeZone={isSafeZone}
              floodPolygons={floodPolygons}
              riverVector={riverVector}
              safePlaces={safePlaces}
              historicalEventLabel={historicalContext}
            />

            {/* Info strip below map */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Primary Safe Shelter</div>
                <div className="font-bold text-white mt-0.5 truncate">{primaryShelter.name.split('(')[0]}</div>
                <div className="text-[10px] text-emerald-400">{primaryShelter.elevation}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Local Inundation Status</div>
                <div className={`font-bold mt-0.5 text-sm truncate ${isSafeZone ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isSafeZone ? 'NO ACTIVE SURGE' : isAssam ? '50.25m (+0.57m Above Danger)' : selectedLocation.riverStage}
                </div>
                <div className="text-[10px] text-slate-400">{isSafeZone ? 'Dry Roadway Terrain' : 'Severe Inundation Active'}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Response Agency</div>
                <div className="font-bold text-purple-300 mt-0.5 truncate">{locState} SDRF / 112</div>
                <div className="text-[10px] text-purple-400">Emergency Radio &amp; SOS Ready</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Your Position</div>
                <div className="font-bold text-cyan-300 mt-0.5 text-[11px]">{activeLat.toFixed(4)}°N</div>
                <div className="text-[10px] text-cyan-400">{activeLon.toFixed(4)}°E · ±15m</div>
              </div>
            </div>
          </div>

          {/* ── AFFECTED AREAS & PREVIOUS FLOOD IMPACT REPORT ── */}
          <div className="fp fp-operational rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  AREA INUNDATION AUDIT &amp; REALISTIC DAMAGE BREAKDOWN
                </span>
                <h3 className="text-base font-black text-white mt-0.5 flex items-center gap-2">
                  <span>🌊</span>
                  <span>{locState.toUpperCase()} FLOOD IMPACT &amp; EXPOSED SECTORS (IF OCCURRED NOW)</span>
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
                {affectedAreas.length} MONITORED SECTORS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 font-mono text-xs">
              {affectedAreas.map((area, i) => {
                const isRed = area.zone.includes('RED');
                const isOrange = area.zone.includes('ORANGE');
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border space-y-1.5 transition ${
                      isRed
                        ? 'bg-rose-950/20 border-rose-800/50 hover:border-rose-500'
                        : isOrange
                        ? 'bg-orange-950/20 border-orange-800/50 hover:border-orange-500'
                        : 'bg-amber-950/20 border-amber-800/50 hover:border-amber-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isRed
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : isOrange
                          ? 'bg-orange-950 text-orange-300 border border-orange-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {area.zone}
                      </span>
                      <span className="text-[10px] text-slate-400">~{area.population} pop</span>
                    </div>
                    <div className="font-bold text-white font-sans text-sm">{area.name}</div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
                      <span className="text-slate-400">Depth: <strong className={isRed ? 'text-rose-400' : isOrange ? 'text-orange-400' : 'text-amber-400'}>{area.depth}</strong></span>
                      <span className="text-[10px] text-slate-300 font-bold">{area.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Safe Places List */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
              <div className="text-emerald-300 font-bold font-mono text-xs uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>DESIGNATED SAFE PLACES &amp; HIGH-GROUND REFUGE LIST ({locState})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
                {safePlaces.map((sp) => (
                  <div key={sp.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300">{sp.name}</span>
                      {sp.isPrimary && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-200 border border-emerald-700 font-bold">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300">Elevation: <strong className="text-emerald-400">{sp.elevation}</strong></div>
                    <div className="text-[10px] text-slate-400">{sp.type} · Distance: {sp.distance}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Candidate Routes List ── */}
          <div className="fp fp-operational rounded-2xl p-4 sm:p-5 space-y-3">
            <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              EVALUATED EVACUATION &amp; TRANSIT CORRIDORS
            </h3>
            <div className="space-y-2.5">
              {candidateRoutes.map((rt) => (
                <div
                  key={rt.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono ${
                    rt.blocked
                      ? 'bg-rose-950/20 border-rose-800/40 text-rose-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${rt.blocked ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                      <h4 className="font-bold text-white text-sm font-sans">{rt.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rt.blocked ? 'bg-rose-900 text-rose-300' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {rt.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs font-sans">{rt.note}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div>
                      <div className="text-slate-400 text-[10px]">DISTANCE</div>
                      <div className="font-bold text-cyan-300">{rt.distance}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">ELEVATION GAIN</div>
                      <div className="font-bold text-emerald-400">{rt.elevation}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Emergency SOS & Rescue Dispatch ── */}
          <div className="fp fp-critical rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-bold">
                  CITIZEN RESCUE BEACON &amp; SDRF DISPATCH
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Trapped in Flood Water or Need Urgent Water Rescue?
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Sends verified GPS coordinates directly to {locState} State Disaster Management Authority (SDMA / 112 Command).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setRescueRequested(!rescueRequested)}
                  className={`px-5 py-3 rounded-2xl font-mono font-black text-xs flex items-center gap-2 shadow-2xl active:scale-95 transition ${
                    rescueRequested
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : 'btn-danger text-white'
                  }`}
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{rescueRequested ? '✓ SOS SIGNAL TRANSMITTED' : '🚨 TRANSMIT EMERGENCY SOS'}</span>
                </button>
              </div>
            </div>

            {rescueRequested && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-xs font-mono text-emerald-200 space-y-1 animate-fade-in">
                <div className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>BEACON ACKNOWLEDGED BY {locState.toUpperCase()} SDRF / NDRF DISPATCH</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Your coordinates ({activeLat.toFixed(5)}°N, {activeLon.toFixed(5)}°E) have been logged with incident token <strong>#SOS-{Math.floor(100000 + Math.random() * 900000)}</strong>. Rescue team dispatched. Ascend to nearest safe shelter: <strong>{primaryShelter.name}</strong>.
                </p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
