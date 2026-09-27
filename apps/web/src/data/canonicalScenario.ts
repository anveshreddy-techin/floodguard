/**
 * FloodGuard AI — Canonical Demonstration Scenario Configuration (SIH26192)
 * 
 * Scenario: Raini Village Flash-Flood Demonstration
 * Jurisdiction: Chamoli District, Uttarakhand, India
 * Reference Coordinates: 30.4850° N, 79.6920° E
 * 
 * Strict non-impersonation and scientific honesty rules:
 * - Purely simulation/research data — NOT an official warning
 * - Consistent geography locked to Raini Village / Chamoli / Uttarakhand
 * - No fabricated certainty or unverified agency integration claims
 */

export interface ScenarioEvidenceItem {
  id: string;
  factor: string;
  metric: string;
  status: 'ELEVATED' | 'HIGH' | 'RISING' | 'REFERENCE';
  badgeColor: string;
  detail: string;
}

export interface ScenarioFeatureBase {
  scenario_id: string;
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: string;
}

export const CANONICAL_SCENARIO = {
  id: 'raini-demo-2026',
  name: 'Raini Village Flash-Flood Demonstration',
  mode: 'simulation',
  village: 'Raini Village',
  district: 'Chamoli',
  state: 'Uttarakhand',
  country: 'India',
  latitude: 30.4850,
  longitude: 79.6920,
  mapCenter: [30.4850, 79.6920] as [number, number],
  zoom: 13,
  elevationM: 2040,
  elevationStr: '2,040 m ASL',
  dataMode: 'SIMULATION',
  mapDisclosure: 'DEMO SCENARIO — SIMULATED / RESEARCH DATA — NOT AN OFFICIAL WARNING',
  source: 'FloodGuard AI demonstration scenario',
  title: 'Model-Estimated Flash-Flood Risk',
  subtitle: 'Raini Village, Chamoli, Uttarakhand',
  statusRow: {
    dataMode: 'Simulation',
    riskType: 'Model-estimated',
    verification: 'Pending human/field verification',
  },
  attributionFootnote: 'Basemap imagery and geographic labels are provided by the selected map provider. Hazard overlays are FloodGuard AI demo/research layers.',
} as const;

// ─── HAZARD COLOUR SYSTEM (Section 5) ─────────────────────────────────────────
export const HAZARD_COLORS = {
  green: {
    hex: '#2E8B57',
    label: 'Normal / Monitor',
    meaning: 'No elevated model-estimated risk at the current scenario stage. Normal monitoring zones only.',
  },
  yellow: {
    hex: '#F2C94C',
    label: 'Watch',
    meaning: 'Conditions are changing; monitor rainfall and local streams. Low-to-moderate watch areas.',
  },
  orange: {
    hex: '#F28C28',
    label: 'Elevated Risk',
    meaning: 'Combined rainfall, terrain, soil-moisture, or drainage indicators exceed a preparedness threshold.',
  },
  red: {
    hex: '#C7352F',
    label: 'High Risk',
    meaning: 'Model-estimated high-risk zone; rapid field verification and preparedness actions are recommended.',
  },
  darkRed: {
    hex: '#7A1F1F',
    label: 'Critical Scenario',
    meaning: 'Simulation-only severe scenario or verified critical condition. Displayed only when user activates Critical Simulation.',
  },
  blue: {
    hex: '#1E88E5',
    label: 'River / Drainage / Estimated Flow Corridor',
    meaning: 'Natural drainage and water-flow corridor.',
  },
  teal: {
    hex: '#00897B',
    label: 'Sensor / Observation Point',
    meaning: 'Rain gauge, soil-moisture sensor, water-level sensor, or weather observation point.',
  },
  purple: {
    hex: '#7E57C2',
    label: 'Historical Event',
    meaning: 'Historical flood/landslide reference event, not a current alert.',
  },
  brown: {
    hex: '#8D6E63',
    label: 'Steep Terrain',
    meaning: 'High-slope topographic terrain contour.',
  },
} as const;

// ─── CANONICAL MAP OBJECTS & POPUPS (Section 7) ──────────────────────────────
export const CANONICAL_MAP_OBJECTS = {
  // A. Rainfall Sensor
  rainfallSensor: {
    scenario_id: 'raini-demo-2026',
    id: 'RG-RAIN-01',
    name: 'Rain Gauge RG-RAIN-01',
    code: 'RG-RAIN-01',
    lat: 30.5005,
    lon: 79.7030,
    elevationM: 2360,
    type: 'RAINFALL_SENSOR',
    reading: '42.5 mm in previous 1 hour',
    dataMode: 'Simulation',
    freshness: 'Demo update',
    status: 'Operational in scenario',
    popupHtml: `
      <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;min-width:220px;color:#0f172a;">
        <div style="display:flex;align-items:center;gap:6px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:6px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#00897B;"></span>
          <b style="color:#00897B;font-size:13px;">Rain Gauge RG-RAIN-01</b>
        </div>
        <div><b>Scenario reading:</b> 42.5 mm in previous 1 hour</div>
        <div><b>Data mode:</b> Simulation</div>
        <div><b>Freshness:</b> Demo update</div>
        <div><b>Status:</b> Operational in scenario</div>
        <div style="font-size:10px;color:#64748b;margin-top:6px;border-top:1px dashed #cbd5e1;padding-top:4px;">
          Sensor / Observation Point · Upper Lata ridge
        </div>
      </div>
    `,
  },

  // B. Soil-Moisture Sensor
  soilSensor: {
    scenario_id: 'raini-demo-2026',
    id: 'SM-RAIN-02',
    name: 'Soil-Moisture Sensor SM-RAIN-02',
    code: 'SM-RAIN-02',
    lat: 30.4895,
    lon: 79.6950,
    elevationM: 2160,
    type: 'SOIL_SENSOR',
    reading: '86% saturation',
    dataMode: 'Simulation',
    interpretation: 'Saturated ground can increase runoff risk',
    popupHtml: `
      <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;min-width:220px;color:#0f172a;">
        <div style="display:flex;align-items:center;gap:6px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:6px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#00897B;"></span>
          <b style="color:#00897B;font-size:13px;">Soil-Moisture Sensor SM-RAIN-02</b>
        </div>
        <div><b>Scenario reading:</b> 86% saturation</div>
        <div><b>Data mode:</b> Simulation</div>
        <div style="color:#b45309;font-weight:600;margin-top:2px;"><b>Interpretation:</b> Saturated ground can increase runoff risk</div>
        <div style="font-size:10px;color:#64748b;margin-top:6px;border-top:1px dashed #cbd5e1;padding-top:4px;">
          Colluvial mid-slope observation probe
        </div>
      </div>
    `,
  },

  // C. River-Level Sensor
  riverSensor: {
    scenario_id: 'raini-demo-2026',
    id: 'WL-RAIN-03',
    name: 'Stream-Level Sensor WL-RAIN-03',
    code: 'WL-RAIN-03',
    lat: 30.4848,
    lon: 79.6932,
    elevationM: 2038,
    type: 'STREAM_SENSOR',
    reading: 'Rising level',
    dataMode: 'Simulation',
    verification: 'Field check recommended',
    popupHtml: `
      <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;min-width:220px;color:#0f172a;">
        <div style="display:flex;align-items:center;gap:6px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:6px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#00897B;"></span>
          <b style="color:#00897B;font-size:13px;">Stream-Level Sensor WL-RAIN-03</b>
        </div>
        <div><b>Scenario reading:</b> Rising level</div>
        <div><b>Data mode:</b> Simulation</div>
        <div style="color:#c2410c;font-weight:600;margin-top:2px;"><b>Verification:</b> Field check recommended</div>
        <div style="font-size:10px;color:#64748b;margin-top:6px;border-top:1px dashed #cbd5e1;padding-top:4px;">
          Raini Confluence Bridge Radar Telemetry
        </div>
      </div>
    `,
  },

  // D. Potentially Affected Settlement
  settlement: {
    scenario_id: 'raini-demo-2026',
    id: 'settlement-raini-village',
    name: 'Raini Village',
    lat: 30.4850,
    lon: 79.6920,
    elevationM: 2040,
    type: 'POTENTIALLY_AFFECTED_SETTLEMENT',
    status: 'Potentially affected settlement',
    risk: 'High — model-estimated',
    mainDrivers: 'intense rainfall, saturated soil, steep terrain, drainage proximity',
    recommendedAction: 'Verify local conditions and prepare community communication',
    verification: 'Pending',
    popupHtml: `
      <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;min-width:240px;color:#0f172a;">
        <div style="display:flex;align-items:center;gap:6px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:6px;">
          <span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid #C7352F;background:#fee2e2;"></span>
          <b style="color:#C7352F;font-size:14px;">Raini Village</b>
        </div>
        <div><b>Status:</b> Potentially affected settlement</div>
        <div><b>Risk:</b> <span style="color:#C7352F;font-weight:bold;">High — model-estimated</span></div>
        <div style="margin-top:2px;"><b>Main drivers:</b> intense rainfall, saturated soil, steep terrain, drainage proximity</div>
        <div style="margin-top:2px;"><b>Recommended action:</b> Verify local conditions and prepare community communication</div>
        <div style="margin-top:2px;"><b>Verification:</b> Pending</div>
        <div style="font-size:10px;color:#64748b;margin-top:6px;border-top:1px dashed #cbd5e1;padding-top:4px;">
          Chamoli District, Uttarakhand · Population: ~1,850
        </div>
      </div>
    `,
  },

  // E. Candidate High-Ground Shelter
  shelter: {
    scenario_id: 'raini-demo-2026',
    id: 'shelter-lata-terrace',
    name: 'Candidate High-Ground Shelter',
    lat: 30.5012,
    lon: 79.7055,
    elevationM: 2380,
    elevationGainM: 340,
    type: 'CANDIDATE_HIGH_GROUND_SHELTER',
    shelterType: 'Demonstration location',
    elevation: '2,380 m ASL (+340m relative to valley floor)',
    capacity: 'Demo value — not verified (approx 550 capacity)',
    accessStatus: 'Candidate route requires local verification',
    popupHtml: `
      <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;min-width:240px;color:#0f172a;">
        <div style="display:flex;align-items:center;gap:6px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:6px;">
          <span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid #2E8B57;background:#dcfce7;"></span>
          <b style="color:#2E8B57;font-size:14px;">Candidate High-Ground Shelter</b>
        </div>
        <div><b>Type:</b> Demonstration location</div>
        <div><b>Elevation:</b> 2,380 m ASL (+340m above valley floor)</div>
        <div><b>Capacity:</b> Demo value — not verified</div>
        <div style="color:#b45309;font-weight:600;margin-top:2px;"><b>Access status:</b> Candidate route requires local verification</div>
        <div style="font-size:10px;color:#64748b;margin-top:6px;border-top:1px dashed #cbd5e1;padding-top:4px;">
          Notice: Do not label as 'safe' or 'active' without official confirmation.
        </div>
      </div>
    `,
  },

  // F. Field-Verification Point
  fieldVerificationPoint: {
    scenario_id: 'raini-demo-2026',
    id: 'fvp-raini-spur',
    name: 'Field Verification Point',
    lat: 30.4880,
    lon: 79.6935,
    elevationM: 2090,
    type: 'FIELD_VERIFICATION_POINT',
    purpose: 'Confirm rainfall, stream rise, route accessibility, and local conditions',
    status: 'Pending verification',
    assignedRole: 'Field response team (demo)',
    popupHtml: `
      <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;min-width:230px;color:#0f172a;">
        <div style="display:flex;align-items:center;gap:6px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:6px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:#F28C28;"></span>
          <b style="color:#F28C28;font-size:13px;">Field Verification Point</b>
        </div>
        <div><b>Purpose:</b> Confirm rainfall, stream rise, route accessibility, and local conditions</div>
        <div><b>Status:</b> Pending verification</div>
        <div><b>Assigned role:</b> Field response team (demo)</div>
        <div style="font-size:10px;color:#64748b;margin-top:6px;border-top:1px dashed #cbd5e1;padding-top:4px;">
          Ground verification checkpoint at trail entrance
        </div>
      </div>
    `,
  },

  // G. Historical Event
  historicalEvent: {
    scenario_id: 'raini-demo-2026',
    id: 'hist-chamoli-2021',
    name: 'Historical Event Reference',
    lat: 30.4760,
    lon: 79.7080,
    elevationM: 2110,
    type: 'HISTORICAL_EVENT',
    dataMode: 'Historical reference',
    use: 'Context for susceptibility analysis',
    eventNote: 'Not a current incident',
    popupHtml: `
      <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;min-width:230px;color:#0f172a;">
        <div style="display:flex;align-items:center;gap:6px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:6px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#7E57C2;"></span>
          <b style="color:#7E57C2;font-size:13px;">Historical Event Reference</b>
        </div>
        <div><b>Data mode:</b> Historical reference</div>
        <div><b>Use:</b> Context for susceptibility analysis</div>
        <div style="color:#6b21a8;font-weight:600;margin-top:2px;"><b>Status:</b> Not a current incident</div>
        <div style="font-size:10px;color:#64748b;margin-top:6px;border-top:1px dashed #cbd5e1;padding-top:4px;">
          2021 Chamoli GLOF / Rock-Ice Avalanche catchment runout reference
        </div>
      </div>
    `,
  },
} as const;

// ─── CANDIDATE EVACUATION ROUTE (Section 8) ──────────────────────────────────
export interface RouteSegment {
  coords: [number, number][];
  status: 'PASSABLE_SIMULATION' | 'VERIFICATION_REQUIRED' | 'AVOID_CRITICAL';
  color: string;
  label: string;
  dashed?: boolean;
}

export const CANONICAL_EVACUATION_ROUTE = {
  scenario_id: 'raini-demo-2026',
  id: 'route-raini-to-lata',
  name: 'Candidate Evacuation Route',
  originName: 'Raini Village',
  destinationName: 'Candidate High-Ground Shelter (Lata Terrace)',
  distanceKm: 1.45,
  elevationGainM: 340,
  estimatedDurationMins: 22,
  routeStatus: 'Planning route — verification required',
  popupHtml: `
    <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;min-width:240px;color:#0f172a;">
      <div style="border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:6px;">
        <b style="color:#1E88E5;font-size:13px;">Candidate Evacuation Route</b>
      </div>
      <div><b>Status:</b> Planning route — verification required</div>
      <div style="color:#b45309;font-weight:600;margin-top:2px;">Use only after local authority / field-team confirmation</div>
      <div style="color:#dc2626;font-weight:bold;margin-top:2px;">Do not use if blocked, flooded, landslide-prone, or unsafe</div>
      <div style="font-size:10px;color:#64748b;margin-top:6px;border-top:1px dashed #cbd5e1;padding-top:4px;">
        Elevation gain: +340m · Distance: ~1.45 km uphill footpath
      </div>
    </div>
  `,
  segments: [
    // Green segment: normally passable in simulation (Village to lower trail)
    {
      coords: [
        [30.4850, 79.6920],
        [30.4872, 79.6942],
        [30.4900, 79.6965],
      ] as [number, number][],
      status: 'PASSABLE_SIMULATION' as const,
      color: '#2E8B57', // GREEN
      label: 'Passable in simulation (Footpath entrance to lower switchback)',
      dashed: false,
    },
    // Orange segment: requires verification (Mid-slope switchback trail)
    {
      coords: [
        [30.4900, 79.6965],
        [30.4930, 79.6990],
        [30.4965, 79.7015],
        [30.5000, 79.7040],
        [30.5012, 79.7055],
      ] as [number, number][],
      status: 'VERIFICATION_REQUIRED' as const,
      color: '#F28C28', // ORANGE
      label: 'Requires verification (Steep switchback & spur traverse)',
      dashed: true,
    },
    // Red cross-hatched segment: avoid / assumed blocked in critical scenario (Low riverbed causeway)
    {
      coords: [
        [30.4850, 79.6920],
        [30.4847, 79.6928],
        [30.4842, 79.6938],
      ] as [number, number][],
      status: 'AVOID_CRITICAL' as const,
      color: '#C7352F', // RED
      label: 'Avoid / Assumed blocked in surge scenario (Riverbed causeway)',
      dashed: true,
    },
  ],
};

// ─── HAZARD POLYGONS (25% to 45% fill opacity) ──────────────────────────────
export const CANONICAL_HAZARD_POLYGONS = {
  scenario_id: 'raini-demo-2026',
  // Model-estimated High-Risk Zone (Red, 35% fill opacity)
  highRiskZone: {
    name: 'Model-Estimated High-Risk Zone',
    color: '#C7352F',
    fillColor: '#C7352F',
    fillOpacity: 0.35,
    weight: 2,
    coords: [
      [30.4870, 79.6895],
      [30.4862, 79.6915],
      [30.4845, 79.6935],
      [30.4830, 79.6950],
      [30.4815, 79.6970],
      [30.4800, 79.6990],
      [30.4810, 79.7005],
      [30.4835, 79.6980],
      [30.4855, 79.6955],
      [30.4875, 79.6930],
      [30.4885, 79.6910],
    ] as [number, number][],
    popupHtml: `
      <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;min-width:220px;color:#0f172a;">
        <b style="color:#C7352F;">High Risk Zone (Model-Estimated)</b><br/>
        <span>Status: Rapid field verification and preparedness recommended.</span><br/>
        <span style="font-size:10px;color:#64748b;">Fill opacity: 35% · Model-estimated hazard perimeter</span>
      </div>
    `,
  },

  // Elevated Risk Zone (Orange, 28% fill opacity)
  elevatedRiskZone: {
    name: 'Elevated Risk Buffer',
    color: '#F28C28',
    fillColor: '#F28C28',
    fillOpacity: 0.28,
    weight: 1.5,
    coords: [
      [30.4890, 79.6880],
      [30.4875, 79.6905],
      [30.4855, 79.6930],
      [30.4835, 79.6955],
      [30.4810, 79.6980],
      [30.4790, 79.7010],
      [30.4808, 79.7030],
      [30.4838, 79.7000],
      [30.4865, 79.6970],
      [30.4895, 79.6940],
      [30.4905, 79.6905],
    ] as [number, number][],
    popupHtml: `
      <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;min-width:220px;color:#0f172a;">
        <b style="color:#F28C28;">Elevated Risk Buffer</b><br/>
        <span>Status: Areas requiring preparedness and field verification.</span>
      </div>
    `,
  },

  // Watch Zone (Yellow, 22% fill opacity)
  watchZone: {
    name: 'Watch Zone',
    color: '#F2C94C',
    fillColor: '#F2C94C',
    fillOpacity: 0.22,
    weight: 1.5,
    dashArray: '5 4',
    coords: [
      [30.4910, 79.6865],
      [30.4890, 79.6895],
      [30.4870, 79.6925],
      [30.4845, 79.6955],
      [30.4820, 79.6985],
      [30.4795, 79.7020],
      [30.4815, 79.7045],
      [30.4850, 79.7015],
      [30.4880, 79.6980],
      [30.4910, 79.6945],
      [30.4925, 79.6890],
    ] as [number, number][],
    popupHtml: `
      <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;min-width:220px;color:#0f172a;">
        <b style="color:#ca8a04;">Watch Zone</b><br/>
        <span>Conditions changing; monitor rainfall and local streams.</span>
      </div>
    `,
  },

  // Semi-transparent Slope Susceptibility Contour Overlay (Brown, 25% opacity)
  slopeSusceptibility: {
    name: 'Steep Slope Susceptibility Zone',
    color: '#8D6E63',
    fillColor: '#8D6E63',
    fillOpacity: 0.25,
    weight: 1.5,
    dashArray: '4 3',
    coords: [
      [30.4885, 79.6900],
      [30.4920, 79.6950],
      [30.4905, 79.6990],
      [30.4870, 79.6940],
    ] as [number, number][],
    popupHtml: `
      <div style="font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;min-width:220px;color:#0f172a;">
        <b style="color:#8D6E63;">Steep Terrain / Slope Susceptibility</b><br/>
        <span>Slope angle &gt; 32° · Colluvial debris and saturated soil increase mass-movement potential.</span>
      </div>
    `,
  },
};

// ─── RIVER FLOW VECTORS (Section 5 Blue #1E88E5) ─────────────────────────────
export const CANONICAL_RIVER_VECTORS = {
  scenario_id: 'raini-demo-2026',
  dhauligangaMainstem: {
    name: 'Dhauliganga River (Mainstem)',
    color: '#1E88E5',
    coords: [
      [30.5050, 79.6820],
      [30.4980, 79.6860],
      [30.4920, 79.6895],
      [30.4850, 79.6920], // Raini Confluence
      [30.4810, 79.6945],
      [30.4750, 79.6980],
      [30.4680, 79.7020],
    ] as [number, number][],
    flowDirection: 'Flowing downstream toward Joshimath / Alaknanda confluence',
  },
  rishigangaTributary: {
    name: 'Rishiganga River (Tributary)',
    color: '#1E88E5',
    coords: [
      [30.4710, 79.7150],
      [30.4760, 79.7080],
      [30.4800, 79.7020],
      [30.4835, 79.6955],
      [30.4850, 79.6920], // Confluence with Dhauliganga
    ] as [number, number][],
    flowDirection: 'Flowing downstream through gorge into Dhauliganga',
  },
};

// ─── "WHY IS RISK ELEVATED?" EXPLAINABILITY CARDS (Section 9) ────────────────
export const RISK_EVIDENCE_CARDS: ScenarioEvidenceItem[] = [
  {
    id: 'rain',
    factor: 'Rainfall Intensity',
    metric: '42.5 mm / 1 hour',
    status: 'ELEVATED',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    detail: 'Orographic catchment rate exceeds localized flash threshold of 35 mm/h.',
  },
  {
    id: 'soil',
    factor: 'Soil Saturation',
    metric: '86%',
    status: 'ELEVATED',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    detail: 'TDR probe telemetry indicates ground saturation near full pore capacity, reducing infiltration.',
  },
  {
    id: 'slope',
    factor: 'Slope Susceptibility',
    metric: 'High (34° mean)',
    status: 'HIGH',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    detail: 'Steep canyon slopes with loose colluvial deposits susceptible to rapid runoff acceleration.',
  },
  {
    id: 'drainage',
    factor: 'Drainage Proximity',
    metric: 'Near stream corridor (<120m)',
    status: 'HIGH',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    detail: 'Village settlement sits along narrow gorge exit of Rishiganga and Dhauliganga confluence.',
  },
  {
    id: 'river',
    factor: 'River Condition',
    metric: 'Rising trend — simulation',
    status: 'RISING',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    detail: 'Radar stream gauge indicates accelerating water rise of +0.38 m/h.',
  },
  {
    id: 'history',
    factor: 'Historical Context',
    metric: 'Event-prone terrain reference',
    status: 'REFERENCE',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    detail: 'Site of February 2021 Chamoli GLOF / avalanche surge runout corridor.',
  },
];

export const RISK_OUTPUT_SUMMARY = {
  riskOutput: 'High — model-estimated',
  confidence: 'Demonstration value / limited validation',
  oodStatus: 'Normal for scenario',
  humanVerification: 'Required',
};

// ─── EVACUATION PLANNING PANEL DATA (Section 8) ──────────────────────────────
export const EVACUATION_PLANNING_PANEL = {
  title: 'Evacuation Planning — Demo Scenario',
  origin: 'Raini Village',
  destination: 'Candidate High-Ground Shelter (Lata Terrace)',
  routeStatus: 'Verification required',
  fieldCheck: 'Rainfall, stream crossing, landslide blockage, road condition',
  emergency: 'Call 112 for official emergency assistance',
  disclaimer: 'FloodGuard AI supports preparedness decisions; local authorities make final evacuation decisions.',
};

// ─── BOTTOM SUMMARY CARDS (Section 10) ───────────────────────────────────────
export const MAP_SUMMARY_CARDS = {
  card1: {
    title: 'Candidate High-Ground Shelter',
    value: 'Lata Village Terrace (+340m)',
    subtitle: 'Demonstration location — verification required',
  },
  card2: {
    title: 'Model-Estimated Water Scenario',
    value: 'Elevated flow scenario',
    subtitle: 'Simulation — not a verified local water-level measurement',
  },
  card3: {
    title: 'Response Coordination',
    value: 'Local authority workflow',
    subtitle: 'Emergency number: 112 | External integration: Not connected',
  },
  card4: {
    title: 'Scenario Reference Point',
    value: '30.4850° N, 79.6920° E',
    subtitle: 'Raini Village demonstration reference',
  },
};

// ─── MAP DATA VALIDATION RULES (Section 11) ──────────────────────────────────
/**
 * Validates that a map feature belongs strictly to the active scenario
 * and is geographically within 25 km of the scenario center.
 */
export function validateScenarioFeature(
  feature: { scenario_id?: string; lat: number; lon: number; name?: string },
  activeScenarioId: string = CANONICAL_SCENARIO.id,
  maxDistanceKm: number = 25
): boolean {
  // 1. Scenario ID match
  if (feature.scenario_id && feature.scenario_id !== activeScenarioId) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[FloodGuard AI] Feature ${feature.name || 'unknown'} rejected: scenario mismatch (${feature.scenario_id} !== ${activeScenarioId})`);
    }
    return false;
  }

  // 2. Maximum distance check (Haversine formula approximation)
  const dLat = (feature.lat - CANONICAL_SCENARIO.latitude) * 111.0;
  const dLon = (feature.lon - CANONICAL_SCENARIO.longitude) * 111.0 * Math.cos((CANONICAL_SCENARIO.latitude * Math.PI) / 180);
  const distanceKm = Math.sqrt(dLat * dLat + dLon * dLon);

  if (distanceKm > maxDistanceKm) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[FloodGuard AI] Feature ${feature.name || 'unknown'} rejected: distance ${distanceKm.toFixed(1)} km exceeds ${maxDistanceKm} km limit from Raini Village.`);
    }
    return false;
  }

  return true;
}
