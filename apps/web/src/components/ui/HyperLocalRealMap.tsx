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

    // ── LOCATION-SPECIFIC REAL RIVER & TOPOGRAPHIC ASSET VECTORS ──
    // Checks if the location has verified real-world satellite ground-truth coordinates
    const isRaini = location.id === 'loc-uk-chamoli' || location.name.toLowerCase().includes('raini');
    const isKedarnath = location.id === 'loc-uk-kedarnath' || location.name.toLowerCase().includes('kedarnath');
    const isKullu = location.id === 'loc-hp-kullu' || location.name.toLowerCase().includes('kullu');
    const isGuwahati = location.id === 'loc-as-guwahati' || location.name.toLowerCase().includes('guwahati');
    const isTeesta = location.id === 'loc-sk-teesta' || location.name.toLowerCase().includes('teesta');

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
    let slopeHazardPolygon: [number, number][];

    if (isRaini) {
      // ── RAINI VILLAGE / DHAULIGANGA & RISHIGANGA CONFLUENCE ──
      // Traced along the actual white rocky canyon riverbed visible in Google Earth
      // Dhauliganga flows East to West towards Tapovan Barrage
      riverVector = [
        [30.4918, 79.7220],
        [30.4908, 79.7150],
        [30.4895, 79.7080],
        [30.4878, 79.7010],
        [30.4858, 79.6945], // Raini bridge confluence
        [30.4850, 79.6915],
        [30.4842, 79.6840],
        [30.4855, 79.6750],
        [30.4868, 79.6640],
        [30.4860, 79.6540],
        [30.4875, 79.6450],
        [30.4898, 79.6360], // Flowing west towards Tapovan
      ];

      // Rishiganga tributary coming from the south-east gorge (source of the 2021 surge)
      tributaryVector = [
        [30.4715, 79.7125],
        [30.4760, 79.7065],
        [30.4815, 79.6990],
        [30.4855, 79.6935], // Confluence with Dhauliganga at Raini
      ];

      // 100-Year Flood Envelope: Envelopes the active river channel and low-lying terraces
      floodPolygon = [
        // North Bank (West to East along the gorge)
        [30.4908, 79.6360],
        [30.4885, 79.6450],
        [30.4870, 79.6540],
        [30.4878, 79.6640],
        [30.4865, 79.6750],
        [30.4852, 79.6840],
        [30.4860, 79.6915],
        [30.4870, 79.6945],
        [30.4888, 79.7010],
        [30.4905, 79.7080],
        [30.4918, 79.7150],
        [30.4928, 79.7220],
        // South Bank (East to West along the gorge)
        [30.4908, 79.7220],
        [30.4898, 79.7150],
        [30.4885, 79.7080],
        [30.4868, 79.7010],
        [30.4848, 79.6945],
        // Rishiganga surge corridor flare
        [30.4805, 79.7005],
        [30.4755, 79.7075],
        [30.4705, 79.7135],
        [30.4725, 79.7115],
        [30.4770, 79.7055],
        [30.4825, 79.6980],
        [30.4845, 79.6920],
        // Continuing west along south bank
        [30.4832, 79.6840],
        [30.4845, 79.6750],
        [30.4858, 79.6640],
        [30.4850, 79.6540],
        [30.4865, 79.6450],
        [30.4888, 79.6360],
      ];

      primaryShelterCoords = [30.4895, 79.6935]; // North Ridge spur (+120m safe ASL)
      secondaryShelterCoords = [30.4875, 79.6885]; // Western slope (+85m ASL)
      radarGaugeCoords = [30.4856, 79.6932]; // Real Raini Confluence Bridge
      awsStationCoords = [30.4935, 79.6910]; // High ridge AWS
      soilSensorCoords = [30.4875, 79.6900]; // Colluvial mid-slope
      geophoneCoords = [30.4780, 79.7040]; // Upstream in Rishiganga gorge

      // Evacuation trail climbs uphill away from gorge
      evacuationTrail = [
        [30.4850, 79.6920],
        [30.4862, 79.6925],
        [30.4878, 79.6930],
        [30.4895, 79.6935],
      ];

      // Blocked trail goes into riverbed
      blockedTrail = [
        [30.4850, 79.6920],
        [30.4855, 79.6926],
      ];

      // Steep slope hazard on the northern rock face
      slopeHazardPolygon = [
        [30.4880, 79.6910],
        [30.4915, 79.6980],
        [30.4895, 79.7020],
        [30.4865, 79.6960],
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
      slopeHazardPolygon = [
        [lat + 0.008, lon - 0.005],
        [lat + 0.013, lon - 0.002],
        [lat + 0.011, lon + 0.004],
        [lat + 0.006, lon + 0.001],
      ];
    } else {
      // ── GENERIC LOCATION REALISTIC DRAINAGE GRADIENT ──
      // Traces a natural curved stream flowing downhill through the local area
      riverVector = [
        [lat + 0.014, lon - 0.010],
        [lat + 0.008, lon - 0.005],
        [lat + 0.002, lon - 0.001],
        [lat - 0.004, lon + 0.003],
        [lat - 0.010, lon + 0.008],
        [lat - 0.016, lon + 0.014],
      ];

      floodPolygon = [
        [lat + 0.0145, lon - 0.0115],
        [lat + 0.0085, lon - 0.0065],
        [lat + 0.0025, lon - 0.0025],
        [lat - 0.0035, lon + 0.0015],
        [lat - 0.0095, lon + 0.0065],
        [lat - 0.0155, lon + 0.0125],
        [lat - 0.0165, lon + 0.0155],
        [lat - 0.0105, lon + 0.0095],
        [lat - 0.0045, lon + 0.0045],
        [lat + 0.0015, lon + 0.0005],
        [lat + 0.0075, lon - 0.0035],
        [lat + 0.0135, lon - 0.0085],
      ];

      primaryShelterCoords = [lat + 0.006, lon + 0.007];
      secondaryShelterCoords = [lat + 0.008, lon - 0.006];
      radarGaugeCoords = [lat - 0.004, lon + 0.003];
      awsStationCoords = [lat + 0.011, lon - 0.007];
      soilSensorCoords = [lat + 0.005, lon - 0.004];
      geophoneCoords = [lat + 0.010, lon + 0.005];

      evacuationTrail = [
        [lat, lon],
        [lat + 0.003, lon + 0.004],
        [primaryShelterCoords[0], primaryShelterCoords[1]],
      ];
      blockedTrail = [
        [lat, lon],
        [radarGaugeCoords[0], radarGaugeCoords[1]],
      ];
      slopeHazardPolygon = [
        [lat + 0.008, lon + 0.005],
        [lat + 0.014, lon + 0.008],
        [lat + 0.012, lon + 0.012],
        [lat + 0.006, lon + 0.009],
      ];
    }

    // 2. Primary High-Ground Shelter (+120m ASL above riverbed)
    const primaryShelter = {
      id: `shelter-primary-${location.id}`,
      name: `${location.name.split('/')[0].trim()} Designated Assembly Shelter (+120m)`,
      type: 'SHELTER',
      category: 'DESIGNATED_ASSEMBLY',
      lat: primaryShelterCoords[0],
      lon: primaryShelterCoords[1],
      elevation: `${baseEle + 120} m ASL`,
      capacity: 450,
      currentOccupancy: 38,
      waterSupply: 'Gravity Spring + Tank (4 days reserve)',
      medicalSupport: 'SDRF First Aid Post Attached',
      riskLevel: 'LOW',
      riskScore: 12,
      status: 'OPERATIONAL & STOCKED',
      desc: gisLang === 'hi'
        ? `नामित आपदा राहत आश्रय स्थल। नदी तल से +120 मीटर ऊपर सुरक्षित रिज पर।`
        : `Designated reinforced community shelter on stable rocky spur. Located +120m above 100-year peak water level.`,
      action: gisLang === 'hi'
        ? 'अनुशंसित नामित गंतव्य। भोजन, पेयजल एवं प्राथमिक चिकित्सा उपलब्ध।'
        : 'Designated high-ground assembly destination. Stocked with emergency rations, satellite radio, and clean water.',
    };

    // 3. Secondary Shelter / Panchayat Bhavan (+85m ASL)
    const secondaryShelter = {
      id: `shelter-secondary-${location.id}`,
      name: `${location.region.split('(')[0].trim()} Panchayat Bhavan (+85m)`,
      type: 'SHELTER_SECONDARY',
      category: 'DESIGNATED_ASSEMBLY',
      lat: secondaryShelterCoords[0],
      lon: secondaryShelterCoords[1],
      elevation: `${baseEle + 85} m ASL`,
      capacity: 280,
      currentOccupancy: 0,
      riskLevel: 'LOW',
      riskScore: 18,
      status: 'STANDBY ACTIVE',
      desc: gisLang === 'hi'
        ? 'द्वितीयक आश्रय केंद्र। पश्चिमी पहाड़ी ढलान पर नामित स्थान।'
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

      // ── 1. MODELED FLOOD INUNDATION ENVELOPE (POLYGON OVER REAL RIVERBED) ──
      if (layers.floodZone) {
        const floodColor = location.riskLevel === 'EXTREME' ? '#e11d48' : isHighRisk ? '#ea580c' : '#0284c7';
        const floodFill = location.riskLevel === 'EXTREME' ? '#f43f5e' : isHighRisk ? '#f97316' : '#38bdf8';

        L.polygon(spatialEntities.floodPolygon, {
          color: floodColor,
          weight: 2.5,
          dashArray: '6 4',
          fillColor: floodFill,
          fillOpacity: isHighRisk ? 0.40 : 0.20,
        })
          .addTo(lg)
          .bindPopup(`
            <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;min-width:240px;">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:4px;">
                <b style="color:${floodColor};font-size:12px;">🌊 100-YR FLOOD ENVELOPE</b>
                <span style="font-size:9px;background:#fef3c7;color:#92400e;padding:1px 5px;border-radius:4px;border:1px solid #f59e0b;font-weight:bold;">ILLUSTRATIVE</span>
              </div>
              <b>Risk Category:</b> ${location.riskLevel}<br/>
              <b>Modeled Water Depth:</b> ${isHighRisk ? '1.8m - 3.4m (High Velocity)' : '0.4m - 1.0m (Channel)'}<br/>
              <b>Hydraulic Fidelity:</b> Illustrative hydraulic estimate (Not survey-grade LiDAR/DEM simulation)<br/>
              <b>Warning:</b> Low-lying structures and river crossings are exposed.
            </div>
          `);
      }

      // ── 2. REAL STRAHLER RIVER FLOW VECTOR (MAINSTEM & TRIBUTARY) ──
      if (layers.riverVector) {
        // Mainstem River Channel (Dhauliganga / Mandakini / Beas / Brahmaputra)
        L.polyline(spatialEntities.riverVector, {
          color: '#0284c7',
          weight: 8,
          opacity: 0.88,
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
            <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;min-width:220px;">
              <b style="color:#0284c7;">💧 ${location.region.split('(')[0]} Mainstem Channel</b><br/>
              <b>Current Water Stage:</b> ${location.riverStage}<br/>
              <b>Threshold Status:</b> ${isHighRisk ? '⚠️ FLASH DANGER THRESHOLD EXCEEDED' : '✅ NORMAL SEASONAL FLOW'}<br/>
              <b>Geometry:</b> Traced along riverbed canyon (Illustrative approximation)<br/>
              <b>Velocity:</b> 4.2 m/s downstream surge
            </div>
          `);

        // Glacial Tributary Surge Corridor (e.g., Rishiganga Gorge)
        if (spatialEntities.tributaryVector && spatialEntities.tributaryVector.length > 1) {
          L.polyline(spatialEntities.tributaryVector, {
            color: '#0369a1',
            weight: 6,
            opacity: 0.85,
            lineCap: 'round',
          }).addTo(lg);

          L.polyline(spatialEntities.tributaryVector, {
            color: '#f97316',
            weight: 2.5,
            opacity: 0.95,
            dashArray: '6 6',
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
            <div style="font-family:monospace;font-size:12px;line-height:1.5;color:#0f172a;">
              <b style="color:#059669;">🚶 CANDIDATE ESCAPE VECTOR: North Ridge Trail</b><br/>
              <b>Destination:</b> ${spatialEntities.primaryShelter.name}<br/>
              <b>Elevation Gain:</b> +120m uphill (Above modeled floodline)<br/>
              <b>Walking Distance:</b> 1.4 km (~14-18 minutes)<br/>
              <b>Route Status:</b> CLEAR &amp; MONITORED BY SDRF (CANDIDATE · UNVERIFIED ON GROUND)
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
            <div style="width:32px;height:32px;border-radius:50%;background:#059669;border:3px solid #34d399;box-shadow:0 0 18px #10b981;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;">
              🏫
            </div>
            <div style="background:rgba(6,78,59,0.95);border:1px solid #34d399;color:#a7f3d0;font-family:monospace;font-size:10px;font-weight:bold;padding:2px 6px;border-radius:6px;margin-top:3px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.6);">
              DESIGNATED SHELTER (+120m)
            </div>
          </div>`,
        className: '',
        iconSize: [160, 56],
        iconAnchor: [80, 20],
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
                      ? (gisLang === 'hi' ? 'निचले मार्ग बंद हैं! रिज पथ से निकलें।' : 'Avoid low riverbed! Use North Ridge.')
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
                    {gisLang === 'hi' ? '+120m ऊंचाई · 1.4 किमी (14 मिनट)' : '+120m Ridge Spur · 1.4 km (14 min walk)'}
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
    </div>
  );
};

export default HyperLocalRealMap;
