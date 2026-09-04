'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { 
  MapPin, 
  ShieldAlert, 
  Compass, 
  Activity, 
  Home, 
  Waves, 
  CloudRain, 
  Mountain, 
  History, 
  Radio, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Building,
  PhoneCall,
  Flame,
  Globe,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Cpu,
  Footprints,
  Shield
} from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';
import { LOCATIONS, LocationDossier } from '@/context/LocationContext';

interface PillarData {
  pillar_id: string;
  pillar_name: string;
  status: string;
  weight_contribution_pct: number;
  [key: string]: any;
}

interface WardData {
  ward_id: string;
  name: string;
  elevation_m: number;
  slope_degrees: number;
  population: number;
  distance_to_river_m: number;
  exposure_zone: string;
  factor_of_safety_fos: number;
  risk_score: number;
  alert_stage: string;
  alert_meaning?: string;
  actionable_lead_time_minutes: number;
  evacuation_priority: string;
  designated_shelter: string;
  evacuation_trail: string;
}

export const VillageDossierClient: React.FC<{ params: { id: string } }> = ({ params }) => {
  const currentLoc = LOCATIONS.find((l) => l.id === params.id) || LOCATIONS[0];
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPillar, setSelectedPillar] = useState<number>(1);

  const zoneLabels: Record<string, string> = {
    HIMALAYAN_NORTH: 'Northern Himalayan Zone (Cloudburst / GLOF)',
    NORTHEAST_BRAHMAPUTRA: 'North-Eastern Brahmaputra Basin',
    WESTERN_GHATS_COASTAL: 'Western Ghats & Southern Coastal Escarpment',
    PENINSULAR_CENTRAL: 'Peninsular & Central River Basins',
    URBAN_METRO: 'Urban Metropolitan Flash Inundation',
    EASTERN_DELTA: 'Eastern Gangetic & Deltaic Plains',
  };

  const appLabels: Record<string, string> = {
    FLASH_FLOOD_CLOUDBURST: 'Orographic Cloudburst & Flash Surge',
    GLOF_GLACIAL_OUTBURST: 'Glacial Lake Outburst Flood (GLOF)',
    URBAN_STORMWATER_INUNDATION: 'Urban Stormwater & Drainage Backflow',
    DEBRIS_LANDSLIDE_CASCADE: 'Saturated Colluvial Debris Flow',
    RESERVOIR_DAM_SPILL: 'Dam Spillway & Reservoir Wave Propagation',
    COASTAL_ESTUARINE_SURGE: 'Tidal Lock & Cyclone Storm Surge',
  };

  useEffect(() => {
    let isMounted = true;
    const fetchForecast = async () => {
      try {
        const res = await fetch(`/api/v1/ndrf/villages/${params.id}/forecast`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setForecastData(json);
            setLoading(false);
          }
          return;
        }
      } catch (e) {
        // Fallback gracefully below
      }

      // Fallback: build comprehensive client-side 5-pillar representation
      if (isMounted) {
        const p1_rain = parseFloat(currentLoc.rainfall3h.replace(' mm', '')) || 42.0;
        const p2_soil = parseFloat(currentLoc.soilMoisture.replace('%', '')) / 100.0 || 0.78;
        const slope = 32.0;
        const fos = Number((Math.max(0.6, 1.45 - p2_soil * 0.9)).toFixed(2));
        const leadTime = currentLoc.leadTimeMinutes || 24;

        setForecastData({
          village_id: currentLoc.id,
          village: currentLoc.name,
          district: currentLoc.region.split(' ')[0] || 'District',
          state: currentLoc.state,
          risk_score: currentLoc.riskScore,
          alert_stage: currentLoc.riskScore >= 75 ? 'STAGE_4_EVACUATE' : (currentLoc.riskScore >= 55 ? 'STAGE_3_WARNING' : 'STAGE_2_ADVISORY'),
          lead_time_minutes: leadTime,
          multi_source_pillars: {
            pillar_1_rainfall: {
              pillar_id: 'PILLAR_1_RAINFALL',
              pillar_name: 'Rainfall Observation & QPE',
              rainfall_15m_mm: Number((p1_rain * 0.25).toFixed(1)),
              rainfall_1h_mm: p1_rain,
              rainfall_3h_mm: currentLoc.rainfall3h,
              rainfall_24h_mm: Number((p1_rain * 2.8).toFixed(1)),
              rainfall_peak_intensity_mmph: p1_rain,
              cloudburst_threshold_exceeded: p1_rain >= 50.0,
              source: 'IMD Doppler Weather Radar (DWR) + In-Situ AWS Network',
              status: 'ACTIVE_MONITORING',
              weight_contribution_pct: 35.0,
            },
            pillar_2_soil_moisture: {
              pillar_id: 'PILLAR_2_SOIL_MOISTURE',
              pillar_name: 'Soil Moisture Sensors & Saturation',
              volumetric_moisture_pct: Number((p2_soil * 52.0).toFixed(1)),
              soil_saturation_index: p2_soil,
              antecedent_7d_mm: Number((p1_rain * 5.2).toFixed(1)),
              effective_cohesion_kpa: Number((Math.max(2.0, 18.0 * (1.0 - p2_soil * 0.7))).toFixed(1)),
              sensor_technology: 'In-Situ TDR/Capacitive Sensors (10cm, 30cm, 50cm) + ECMWF Root-Zone',
              status: p2_soil >= 0.80 ? 'CRITICAL_SATURATION' : 'ELEVATED_MOISTURE',
              weight_contribution_pct: 25.0,
            },
            pillar_3_slope_stability: {
              pillar_id: 'PILLAR_3_SLOPE_STABILITY',
              pillar_name: 'Slope Stability Models (Limit Equilibrium)',
              slope_degrees: slope,
              elevation_m: parseFloat(currentLoc.elevation.replace(' m ASL', '').replace(',', '')) || 2040,
              factor_of_safety_fos: fos,
              topographic_wetness_index_twi: 8.4,
              critical_rainfall_threshold_mm: 55.0,
              stability_status: fos < 1.0 ? 'POTENTIALLY_UNSTABLE' : 'MARGINALLY_STABLE',
              model_framework: 'Infinite Slope Limit Equilibrium (SHALe/SLIP) + SRTM 30m DEM',
              weight_contribution_pct: 20.0,
            },
            pillar_4_landslide_inventory: {
              pillar_id: 'PILLAR_4_LANDSLIDE_INVENTORY',
              pillar_name: 'Historical Landslide Inventories & Susceptibility',
              gsi_susceptibility_index: 0.88,
              historical_events_in_basin: 28,
              last_major_disaster: 'Historical Himalayan Monsoon Surge',
              inventory_authority: 'Geological Survey of India (GSI) NLSM + NRSC Landslide Inventory',
              status: 'HIGH_SUSCEPTIBILITY_ZONE',
              weight_contribution_pct: 10.0,
            },
            pillar_5_iot_telemetry: {
              pillar_id: 'PILLAR_5_IOT_INPUTS',
              pillar_name: 'Real-Time IoT Inputs & Early Warning Telemetry',
              river_level_m: parseFloat(currentLoc.riverStage.split(' ')[0]) || 4.2,
              river_rate_of_rise_mph: 0.45,
              geophone_debris_vibration_db: 32.5,
              culvert_backpressure_ratio: 0.68,
              active_sensor_nodes: 4,
              mesh_network_status: 'ONLINE (LoRaWAN 865-867 MHz Gateway Active)',
              acoustic_warning_triggered: true,
              weight_contribution_pct: 10.0,
            },
          },
          uncertainty_aware_estimation: {
            point_risk_score: currentLoc.riskScore,
            uncertainty_margin: 14.5,
            ci_90: [Math.max(0, currentLoc.riskScore - 14.5), Math.min(100, currentLoc.riskScore + 14.5)],
            ci_90_formatted: `[${Math.max(0, currentLoc.riskScore - 14.5).toFixed(1)} – ${Math.min(100, currentLoc.riskScore + 14.5).toFixed(1)}]`,
            epistemic_uncertainty_score: 8.4,
            aleatoric_uncertainty_score: 12.0,
            conservative_upper_bound: Math.min(100, currentLoc.riskScore + 14.5),
            tree_agreement_pct: 91.5,
            decision_rule: 'NDRF life-safety compulsory evacuation activates whenever upper bound exceeds 75.0.',
          },
          actionable_lead_time: {
            lead_time_minutes: leadTime,
            surge_wave_velocity_m_s: 5.5,
            upstream_distance_km: 4.2,
            warning_window_status: 'ACTIONABLE - EVACUATION ORDER TRANSMITTED',
          },
          hyper_local_wards: [
            {
              ward_id: 'ward-1',
              name: 'Ward 1 - Lower Riverfront / Confluence',
              elevation_m: 1980,
              slope_degrees: 36.0,
              population: 180,
              distance_to_river_m: 20,
              exposure_zone: 'HIGH_VELOCITY_FLOODWAY',
              factor_of_safety_fos: 0.88,
              risk_score: Math.min(100, currentLoc.riskScore + 12),
              alert_stage: 'STAGE_4_EVACUATE',
              actionable_lead_time_minutes: Math.max(12, leadTime - 6),
              evacuation_priority: 'P1 - IMMEDIATE EVACUATION',
              designated_shelter: 'Upper Community High-Ground Center',
              evacuation_trail: 'North Ridge Trail T-1 (Elev. +120m)',
            },
            {
              ward_id: 'ward-2',
              name: 'Ward 2 - Mid-Slope Terraces',
              elevation_m: 2040,
              slope_degrees: 31.0,
              population: 340,
              distance_to_river_m: 75,
              exposure_zone: 'COLLUVIAL_SLOPE_MARGIN',
              factor_of_safety_fos: 1.12,
              risk_score: currentLoc.riskScore,
              alert_stage: 'STAGE_3_WARNING',
              actionable_lead_time_minutes: leadTime,
              evacuation_priority: 'P2 - PREPARE & EVACUATE',
              designated_shelter: 'Upper Community High-Ground Center',
              evacuation_trail: 'Panchayat Connector Trail',
            },
            {
              ward_id: 'ward-3',
              name: 'Ward 3 - Upper Ridge Settlement',
              elevation_m: 2160,
              slope_degrees: 22.0,
              population: 260,
              distance_to_river_m: 240,
              exposure_zone: 'ELEVATED_RIDGE_SAFE_HAVEN',
              factor_of_safety_fos: 1.65,
              risk_score: Math.max(20, currentLoc.riskScore - 26),
              alert_stage: 'STAGE_2_ADVISORY',
              actionable_lead_time_minutes: leadTime + 12,
              evacuation_priority: 'P4 - SHELTER-IN-PLACE / STAGING AREA',
              designated_shelter: 'Ridge Assembly Ground',
              evacuation_trail: 'Local Ridge Perimeter',
            },
            {
              ward_id: 'ward-4',
              name: 'Ward 4 - Culvert KM 0.6 / Choke Point',
              elevation_m: 1995,
              slope_degrees: 34.0,
              population: 95,
              distance_to_river_m: 35,
              exposure_zone: 'CHOKE_POINT_BOTTLENECK',
              factor_of_safety_fos: 0.94,
              risk_score: Math.min(100, currentLoc.riskScore + 15),
              alert_stage: 'STAGE_4_EVACUATE',
              actionable_lead_time_minutes: Math.max(10, leadTime - 4),
              evacuation_priority: 'P1 - IMMEDIATE EVACUATION & ROAD ISOLATION',
              designated_shelter: 'Elevated High School Facility',
              evacuation_trail: 'North Ridge Trail T-1 (Elev. +120m)',
            },
          ],
          evacuation_guidance: {
            shelters: {
              primary: {
                name: 'Primary Community Center Highground Shelter',
                distance_km: 1.4,
                elevation_gain_m: 120,
                capacity: 600,
                status: 'READY',
              },
              secondary: {
                name: 'Elevated Higher Secondary School Facility',
                distance_km: 2.2,
                elevation_gain_m: 85,
                capacity: 450,
                status: 'STANDBY',
              },
            },
            designated_trails: [
              {
                trail_name: 'North Ridge Trail T-1',
                type: 'RECOMMENDED_HIGH_GROUND',
                elevation_gain_m: 120,
                distance_km: 1.4,
                exposure: 'LOW',
                notes: 'Climbs above floodway contour; clear terrain profile.',
              },
              {
                trail_name: 'Panchayat Bypass Connector',
                type: 'SECONDARY_BYPASS',
                elevation_gain_m: 85,
                distance_km: 2.2,
                exposure: 'MODERATE',
                notes: 'Alternative route avoiding primary choke point.',
              },
              {
                trail_name: 'Riverbed Low Road & Bridge Link',
                type: 'DANGER_AVOID',
                elevation_gain_m: -15,
                distance_km: 0.8,
                exposure: 'CRITICAL',
                notes: 'Direct surge propagation path; strictly prohibited.',
              },
            ],
            ndrf_deployment: {
              battalion: '8th Bn NDRF, Ghaziabad',
              national_helpline: '1078 (Disaster Helpline)',
              cmas_cell_broadcast: true,
            },
          },
        });
        setLoading(false);
      }
    };

    fetchForecast();
    return () => { isMounted = false; };
  }, [params.id, currentLoc]);

  const p = forecastData?.multi_source_pillars;
  const unc = forecastData?.uncertainty_aware_estimation;
  const wards: WardData[] = forecastData?.hyper_local_wards || [];
  const evac = forecastData?.evacuation_guidance;

  return (
    <div className="flex flex-col min-h-screen select-none bg-[#020714] text-slate-100">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="village" />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-6 pb-24 md:pb-6 overflow-y-auto">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip chip-demo">SIH26192 HYPER-LOCAL OPERATIONAL DOSSIER</span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700">
                  {currentLoc.state}
                </span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700">
                  {currentLoc.region}
                </span>
              </div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2.5 mt-2">
                <MapPin className="w-6 h-6 text-cyan-400" />
                {forecastData?.village || currentLoc.name}
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                {zoneLabels[currentLoc.zone] || currentLoc.zone} • River Basin: <strong className="text-cyan-300">{currentLoc.region.split('(')[1]?.replace(')', '') || 'Headwaters'}</strong>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <RiskBadge level={currentLoc.riskLevel} />
              <DataModeBadge mode="DEMO" />
            </div>
          </div>

          {/* Uncertainty-Aware Forecast Summary Banner */}
          <div className="fp fp-operational rounded-3xl p-5 sm:p-6 space-y-4 border border-cyan-500/40">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-800 pb-3 gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  PRIMARY DISCIPLINE: {appLabels[currentLoc.application] || currentLoc.application}
                </span>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Authority: {currentLoc.authoritativeAgency} • GPS: {currentLoc.lat.toFixed(4)}°N, {currentLoc.lon.toFixed(4)}°E • Elevation: {currentLoc.elevation}
                </p>
              </div>

              {/* Actionable Lead Time Counter */}
              <div className="flex items-center gap-3 bg-rose-950/50 border border-rose-800/80 px-4 py-2 rounded-2xl">
                <Clock className="w-5 h-5 text-rose-400 animate-pulse" />
                <div>
                  <div className="text-[10px] font-mono text-rose-300 font-bold uppercase">ACTIONABLE EVACUATION LEAD TIME</div>
                  <div className="text-xl font-mono font-black text-rose-200">
                    {forecastData?.lead_time_minutes || currentLoc.leadTimeMinutes} MINUTES
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Multi-Metric Scorecard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="fp p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">POINT RISK SCORE</span>
                <span className="text-2xl font-black text-rose-400">
                  {forecastData?.risk_score || currentLoc.riskScore}/100
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  CI 90%: <strong className="text-cyan-300">{unc?.ci_90_formatted || `[${currentLoc.riskScore - 14} – ${currentLoc.riskScore + 14}]`}</strong>
                </span>
              </div>

              <div className="fp p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CONSERVATIVE UPPER BOUND</span>
                <span className="text-2xl font-black text-amber-400">
                  {unc?.conservative_upper_bound || Math.min(100, currentLoc.riskScore + 14)}/100
                </span>
                <span className="text-[9px] text-rose-400 block mt-0.5 font-bold">
                  {unc?.conservative_upper_bound >= 75 ? '⚠️ COMPULSORY EVACUATION' : 'MONITOR SURGE'}
                </span>
              </div>

              <div className="fp p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TREE ENSEMBLE AGREEMENT</span>
                <span className="text-2xl font-black text-emerald-400">
                  {unc?.tree_agreement_pct || 91.5}%
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  100 Estimators Evaluated
                </span>
              </div>

              <div className="fp p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">WARDOVERVIEW</span>
                <span className="text-2xl font-black text-cyan-300">
                  {wards.length} WARDS
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  Pop: {currentLoc.population.toLocaleString()} residents
                </span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              5 MULTI-SOURCE DATA PILLARS BREAKDOWN (SIH REQUIREMENT)
             ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                5 MULTI-SOURCE DATA PILLARS (OFFICIAL SIH26192 SPECIFICATION)
              </h2>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                Click tabs to inspect pillar sensor telemetry & physics formulations
              </span>
            </div>

            {/* Pillar Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 1, title: '1. Rainfall QPE', icon: CloudRain, color: 'text-cyan-400', weight: '35%' },
                { id: 2, title: '2. Soil Moisture', icon: Waves, color: 'text-amber-400', weight: '25%' },
                { id: 3, title: '3. Slope Stability', icon: Mountain, color: 'text-purple-400', weight: '20%' },
                { id: 4, title: '4. Landslide History', icon: History, color: 'text-rose-400', weight: '10%' },
                { id: 5, title: '5. IoT Telemetry', icon: Radio, color: 'text-emerald-400', weight: '10%' },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = selectedPillar === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedPillar(tab.id)}
                    className={`p-3 rounded-2xl border text-left transition active:scale-95 flex flex-col justify-between ${
                      active
                        ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-950/40'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon className={`w-4 h-4 ${tab.color}`} />
                      <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {tab.weight}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-mono font-bold text-white">{tab.title}</div>
                      <div className="text-[9px] font-mono text-slate-400">Multi-Source Pillar</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Inspector Card */}
            <div className="fp fp-operational rounded-3xl p-5 border border-slate-800 space-y-4">
              {selectedPillar === 1 && p?.pillar_1_rainfall && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                    <div>
                      <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-2">
                        <CloudRain className="w-4 h-4" />
                        PILLAR 1: RAINFALL OBSERVATION & QUANTITATIVE PRECIPITATION ESTIMATION (QPE)
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Source: {p.pillar_1_rainfall.source} • Status: {p.pillar_1_rainfall.status}
                      </p>
                    </div>
                    {p.pillar_1_rainfall.cloudburst_threshold_exceeded && (
                      <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-700 animate-pulse">
                        ⚠️ CLOUDBURST THRESHOLD EXCEEDED (≥50 mm/h)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">15-MIN ACCUMULATION</span>
                      <span className="text-lg font-bold text-cyan-300">{p.pillar_1_rainfall.rainfall_15m_mm} mm</span>
                      <span className="text-[9px] text-slate-400 block">Flash Trigger Gap</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">1-HOUR RAINFALL</span>
                      <span className="text-lg font-bold text-cyan-300">{p.pillar_1_rainfall.rainfall_1h_mm} mm</span>
                      <span className="text-[9px] text-slate-400 block">Immediate Runoff</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">3-HOUR ACCUMULATION</span>
                      <span className="text-lg font-bold text-amber-300">{p.pillar_1_rainfall.rainfall_3h_mm} mm</span>
                      <span className="text-[9px] text-slate-400 block">Catchment Surge</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">24-HOUR TOTAL</span>
                      <span className="text-lg font-bold text-purple-300">{p.pillar_1_rainfall.rainfall_24h_mm} mm</span>
                      <span className="text-[9px] text-slate-400 block">Soil Saturation Base</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">PEAK INTENSITY</span>
                      <span className="text-lg font-bold text-rose-400">{p.pillar_1_rainfall.rainfall_peak_intensity_mmph} mm/h</span>
                      <span className="text-[9px] text-slate-400 block">Convective Cell</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedPillar === 2 && p?.pillar_2_soil_moisture && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                    <div>
                      <h3 className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-2">
                        <Waves className="w-4 h-4" />
                        PILLAR 2: IN-SITU SOIL MOISTURE SENSORS & ROOT-ZONE SATURATION
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Technology: {p.pillar_2_soil_moisture.sensor_technology}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700">
                      {p.pillar_2_soil_moisture.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">VOLUMETRIC MOISTURE (VWC)</span>
                      <span className="text-lg font-bold text-amber-300">{p.pillar_2_soil_moisture.volumetric_moisture_pct}%</span>
                      <span className="text-[9px] text-slate-400 block">Calibrated TDR Probe</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">SATURATION RATIO (Sr)</span>
                      <span className="text-lg font-bold text-rose-300">{(p.pillar_2_soil_moisture.soil_saturation_index * 100).toFixed(1)}%</span>
                      <span className="text-[9px] text-slate-400 block">Pore-Water Pressure</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">ANTECEDENT 7-DAY RAIN</span>
                      <span className="text-lg font-bold text-cyan-300">{p.pillar_2_soil_moisture.antecedent_7d_mm} mm</span>
                      <span className="text-[9px] text-slate-400 block">Pre-Conditioning Load</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">EFFECTIVE COHESION (c&apos;)</span>
                      <span className="text-lg font-bold text-emerald-300">{p.pillar_2_soil_moisture.effective_cohesion_kpa} kPa</span>
                      <span className="text-[9px] text-slate-400 block">Shear Strength Residual</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedPillar === 3 && p?.pillar_3_slope_stability && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                    <div>
                      <h3 className="text-xs font-mono font-bold text-purple-300 uppercase flex items-center gap-2">
                        <Mountain className="w-4 h-4" />
                        PILLAR 3: GEOTECHNICAL SLOPE STABILITY MODELS (INFINITE SLOPE EQUILIBRIUM)
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Physics Formulation: {p.pillar_3_slope_stability.model_framework}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${
                      p.pillar_3_slope_stability.factor_of_safety_fos < 1.0
                        ? 'bg-rose-950 text-rose-300 border-rose-700'
                        : (p.pillar_3_slope_stability.factor_of_safety_fos < 1.3
                          ? 'bg-amber-950 text-amber-300 border-amber-700'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-700')
                    }`}>
                      {p.pillar_3_slope_stability.stability_status} (FoS: {p.pillar_3_slope_stability.factor_of_safety_fos})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">FACTOR OF SAFETY (FoS)</span>
                      <span className="text-lg font-bold text-purple-300">{p.pillar_3_slope_stability.factor_of_safety_fos}</span>
                      <span className="text-[9px] text-slate-400 block">{p.pillar_3_slope_stability.factor_of_safety_fos < 1.0 ? 'Failure Imminent (<1.0)' : 'Stable (>1.3)'}</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">TERRAIN SLOPE (β)</span>
                      <span className="text-lg font-bold text-cyan-300">{p.pillar_3_slope_stability.slope_degrees}°</span>
                      <span className="text-[9px] text-slate-400 block">DEM 30m Cell Incline</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">TOPOGRAPHIC WETNESS (TWI)</span>
                      <span className="text-lg font-bold text-amber-300">{p.pillar_3_slope_stability.topographic_wetness_index_twi}</span>
                      <span className="text-[9px] text-slate-400 block">ln(a / tan β) Convergence</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">CRITICAL RAIN THRESHOLD</span>
                      <span className="text-lg font-bold text-rose-300">{p.pillar_3_slope_stability.critical_rainfall_threshold_mm} mm</span>
                      <span className="text-[9px] text-slate-400 block">Dynamic Failure Limit</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedPillar === 4 && p?.pillar_4_landslide_inventory && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                    <div>
                      <h3 className="text-xs font-mono font-bold text-rose-300 uppercase flex items-center gap-2">
                        <History className="w-4 h-4" />
                        PILLAR 4: HISTORICAL LANDSLIDE INVENTORIES & GEOLOGICAL SUSCEPTIBILITY
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Inventory Authority: {p.pillar_4_landslide_inventory.inventory_authority}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-700">
                      {p.pillar_4_landslide_inventory.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">GSI NLSM SUSCEPTIBILITY INDEX</span>
                      <span className="text-lg font-bold text-rose-400">{p.pillar_4_landslide_inventory.gsi_susceptibility_index} / 1.0</span>
                      <span className="text-[9px] text-slate-400 block">National Macro-Zonation</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">RECORDED BASIN EVENTS</span>
                      <span className="text-lg font-bold text-amber-300">{p.pillar_4_landslide_inventory.historical_events_in_basin} Past Events</span>
                      <span className="text-[9px] text-slate-400 block">GSI & NRSC Catalog</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">LAST MAJOR RECORDED DISASTER</span>
                      <span className="text-sm font-bold text-cyan-300 truncate block">{p.pillar_4_landslide_inventory.last_major_disaster}</span>
                      <span className="text-[9px] text-slate-400 block">Historical Validation Anchor</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedPillar === 5 && p?.pillar_5_iot_telemetry && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                    <div>
                      <h3 className="text-xs font-mono font-bold text-emerald-300 uppercase flex items-center gap-2">
                        <Radio className="w-4 h-4" />
                        PILLAR 5: REAL-TIME IOT INPUTS & EARLY WARNING TELEMETRY
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Network: {p.pillar_5_iot_telemetry.mesh_network_status}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      4/4 SENSORS ONLINE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">RIVER WATER LEVEL</span>
                      <span className="text-lg font-bold text-cyan-300">{p.pillar_5_iot_telemetry.river_level_m} m</span>
                      <span className="text-[9px] text-slate-400 block">Ultrasonic Gauge</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">RATE OF RISE</span>
                      <span className="text-lg font-bold text-rose-300">+{p.pillar_5_iot_telemetry.river_rate_of_rise_mph} m/h</span>
                      <span className="text-[9px] text-slate-400 block">Flash Threshold: &gt;0.3 m/h</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">GEOPHONE SEISMIC VIBRATION</span>
                      <span className="text-lg font-bold text-amber-300">{p.pillar_5_iot_telemetry.geophone_debris_vibration_db} dB</span>
                      <span className="text-[9px] text-slate-400 block">Debris Front Signature</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">CULVERT BACKPRESSURE RATIO</span>
                      <span className="text-lg font-bold text-purple-300">{p.pillar_5_iot_telemetry.culvert_backpressure_ratio}</span>
                      <span className="text-[9px] text-slate-400 block">Drainage Choke Head</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              HYPER-LOCAL WARD-LEVEL FORECAST MATRIX (SIH REQUIREMENT)
             ══════════════════════════════════════════════════════════════ */}
          <div className="fp fp-operational rounded-3xl p-5 sm:p-6 space-y-4 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  HYPER-LOCAL FORECAST AT WARD / VILLAGE LEVEL
                </h2>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Micro-topographic slope equilibrium and wave arrival times computed individually per ward
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-xl border border-cyan-800">
                {wards.length} MONITORED WARDS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wards.map((ward) => {
                const isCritical = ward.risk_score >= 75;
                const isWarning = ward.risk_score >= 55 && ward.risk_score < 75;
                const borderClass = isCritical 
                  ? 'border-rose-600/70 bg-rose-950/20' 
                  : (isWarning ? 'border-amber-600/70 bg-amber-950/20' : 'border-slate-800 bg-slate-900/60');
                
                return (
                  <div key={ward.ward_id} className={`p-4 rounded-2xl border ${borderClass} space-y-3`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                          {ward.name}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          Zone: {ward.exposure_zone.replace(/_/g, ' ')} • Dist to River: {ward.distance_to_river_m}m
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isCritical 
                          ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse' 
                          : (isWarning ? 'bg-amber-950 text-amber-300 border border-amber-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-800')
                      }`}>
                        {ward.alert_stage.replace('STAGE_', 'LVL ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                      <div>
                        <span className="text-slate-500 block text-[9px]">WARD RISK</span>
                        <span className={`font-black text-sm ${isCritical ? 'text-rose-400' : (isWarning ? 'text-amber-400' : 'text-emerald-400')}`}>
                          {ward.risk_score}/100
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">LEAD TIME</span>
                        <span className="font-bold text-white text-sm">
                          {ward.actionable_lead_time_minutes} min
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">FACTOR SAFETY</span>
                        <span className={`font-bold text-sm ${ward.factor_of_safety_fos < 1.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {ward.factor_of_safety_fos} FoS
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono">
                      <div className="text-slate-300 flex items-center justify-between">
                        <span className="text-slate-400">Evacuation Priority:</span>
                        <strong className={isCritical ? 'text-rose-300 font-bold' : 'text-slate-200'}>{ward.evacuation_priority}</strong>
                      </div>
                      <div className="text-slate-300 flex items-center justify-between">
                        <span className="text-slate-400">Designated Shelter:</span>
                        <strong className="text-cyan-300 truncate max-w-[190px]">{ward.designated_shelter}</strong>
                      </div>
                      <div className="text-slate-300 flex items-center justify-between">
                        <span className="text-slate-400">Safe Trail:</span>
                        <strong className="text-emerald-300 truncate max-w-[190px]">{ward.evacuation_trail}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              ACTIONABLE LEAD TIME & EVACUATION MANAGEMENT
             ══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Shelters & Safe Trails */}
            <div className="fp fp-operational rounded-3xl p-5 space-y-4 border border-slate-800">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                DESIGNATED HIGH-GROUND SHELTERS & CAPACITY
              </h3>

              <div className="space-y-2.5 text-xs">
                {evac?.shelters?.primary && (
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {evac.shelters.primary.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Distance: {evac.shelters.primary.distance_km} km • Elevation Gain: +{evac.shelters.primary.elevation_gain_m || 120}m • Capacity: {evac.shelters.primary.capacity || 600} evacuees
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      READY
                    </span>
                  </div>
                )}

                {evac?.shelters?.secondary && (
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        {evac.shelters.secondary.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Distance: {evac.shelters.secondary.distance_km} km • Elevation Gain: +{evac.shelters.secondary.elevation_gain_m || 85}m • Capacity: {evac.shelters.secondary.capacity || 450} evacuees
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                      STANDBY
                    </span>
                  </div>
                )}
              </div>

              {/* Designated Trails List */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                  DESIGNATED EVACUATION TRAILS & CHOKE HAZARDS
                </div>
                <div className="space-y-1.5">
                  {evac?.designated_trails?.map((t: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-mono font-bold text-slate-200">{t.trail_name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{t.notes}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                        t.exposure === 'LOW' 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                          : (t.exposure === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800')
                      }`}>
                        {t.exposure} EXPOSURE
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* NDRF Action & 1-Tap Emergency SOS Dispatch */}
            <div className="fp fp-critical rounded-3xl p-5 space-y-4 flex flex-col justify-between border border-rose-600/40">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    NDRF COMMAND DIRECTIVE & RESCUE DISPATCH
                  </h3>
                  <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-700">
                    SOP LEVEL 4
                  </span>
                </div>

                <div className="mt-3 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/80 space-y-2">
                  <div className="text-xs font-mono font-bold text-rose-200">
                    ASSIGNED UNIT: {evac?.ndrf_deployment?.battalion || '8th Bn NDRF'}
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Compulsory evacuation directive active for riverbed settlements. Incline trails authorized for pedestrian transit. Road bridges across culvert choke points must be immediately barricaded.
                  </p>
                  <div className="text-[10px] font-mono text-cyan-300 pt-1 flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    CMAS Cell Broadcast Warning: <strong className="text-white">TRANSMITTED TO MONITORED TOWERS</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                    }
                  }}
                  className="btn-danger w-full py-3.5 rounded-2xl text-xs font-mono font-black text-white flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition animate-pulse"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>🚨 1-TAP RESCUE DISPATCH — NDRF CONTROL (1078)</span>
                </button>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                  <span>State EOC Helpline: 1070</span>
                  <span>Ambulance / Medical: 108</span>
                  <span>Police Emergency: 112</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
