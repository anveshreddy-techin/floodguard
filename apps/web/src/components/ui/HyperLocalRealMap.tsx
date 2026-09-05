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

    // 2. Primary High-Ground Shelter (+120m ASL above riverbed)
    const primaryShelter = {
      id: `shelter-primary-${location.id}`,
      name: `${location.name.split('/')[0].trim()} Community Shelter (+120m)`,
      type: 'SHELTER',
      category: 'SAFE_ASSEMBLY',
      lat: lat + 0.0055,
      lon: lon + 0.0068,
      elevation: `${baseEle + 120} m ASL`,
      capacity: 450,
      currentOccupancy: 38,
      waterSupply: 'Gravity Spring + Tank (4 days reserve)',
      medicalSupport: 'SDRF First Aid Post Attached',
      riskLevel: 'LOW',
      riskScore: 12,
      status: 'OPERATIONAL & STOCKED',
      desc: gisLang === 'hi'
        ? `प्राथमिक आपदा राहत आश्रय स्थल। नदी तल से +120 मीटर ऊपर सुरक्षित रिज पर।`
        : `Designated reinforced community shelter on stable rocky spur. Located +120m above 100-year peak water level.`,
      action: gisLang === 'hi'
        ? 'अनुशंसित सुरक्षित गंतव्य। भोजन, पेयजल एवं प्राथमिक चिकित्सा उपलब्ध।'
        : 'Primary safe destination. Stocked with emergency rations, satellite radio, and clean water.',
    };

    // 3. Secondary Shelter / Panchayat Bhavan (+85m ASL)
    const secondaryShelter = {
      id: `shelter-secondary-${location.id}`,
      name: `${location.region.split('(')[0].trim()} Panchayat Bhavan (+85m)`,
      type: 'SHELTER_SECONDARY',
      category: 'SAFE_ASSEMBLY',
      lat: lat + 0.0085,
      lon: lon - 0.0055,
      elevation: `${baseEle + 85} m ASL`,
      capacity: 280,
      currentOccupancy: 0,
      riskLevel: 'LOW',
      riskScore: 18,
      status: 'STANDBY ACTIVE',
      desc: gisLang === 'hi'
        ? 'द्वितीयक आश्रय केंद्र। पश्चिमी पहाड़ी ढलान पर सुरक्षित स्थान।'
        : 'Secondary designated relief center on western hill slope. Alternate option if north ridge trail is crowded.',
      action: gisLang === 'hi' ? 'वैकल्पिक सुरक्षित केंद्र।' : 'Alternate safe assembly center.',
    };

    // 4. AWS Weather Station (Rainfall Gauge)
    const awsStation = {
      id: `sensor-aws-${location.id}`,
      name: `${location.name.split('/')[0].trim()} AWS Telemetry Station`,
      type: 'AWS_GAUGE',
      category: 'IOT_SENSOR',
      lat: lat + 0.011,
      lon: lon - 0.007,
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
      lat: lat - 0.0042,
      lon: lon + 0.0028,
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
      lat: lat + 0.0048,
      lon: lon - 0.0035,
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
      lat: lat + 0.0095,
      lon: lon + 0.0042,
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

    // 8. River Vector (Flow centerline along the gorge)
    const riverVector = [
      [lat + 0.016, lon - 0.012],
      [lat + 0.010, lon - 0.006],
      [lat + 0.003, lon - 0.001],
      [lat - 0.0042, lon + 0.0028],
      [lat - 0.011, lon + 0.007],
      [lat - 0.018, lon + 0.013],
    ] as [number, number][];

    // 9. Modeled 100-Year Flood Inundation Envelope (Polygon along the riverbed)
    const floodPolygon = [
      [lat + 0.0165, lon - 0.0135],
      [lat + 0.0105, lon - 0.0075],
      [lat + 0.0035, lon - 0.0028],
      [lat - 0.002, lon + 0.001],
      [lat - 0.0045, lon + 0.0045],
      [lat - 0.0115, lon + 0.009],
      [lat - 0.0185, lon + 0.0145],
      // return bank (width depends on flood risk)
      [lat - 0.0175, lon + 0.0115],
      [lat - 0.0105, lon + 0.005],
      [lat - 0.0038, lon + 0.0012],
      [lat + 0.0025, lon - 0.0002],
      [lat + 0.0095, lon - 0.0045],
      [lat + 0.0155, lon - 0.0105],
    ] as [number, number][];

    // 10. Safe Evacuation Path (North Ridge Trail to Primary Shelter)
    const evacuationTrail = [
      [lat, lon],
      [lat + 0.0015, lon + 0.0022],
      [lat + 0.0032, lon + 0.0045],
      [lat + 0.0046, lon + 0.0058],
      [lat + 0.0055, lon + 0.0068],
    ] as [number, number][];

    // 11. Blocked Low-Lying Route (Submerged Riverbed Causeway)
    const blockedTrail = [
      [lat, lon],
      [lat - 0.0015, lon + 0.001],
      [lat - 0.0035, lon + 0.002],
      [lat - 0.0042, lon + 0.0028],
    ] as [number, number][];

    // 12. Steep Colluvial Slope Hazard Zone (Polygon on mountain face)
    const slopeHazardPolygon = [
      [lat + 0.008, lon + 0.006],
      [lat + 0.014, lon + 0.009],
      [lat + 0.016, lon + 0.002],
      [lat + 0.011, lon - 0.001],
    ] as [number, number][];

    return {
      village,
      primaryShelter,
      secondaryShelter,
      sensors: [awsStation, riverGauge, soilSensor, geophone],
      riverVector,
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
          .addAttribution('© OpenStreetMap · ESRI World Imagery · FloodGuard AI')
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
          // High-Res ESRI World Imagery Satellite
          tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
          hasLabelOverlay = true;
          maxZoom = 18;
          break;
        case 'TOPO':
          // OpenTopoMap with elevation contours & relief
          tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
          maxZoom = 17;
          break;
        case 'DARK':
          // CartoDB Dark Matter for night-time tactical disaster operations
          tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
          maxZoom = 19;
          break;
        case 'STREET':
        default:
          tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
          maxZoom = 19;
          break;
      }

      const baseTile = L.tileLayer(tileUrl, {
        subdomains,
        maxZoom,
      }).addTo(map);
      tileLayerRef.current = baseTile;

      if (hasLabelOverlay) {
        // Overlay place names and roads over satellite imagery
        const labels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
          subdomains: ['a', 'b', 'c', 'd'],
          maxZoom: 19,
          opacity: 0.85,
        }).addTo(map);
        labelLayerRef.current = labels;
      }

      // Clear previous overlays
      lg.clearLayers();

      const isHighRisk = location.riskLevel === 'HIGH' || location.riskLevel === 'EXTREME';

      // ── 1. MODELED FLOOD INUNDATION ENVELOPE (POLYGON) ──
      if (layers.floodZone) {
        const floodColor = location.riskLevel === 'EXTREME' ? '#e11d48' : isHighRisk ? '#ea580c' : '#0284c7';
        const floodFill = location.riskLevel === 'EXTREME' ? '#f43f5e' : isHighRisk ? '#f97316' : '#38bdf8';

        L.polygon(spatialEntities.floodPolygon, {
          color: floodColor,
          weight: 3,
          dashArray: '6 4',
          fillColor: floodFill,
          fillOpacity: isHighRisk ? 0.38 : 0.18,
        })
          .addTo(lg)
          .bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;min-width:190px;">
              <b style="color:${floodColor};">🌊 100-YR FLOOD INUNDATION ENVELOPE</b><br/>
              <b>Risk Category:</b> ${location.riskLevel}<br/>
              <b>Modeled Water Depth:</b> ${isHighRisk ? '1.8m - 3.4m (High Velocity)' : '0.4m - 1.0m (Channel)'}<br/>
              <b>Warning:</b> Low-lying buildings within this boundary are exposed to surge.
            </div>
          `);
      }

      // ── 2. STRAHLER RIVER FLOW VECTOR (POLYLINE) ──
      if (layers.riverVector) {
        L.polyline(spatialEntities.riverVector, {
          color: '#0284c7',
          weight: 8,
          opacity: 0.85,
          lineCap: 'round',
        }).addTo(lg);

        L.polyline(spatialEntities.riverVector, {
          color: '#38bdf8',
          weight: 3,
          opacity: 0.95,
          dashArray: '10 8',
        })
          .addTo(lg)
          .bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;">
              <b style="color:#0284c7;">💧 ${location.region.split('(')[0]} Mainstem Channel</b><br/>
              <b>Current Water Stage:</b> ${location.riverStage}<br/>
              <b>Threshold Status:</b> ${isHighRisk ? '⚠️ FLASH DANGER THRESHOLD EXCEEDED' : '✅ SAFE NORMAL FLOW'}<br/>
              <b>Velocity:</b> 4.2 m/s downstream surge
            </div>
          `);
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

      // ── 5. SAFE EVACUATION ESCAPE TRAIL (CYAN / EMERALD POLYLINE) ──
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
            <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;">
              <b style="color:#059669;">🚶 RECOMMENDED ESCAPE VECTOR: North Ridge Trail</b><br/>
              <b>Destination:</b> ${spatialEntities.primaryShelter.name}<br/>
              <b>Elevation Gain:</b> +120m uphill (Safe above floodline)<br/>
              <b>Walking Distance:</b> 1.4 km (~14-18 minutes)<br/>
              <b>Route Status:</b> CLEAR & MONITORED BY SDRF
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

      // ── 7. PINS: PRIMARY SAFE SHELTER ──
      const shelterIcon = L.divIcon({
        html: `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="width:32px;height:32px;border-radius:50%;background:#059669;border:3px solid #34d399;box-shadow:0 0 18px #10b981;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;">
              🏫
            </div>
            <div style="background:rgba(6,78,59,0.95);border:1px solid #34d399;color:#a7f3d0;font-family:monospace;font-size:10px;font-weight:bold;padding:2px 6px;border-radius:6px;margin-top:3px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.6);">
              SAFE SHELTER (+120m)
            </div>
          </div>`,
        className: '',
        iconSize: [130, 56],
        iconAnchor: [65, 20],
      });

      const shelterMarker = L.marker([spatialEntities.primaryShelter.lat, spatialEntities.primaryShelter.lon], { icon: shelterIcon, zIndexOffset: 950 })
        .addTo(lg);
      shelterMarker.on('click', () => handleEntityClick(spatialEntities.primaryShelter));

      // ── 8. PINS: SECONDARY SHELTER ──
      const shelter2Icon = L.divIcon({
        html: `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="width:26px;height:26px;border-radius:50%;background:#0284c7;border:2px solid #38bdf8;box-shadow:0 0 12px #0284c7;display:flex;align-items:center;justify-content:center;color:white;font-size:13px;">
              🏛️
            </div>
            <div style="background:rgba(12,74,110,0.92);border:1px solid #38bdf8;color:#bae6fd;font-family:monospace;font-size:9px;font-weight:bold;padding:1px 5px;border-radius:6px;margin-top:2px;white-space:nowrap;">
              Panchayat Bhavan (+85m)
            </div>
          </div>`,
        className: '',
        iconSize: [120, 48],
        iconAnchor: [60, 16],
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
  }, [location, activeBaseMap, layers, spatialEntities]);

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

      {/* ── TOP CONTROL BAR: BASE MAP & LAYER TOGGLES (EASY UNDERSTANDING) ── */}
      {showControlBar && (
        <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Base Map Switcher */}
          <div className="pointer-events-auto glass-panel p-1 rounded-xl shadow-2xl border border-cyan-500/30 flex items-center gap-1">
            <span className="text-[10px] font-mono font-bold text-cyan-400 px-1.5 uppercase hidden sm:inline">
              MAP STYLE:
            </span>
            {(
              [
                { id: 'SATELLITE', label: '🛰️ SATELLITE', desc: 'Real Aerial Photo' },
                { id: 'TOPO', label: '🏔️ TOPO', desc: 'Mountain Relief' },
                { id: 'DARK', label: '⬛ DARK OPS', desc: 'Command Center' },
                { id: 'STREET', label: '🗺️ STREETS', desc: 'Towns & Roads' },
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
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition ${
                layers.floodZone ? 'bg-orange-500/30 text-orange-300 border border-orange-500/40' : 'text-slate-500 opacity-60'
              }`}
            >
              <Waves className="w-3 h-3" />
              <span>FLOOD ZONE</span>
            </button>

            <button
              onClick={() => setLayers((p) => ({ ...p, evacuationRoute: !p.evacuationRoute }))}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition ${
                layers.evacuationRoute ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'text-slate-500 opacity-60'
              }`}
            >
              <Navigation className="w-3 h-3" />
              <span>SAFE ROUTE</span>
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

      {/* ── PLAIN-LANGUAGE "EASY UNDERSTANDING" SITUATION BANNER ── */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] pointer-events-none">
        <div className="pointer-events-auto max-w-4xl mx-auto glass-panel border border-cyan-500/40 rounded-2xl p-3 md:p-3.5 shadow-2xl backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-3 h-3 rounded-full shrink-0 ${isHighRisk ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
              <h4 className="text-xs md:text-sm font-black text-white truncate uppercase font-mono">
                {gisLang === 'hi' ? 'वास्तविक धरातलीय जीआईएस स्थिति' : 'HYPER-LOCAL GROUND SITUATION'}: {location.name}
              </h4>
              <RiskBadge level={location.riskLevel} />
            </div>

            <button
              onClick={() => setHudExpanded(!hudExpanded)}
              className="text-[10px] font-mono text-cyan-400 hover:text-white uppercase font-bold underline shrink-0"
            >
              {hudExpanded ? (gisLang === 'hi' ? 'छुपाएं [-]' : 'HIDE [-]') : (gisLang === 'hi' ? 'विवरण देखें [+]' : 'DETAILS [+]')}
            </button>
          </div>

          {hudExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-[11px] font-mono">
              {/* 1. What's Happening */}
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex items-start gap-2">
                <Waves className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-[9px] uppercase font-bold">
                    {gisLang === 'hi' ? 'नदी एवं वर्षा स्थिति' : 'RIVER & PRECIPITATION'}
                  </div>
                  <div className="text-slate-200 font-bold mt-0.5">
                    {location.riverStage} • Rain: {location.rainfall3h}
                  </div>
                  <div className="text-[10px] text-amber-300">
                    {isHighRisk 
                      ? (gisLang === 'hi' ? '⚠️ नदी जलस्तर तेजी से बढ़ रहा है (+0.40m/h)' : '⚠️ River surging rapidly (+0.40m/h)')
                      : (gisLang === 'hi' ? 'प्रवाह सामान्य गति से जारी' : 'Normal stable channel flow')}
                  </div>
                </div>
              </div>

              {/* 2. Safe Evacuation Guidance */}
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex items-start gap-2">
                <Navigation className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-[9px] uppercase font-bold">
                    {gisLang === 'hi' ? 'सुरक्षित निकासी मार्ग' : 'SAFE ESCAPE VECTOR'}
                  </div>
                  <div className="text-emerald-300 font-bold mt-0.5 truncate">
                    {spatialEntities.primaryShelter.name}
                  </div>
                  <div className="text-[10px] text-slate-300">
                    {gisLang === 'hi' ? '+120m ऊंचाई · 1.4 किमी (12-16 मिनट)' : '+120m Ridge Spur · 1.4 km (14 min walk)'}
                  </div>
                </div>
              </div>

              {/* 3. Lead Time / Action Required */}
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex items-start gap-2">
                <Clock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-[9px] uppercase font-bold">
                    {gisLang === 'hi' ? 'चेतावनी समय / निर्देश' : 'LEAD TIME & CITIZEN ACTION'}
                  </div>
                  <div className="text-white font-black mt-0.5">
                    {isHighRisk ? `${location.leadTimeMinutes} MIN ADVANCE WARNING` : 'NORMAL MONITORING'}
                  </div>
                  <div className="text-[10px] text-rose-300 font-bold truncate">
                    {isHighRisk 
                      ? (gisLang === 'hi' ? 'निचले मार्ग बंद हैं! रिज पथ से निकलें।' : 'Avoid low riverbed! Use North Ridge.')
                      : (gisLang === 'hi' ? 'मार्ग खुले हैं।' : 'All pathways clear.')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CLICK INSPECTOR DRAWER / MODAL (WHEN A PIN IS CLICKED) ── */}
      {selectedEntity && (
        <div className="absolute top-16 right-3 z-[500] w-72 sm:w-80 glass-panel border border-cyan-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl text-xs space-y-3 animate-fade-in">
          <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
            <div>
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                {selectedEntity.category || 'MAP FEATURE'}
              </span>
              <h3 className="text-sm font-black text-white mt-0.5 leading-tight">
                {selectedEntity.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedEntity(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-slate-300">
            <p className="text-[11px] leading-relaxed">
              {selectedEntity.desc}
            </p>

            {selectedEntity.reading && (
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center font-mono">
                <span className="text-slate-400 text-[10px]">LIVE MEASUREMENT:</span>
                <span className="text-cyan-300 font-bold text-xs">{selectedEntity.reading}</span>
              </div>
            )}

            {selectedEntity.elevation && (
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center font-mono">
                <span className="text-slate-400 text-[10px]">ELEVATION ASL:</span>
                <span className="text-emerald-400 font-bold text-xs">{selectedEntity.elevation}</span>
              </div>
            )}

            <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-200">
              <b className="text-cyan-300 block mb-0.5 font-mono text-[10px] uppercase">
                {gisLang === 'hi' ? 'सलाह / निर्देश:' : 'RECOMMENDED ACTION:'}
              </b>
              {selectedEntity.action || 'Continue normal spatial situational monitoring.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HyperLocalRealMap;
