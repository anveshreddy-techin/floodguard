export type RiverBasinId = 
  | 'GANGA'
  | 'BRAHMAPUTRA'
  | 'INDUS'
  | 'GODAVARI'
  | 'KRISHNA'
  | 'CAUVERY'
  | 'NARMADA_TAPI'
  | 'MAHANADI'
  | 'WESTERN_COASTAL';

export interface RiverPoint {
  id: string;
  name: string;
  river: string;
  basin: RiverBasinId;
  basinName: string;
  state: string;
  lat: number;
  lon: number;
  svgX: number; // 0-1000 coordinate relative to India SVG projection
  svgY: number; // 0-1000 coordinate relative to India SVG projection
  riskPercentage: number; // 0-100%
  riskCategory: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  currentStageM: number;
  warningLevelM: number;
  dangerLevelM: number;
  hflLevelM: number; // Highest Flood Level
  dischargeCumecs: number;
  flowVelocityMs: number;
  rainfall3hMm: number;
  trend: 'RISING_FAST' | 'RISING' | 'STEADY' | 'RECEDING';
  upstreamNodeId?: string;
  downstreamNodeId?: string;
  primaryHazard: string;
  recommendedAction: string;
  damControlled: boolean;
  damName?: string;
  cwcStationCode: string;
}

export interface RiverVectorPath {
  id: string;
  name: string;
  basin: RiverBasinId;
  color: string;
  strokeWidth: number;
  pathData: string; // SVG path 'd' attribute
  flowDirection: 'FORWARD' | 'REVERSE';
}

export const RIVER_BASINS_META: Record<RiverBasinId, { name: string; color: string; riverCount: number; avgRisk: number; description: string }> = {
  GANGA: {
    name: 'Ganges Basin',
    color: '#06b6d4',
    riverCount: 9,
    avgRisk: 78,
    description: 'Northern & Eastern India — Alaknanda, Bhagirathi, Yamuna, Ganga, Kosi, Gandak',
  },
  BRAHMAPUTRA: {
    name: 'Brahmaputra & Barak Basin',
    color: '#a855f7',
    riverCount: 6,
    avgRisk: 86,
    description: 'North-East India — Siang, Subansiri, Brahmaputra, Teesta, Barak, Kopili',
  },
  INDUS: {
    name: 'Indus System (Northern Hills)',
    color: '#3b82f6',
    riverCount: 5,
    avgRisk: 72,
    description: 'Himalayan J&K, HP, Punjab — Jhelum, Chenab, Beas, Satluj, Ravi',
  },
  GODAVARI: {
    name: 'Godavari Basin',
    color: '#f59e0b',
    riverCount: 4,
    avgRisk: 74,
    description: 'Peninsular Central India — Godavari, Pranhita, Indravati, Manjira',
  },
  KRISHNA: {
    name: 'Krishna Basin',
    color: '#ec4899',
    riverCount: 4,
    avgRisk: 71,
    description: 'Maharashtra, Karnataka, AP, Telangana — Krishna, Tungabhadra, Bhima',
  },
  CAUVERY: {
    name: 'Cauvery Basin',
    color: '#10b981',
    riverCount: 4,
    avgRisk: 70,
    description: 'Karnataka & Tamil Nadu — Cauvery, Kabini, Bhavani, Hemavati',
  },
  NARMADA_TAPI: {
    name: 'Narmada & Tapi Basins',
    color: '#f97316',
    riverCount: 3,
    avgRisk: 68,
    description: 'Central-Western India — Narmada, Tapi, Sardar Sarovar System',
  },
  MAHANADI: {
    name: 'Mahanadi Basin',
    color: '#e11d48',
    riverCount: 3,
    avgRisk: 84,
    description: 'Odisha & Chhattisgarh — Mahanadi, Brahmani, Baitarani Delta',
  },
  WESTERN_COASTAL: {
    name: 'Western Ghats & Coastal Rivers',
    color: '#6366f1',
    riverCount: 4,
    avgRisk: 88,
    description: 'Kerala, Konkan & Mumbai — Periyar, Pamba, Vashishti, Mithi',
  },
};

// 🇮🇳 Master National River Point Registry (37 Pan-India River Points)

const makePt = (
  id: string, name: string, river: string, basin: RiverBasinId, basinName: string, state: string,
  lat: number, lon: number, svgX: number, svgY: number, riskPercentage: number,
  riskCategory: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW', currentStageM: number,
  warningLevelM: number, dangerLevelM: number, hflLevelM: number, dischargeCumecs: number,
  flowVelocityMs: number, rainfall3hMm: number, trend: 'RISING_FAST' | 'RISING' | 'STEADY' | 'RECEDING',
  primaryHazard: string, recommendedAction: string, damControlled: boolean, cwcStationCode: string,
  extra?: { downstreamNodeId?: string; upstreamNodeId?: string; damName?: string }
): RiverPoint => ({
  id, name, river, basin, basinName, state, lat, lon, svgX, svgY, riskPercentage,
  riskCategory, currentStageM, warningLevelM, dangerLevelM, hflLevelM, dischargeCumecs,
  flowVelocityMs, rainfall3hMm, trend, primaryHazard, recommendedAction, damControlled, cwcStationCode,
  ...extra,
});

// 🇮🇳 Master National River Point Registry (37 Pan-India River Points)
export const NATIONAL_RIVER_POINTS: RiverPoint[] = [
  // ─── 1. GANGES BASIN ───
  makePt('riv-alaknanda-joshimath', 'Alaknanda at Joshimath / Tapovan', 'Alaknanda River', 'GANGA', 'Ganges Basin', 'Uttarakhand', 30.556, 79.567, 382, 268, 88, 'CRITICAL', 5.4, 4.8, 5.2, 6.8, 3850, 6.2, 64.5, 'RISING_FAST', 'Steep Gorge GLOF Wave & Hydropower Dam Surge', 'Sound downstream sirens at Raini & Tapovan; pre-alert SDRF Rishikesh', true, 'CWC-UK-ALAK-001', {downstreamNodeId: 'riv-ganga-haridwar', damName: 'Tapovan-Vishnugad Project'}),
  makePt('riv-mandakini-rudraprayag', 'Mandakini at Rudraprayag Confluence', 'Mandakini River', 'GANGA', 'Ganges Basin', 'Uttarakhand', 30.285, 78.981, 370, 280, 82, 'CRITICAL', 6.8, 6.0, 6.5, 8.9, 4200, 5.8, 58.0, 'RISING_FAST', 'Kedarnath Catchment Cloudburst Runoff', 'Evacuate ghat settlements; hold road traffic on NH-107', false, 'CWC-UK-MAND-002', {downstreamNodeId: 'riv-ganga-haridwar'}),
  makePt('riv-bhagirathi-tehri', 'Bhagirathi at Tehri Reservoir Inflow', 'Bhagirathi River', 'GANGA', 'Ganges Basin', 'Uttarakhand', 30.378, 78.48, 358, 274, 74, 'HIGH', 828.5, 825.0, 830.0, 835.0, 2900, 4.1, 42.0, 'RISING', 'Reservoir Inflow Surpass & Siltation Inflow', 'Regulate spillway gate release to 1,200 cumecs', true, 'CWC-UK-BHAG-003', {downstreamNodeId: 'riv-ganga-haridwar', damName: 'Tehri Dam (THDC)'}),
  makePt('riv-ganga-haridwar', 'Ganga at Haridwar (Bhimyoda Barrage)', 'Ganga River', 'GANGA', 'Ganges Basin', 'Uttarakhand', 29.945, 78.164, 348, 300, 76, 'HIGH', 293.4, 293.0, 294.0, 296.3, 14500, 3.8, 48.0, 'RISING', 'Mainstem Surge Convergence from Upper Himalaya', 'Divert excess discharge into Upper Ganga Canal', true, 'CWC-UK-GANG-004', {downstreamNodeId: 'riv-ganga-varanasi', damName: 'Bhimyoda Barrage'}),
  makePt('riv-yamuna-delhi', 'Yamuna at Delhi (Old Railway Bridge)', 'Yamuna River', 'GANGA', 'Ganges Basin', 'Delhi NCR', 28.667, 77.242, 326, 342, 81, 'CRITICAL', 206.4, 204.5, 205.33, 208.66, 9800, 2.9, 52.0, 'RISING_FAST', 'Hathnikund Barrage Surge & Floodplain Submergence', 'Evacuate Yamuna floodplains (Monastery / Yamuna Bazar); close Ring Road low crossings', true, 'CWC-DL-YAMU-005', {damName: 'Hathnikund Barrage Upstream'}),
  makePt('riv-kosi-birpur', 'Kosi at Birpur Barrage (Sorrow of Bihar)', 'Kosi River', 'GANGA', 'Ganges Basin', 'Bihar', 26.52, 86.99, 588, 400, 92, 'CRITICAL', 74.8, 73.5, 74.2, 76.5, 18900, 4.6, 92.0, 'RISING_FAST', 'Transboundary Nepal Torrent & Embankment Breach', 'Open 42/56 barrage gates; NDRF alert across Supaul, Saharsa, Madhepura', true, 'CWC-BR-KOSI-006', {downstreamNodeId: 'riv-ganga-patna', damName: 'Kosi Barrage (Birpur)'}),
  makePt('riv-gandak-valmiki', 'Gandak at Valmiki Nagar Barrage', 'Gandak River', 'GANGA', 'Ganges Basin', 'Bihar', 27.42, 83.9, 510, 375, 76, 'HIGH', 107.2, 106.0, 107.0, 109.1, 11200, 3.5, 61.0, 'RISING', 'Nepal Catchment Cloudburst Runoff', 'Alert West Champaran district administration', true, 'CWC-BR-GAND-007', {damName: 'Gandak Barrage'}),
  makePt('riv-ganga-patna', 'Ganga at Patna (Digha Ghat)', 'Ganga River', 'GANGA', 'Ganges Basin', 'Bihar', 25.62, 85.11, 535, 425, 79, 'HIGH', 50.8, 49.5, 50.5, 52.52, 24000, 2.8, 46.0, 'RISING', 'Triple River Surcharge (Ganga + Gandak + Ghaghara)', 'Reinforce urban protection dykes along Digha-Danapur', false, 'CWC-BR-GANG-008'),
  makePt('riv-hooghly-kolkata', 'Hooghly at Kolkata (Garden Reach)', 'Hooghly River', 'GANGA', 'Ganges Basin', 'West Bengal', 22.54, 88.31, 625, 530, 71, 'HIGH', 5.6, 5.0, 5.5, 6.8, 12500, 3.2, 55.0, 'RISING', 'Bore Tide & Urban Drainage Congestion', 'Close lock gates during high tide surge', true, 'CWC-WB-HOOG-009', {damName: 'Farakka Barrage Upstream'}),
  // ─── 2. BRAHMAPUTRA & BARAK BASIN ───
  makePt('riv-siang-pasighat', 'Siang at Pasighat (Entry into India)', 'Siang River (Yarlung Tsangpo)', 'BRAHMAPUTRA', 'Brahmaputra Basin', 'Arunachal Pradesh', 28.06, 95.33, 840, 310, 88, 'CRITICAL', 154.2, 152.5, 153.96, 157.0, 16500, 6.8, 85.0, 'RISING_FAST', 'Transboundary Flash Flood & Glacial Lake Surges', 'High alert for Siang and Dibang valley villages', false, 'CWC-AR-SIAN-010', {downstreamNodeId: 'riv-brahmaputra-dibrugarh'}),
  makePt('riv-brahmaputra-dibrugarh', 'Brahmaputra at Dibrugarh', 'Brahmaputra River', 'BRAHMAPUTRA', 'Brahmaputra Basin', 'Assam', 27.48, 94.91, 830, 330, 94, 'CRITICAL', 106.3, 104.7, 105.7, 107.5, 32000, 4.5, 98.0, 'RISING_FAST', 'Catastrophic Riverine Inundation & Embankment Erosion', 'Execute mass evacuation in Dhemaji, Lakhimpur, Dibrugarh', false, 'CWC-AS-BRAH-011', {downstreamNodeId: 'riv-brahmaputra-guwahati'}),
  makePt('riv-brahmaputra-guwahati', 'Brahmaputra at Guwahati (Saraighat)', 'Brahmaputra River', 'BRAHMAPUTRA', 'Brahmaputra Basin', 'Assam', 26.18, 91.75, 740, 375, 89, 'CRITICAL', 50.4, 48.68, 49.68, 51.46, 48000, 3.9, 72.0, 'RISING_FAST', 'Overtopping of River Protection Walls & Ferry Halts', 'Suspend inland water transport; deploy NDRF Team 1', false, 'CWC-AS-BRAH-012'),
  makePt('riv-teesta-chungthang', 'Teesta at Chungthang / Singtam', 'Teesta River', 'BRAHMAPUTRA', 'Brahmaputra Basin', 'Sikkim', 27.6, 88.65, 635, 350, 89, 'CRITICAL', 8.9, 7.5, 8.2, 11.2, 5200, 7.4, 78.0, 'RISING_FAST', 'Post-South Lhonak GLOF Debris & Dam Breach Channel', 'Evacuate Singtam & Rangpo riverside markets immediately', true, 'CWC-SK-TEES-013', {damName: 'Teesta-III Dam Site'}),
  makePt('riv-barak-silchar', 'Barak at Silchar (Annapurna Ghat)', 'Barak River', 'BRAHMAPUTRA', 'Brahmaputra Basin', 'Assam', 24.83, 92.79, 775, 435, 84, 'CRITICAL', 20.6, 19.33, 19.83, 21.8, 8400, 2.7, 86.0, 'RISING_FAST', 'Bethukandi Dyke Surcharge & Urban Valley Inundation', 'Activate auxiliary storm pumps; station rescue boats at Circuit House', false, 'CWC-AS-BARA-014'),
  makePt('riv-kopili-nagaon', 'Kopili at Kampur (Nagaon)', 'Kopili River', 'BRAHMAPUTRA', 'Brahmaputra Basin', 'Assam', 25.9, 92.65, 765, 395, 72, 'HIGH', 61.2, 59.5, 60.5, 62.1, 4100, 3.1, 62.0, 'RISING', 'NEEPCO Dam Spillage & Railway Track Submergence', 'Halt Lumding-Guwahati train services along low track KM 44', true, 'CWC-AS-KOPI-015', {damName: 'Kopili Hydro Electric Project'}),
  // ─── 3. INDUS BASIN ───
  makePt('riv-jhelum-srinagar', 'Jhelum at Srinagar (Ram Munshi Bagh)', 'Jhelum River', 'INDUS', 'Indus Basin', 'Jammu & Kashmir', 34.08, 74.8, 250, 130, 77, 'HIGH', 19.4, 18.0, 19.0, 22.8, 4200, 2.8, 45.0, 'RISING', 'Dal Lake Backwater & Low-Lying Mohalla Flood', 'Open flood spill channel at Padshahi Bagh to 8,000 cusecs', false, 'CWC-JK-JHEL-016'),
  makePt('riv-chenab-akhnoor', 'Chenab at Akhnoor Bridge', 'Chenab River', 'INDUS', 'Indus Basin', 'Jammu & Kashmir', 32.89, 74.74, 258, 180, 65, 'HIGH', 10.4, 9.5, 10.0, 13.5, 8900, 4.8, 38.0, 'RISING', 'Salal / Baglihar Dam Outflow Surges', 'Sound warning across Akhnoor-Pargwal border villages', true, 'CWC-JK-CHEN-017', {damName: 'Salal & Baglihar Dams Upstream'}),
  makePt('riv-beas-mandi', 'Beas at Mandi / Pandoh Dam', 'Beas River', 'INDUS', 'Indus Basin', 'Himachal Pradesh', 31.7, 76.93, 310, 220, 83, 'CRITICAL', 885.6, 882.0, 885.0, 892.0, 7800, 5.6, 72.0, 'RISING_FAST', 'Kullu Cloudburst Debris Wave & Bridge Sweeping', 'Close Pandoh-Kullu NH-21; open Pandoh spillway gates', true, 'CWC-HP-BEAS-018', {damName: 'Pandoh Dam'}),
  makePt('riv-satluj-bhakra', 'Satluj at Bhakra Reservoir', 'Satluj River', 'INDUS', 'Indus Basin', 'Himachal Pradesh / Punjab', 31.41, 76.43, 295, 235, 71, 'HIGH', 1678.0, 1675.0, 1680.0, 1685.0, 14200, 3.4, 41.0, 'STEADY', 'Tibet Spiti Glacial Runoff Surge', 'BBMB coordination for controlled power-channel discharge', true, 'CWC-HP-SATL-019', {damName: 'Bhakra Nangal Dam'}),
  // ─── 4. GODAVARI BASIN ───
  makePt('riv-godavari-nashik', 'Godavari at Nashik (Ramkund)', 'Godavari River', 'GODAVARI', 'Godavari Basin', 'Maharashtra', 19.99, 73.79, 260, 600, 62, 'MODERATE', 6.2, 5.5, 6.0, 8.5, 3800, 3.2, 52.0, 'RISING', 'Gangapur Dam Water Discharge into City Channels', 'Clear Ramkund riverside vehicles and vendors', true, 'CWC-MH-GODA-020', {downstreamNodeId: 'riv-godavari-bhadrachalam', damName: 'Gangapur Dam'}),
  makePt('riv-godavari-bhadrachalam', 'Godavari at Bhadrachalam Temple Town', 'Godavari River', 'GODAVARI', 'Godavari Basin', 'Telangana', 17.67, 80.88, 470, 670, 85, 'CRITICAL', 54.2, 48.0, 53.0, 75.6, 21500, 4.8, 79.0, 'RISING_FAST', '3rd Level Flood Warning: Inundation of Temple Karakat', 'Issue Red Warning 3; evacuate low-lying colonies to relief centers', false, 'CWC-TS-GODA-021', {downstreamNodeId: 'riv-godavari-rajahmundry'}),
  makePt('riv-godavari-rajahmundry', 'Godavari at Dowleswaram Barrage (Rajahmundry)', 'Godavari River', 'GODAVARI', 'Godavari Basin', 'Andhra Pradesh', 16.94, 81.77, 505, 710, 81, 'CRITICAL', 14.8, 13.75, 14.75, 17.5, 28500, 3.6, 68.0, 'RISING', 'Delta Inundation & Island Village Cut-Off (Konaseema)', 'Lift all 175 barrage gates; supply power boats to island villages', true, 'CWC-AP-GODA-022', {damName: 'Sir Arthur Cotton Barrage'}),
  makePt('riv-pranhita-kaleshwaram', 'Pranhita at Kaleshwaram Confluence', 'Pranhita River', 'GODAVARI', 'Godavari Basin', 'Telangana / Maharashtra', 18.81, 79.91, 430, 620, 73, 'HIGH', 104.2, 102.0, 103.5, 108.0, 14200, 4.1, 58.0, 'RISING', 'Massive Wardha-Wainganga Catchment Torrent', 'Coordinate Medigadda Barrage gate operations', true, 'CWC-TS-PRAN-023', {downstreamNodeId: 'riv-godavari-bhadrachalam', damName: 'Medigadda Barrage'}),
  // ─── 5. KRISHNA BASIN ───
  makePt('riv-krishna-sangli', 'Krishna at Sangli (Irwin Bridge)', 'Krishna River', 'KRISHNA', 'Krishna Basin', 'Maharashtra', 16.85, 74.58, 280, 710, 81, 'CRITICAL', 46.2, 40.0, 45.0, 57.5, 9400, 3.9, 82.0, 'RISING_FAST', 'Koyna Dam + Radhanagari Release Backwater', 'Evacuate Haripur and Sangli riverside settlements', true, 'CWC-MH-KRIS-024', {downstreamNodeId: 'riv-krishna-vijayawada', damName: 'Koyna Dam Upstream'}),
  makePt('riv-tungabhadra-mantralayam', 'Tungabhadra at Mantralayam', 'Tungabhadra River', 'KRISHNA', 'Krishna Basin', 'Andhra Pradesh', 15.93, 77.42, 375, 735, 69, 'HIGH', 312.4, 310.0, 311.5, 316.0, 7500, 3.1, 46.0, 'STEADY', 'Tungabhadra Dam (Hospet) Gate Outburst', 'Temple town flood walls monitored; keep NDRF on standby', true, 'CWC-AP-TUNG-025', {damName: 'Tungabhadra Dam'}),
  makePt('riv-krishna-vijayawada', 'Krishna at Vijayawada (Prakasam Barrage)', 'Krishna River', 'KRISHNA', 'Krishna Basin', 'Andhra Pradesh', 16.51, 80.61, 460, 740, 75, 'HIGH', 12.8, 11.5, 12.5, 15.2, 18400, 3.4, 62.0, 'RISING', 'Munneru & Budameru Flash Runoff Convergence', 'Lift 70 gates of Prakasam Barrage; alert Krishna Delta farmers', true, 'CWC-AP-KRIS-026', {damName: 'Prakasam Barrage'}),
  // ─── 6. CAUVERY BASIN ───
  makePt('riv-cauvery-krs', 'Cauvery at KRS Dam (Mandya)', 'Cauvery River', 'CAUVERY', 'Cauvery Basin', 'Karnataka', 12.42, 76.57, 340, 840, 72, 'HIGH', 124.8, 122.0, 124.8, 125.5, 6200, 3.1, 58.0, 'RISING', 'Coorg Hills Torrent Inflow to Maximum Reservoir Level', 'Release 60,000 cusecs downstream; alert Srirangapatna', true, 'CWC-KA-CAUV-027', {downstreamNodeId: 'riv-cauvery-mettur', damName: 'Krishna Raja Sagara (KRS)'}),
  makePt('riv-kabini-wayanad', 'Kabini at Wayanad Catchment', 'Kabini River', 'CAUVERY', 'Cauvery Basin', 'Kerala / Karnataka', 11.75, 76.15, 320, 865, 84, 'CRITICAL', 2282.4, 2280.0, 2282.0, 2285.0, 5100, 5.2, 112.0, 'RISING_FAST', 'Chooralmala / Meppadi Landslide Runoff Surge', 'Emergency spillway activation; evacuate downstream Banasura banks', true, 'CWC-KL-KABI-028', {downstreamNodeId: 'riv-cauvery-krs', damName: 'Kabini Dam'}),
  makePt('riv-cauvery-mettur', 'Cauvery at Mettur Dam (Salem)', 'Cauvery River', 'CAUVERY', 'Cauvery Basin', 'Tamil Nadu', 11.8, 77.8, 390, 860, 66, 'HIGH', 119.4, 116.0, 120.0, 122.0, 8900, 2.9, 38.0, 'RISING', 'Full Reservoir Level Buffer & Downstream Delta Surge', 'Maintain controlled discharge to Bhavani/Erode channel', true, 'CWC-TN-CAUV-029', {damName: 'Mettur Dam (Stanley Reservoir)'}),
  // ─── 7. NARMADA & TAPI BASINS ───
  makePt('riv-narmada-sardar', 'Narmada at Sardar Sarovar Dam', 'Narmada River', 'NARMADA_TAPI', 'Narmada & Tapi Basin', 'Gujarat', 21.83, 73.75, 250, 530, 76, 'HIGH', 138.68, 135.0, 138.68, 140.2, 16500, 4.2, 68.0, 'RISING', 'Omkareshwar / Indira Sagar Combined Spill Surge', 'Open 23 radial gates; issue alert for Bharuch low areas', true, 'CWC-GJ-NARM-030', {damName: 'Sardar Sarovar Dam'}),
  makePt('riv-tapi-surat', 'Tapi at Surat (Singanpore Weir)', 'Tapi River', 'NARMADA_TAPI', 'Narmada & Tapi Basin', 'Gujarat', 21.22, 72.84, 225, 560, 70, 'HIGH', 9.8, 8.5, 9.5, 12.8, 11800, 3.1, 54.0, 'RISING', 'Ukai Dam Release + High Tide Sea Inundation', 'Coordinate Ukai discharge with high-tide forecast table', true, 'CWC-GJ-TAPI-031', {damName: 'Ukai Dam Upstream'}),
  // ─── 8. MAHANADI BASIN ───
  makePt('riv-mahanadi-hirakud', 'Mahanadi at Hirakud Dam (Sambalpur)', 'Mahanadi River', 'MAHANADI', 'Mahanadi Basin', 'Odisha', 21.57, 83.87, 495, 535, 87, 'CRITICAL', 629.8, 625.0, 630.0, 632.0, 19800, 4.8, 88.0, 'RISING_FAST', 'Chhattisgarh Catchment Extreme Rainfall (Mundra/Hasdeo)', 'Open 28 sluice gates; alert Sambalpur, Sonepur, Cuttack', true, 'CWC-OR-MAHA-032', {downstreamNodeId: 'riv-mahanadi-cuttack', damName: 'Hirakud Dam'}),
  makePt('riv-mahanadi-cuttack', 'Mahanadi at Mundali Barrage (Cuttack)', 'Mahanadi River', 'MAHANADI', 'Mahanadi Basin', 'Odisha', 20.45, 85.75, 560, 575, 84, 'CRITICAL', 29.2, 27.5, 28.5, 31.4, 26000, 3.7, 74.0, 'RISING_FAST', 'Delta Embankment Overtopping & Coastal Backflow', 'Evacuate Kendrapara, Puri, Jagatsinghpur low zones', true, 'CWC-OR-MAHA-033', {damName: 'Mundali Barrage'}),
  // ─── 9. WESTERN GHATS & URBAN METROS ───
  makePt('riv-periyar-aluva', 'Periyar at Aluva / Idukki Spillway', 'Periyar River', 'WESTERN_COASTAL', 'Western Coastal Basin', 'Kerala', 10.11, 76.35, 330, 900, 85, 'CRITICAL', 4.8, 3.8, 4.5, 6.2, 6800, 4.9, 96.0, 'RISING_FAST', 'Idukki / Cheruthoni Dam Release + Cochin Backwaters', 'Evacuate Aluva Mahadeva Temple bank; alert Kochi Airport (CIAL)', true, 'CWC-KL-PERI-034', {damName: 'Idukki Dam & Cheruthoni Spillway'}),
  makePt('riv-vashishti-chiplun', 'Vashishti at Chiplun Market Town', 'Vashishti River', 'WESTERN_COASTAL', 'Western Coastal Basin', 'Maharashtra', 17.53, 73.51, 245, 690, 91, 'CRITICAL', 7.8, 6.0, 7.0, 9.8, 5400, 5.6, 124.0, 'RISING_FAST', 'Narrow Valley High Tide Trap & Koyna Stage-IV Tailrace', 'Immediate town rooftop evacuation; NDRF boats at Chiplun Bus Stand', true, 'CWC-MH-VASH-035', {damName: 'Koyna Hydro Stage-IV Tailrace'}),
  makePt('riv-mithi-mumbai', 'Mithi River at BKC / Kurla', 'Mithi River', 'WESTERN_COASTAL', 'Western Coastal Basin', 'Maharashtra', 19.06, 72.87, 215, 635, 89, 'CRITICAL', 3.9, 2.8, 3.5, 5.1, 1450, 2.6, 104.0, 'RISING_FAST', '4.5m High Tide Surge + Urban Drainage Surcharge', 'Close Kurla railway underpasses; activate Mahim causeway pumps', false, 'CWC-MH-MITH-036'),
  makePt('riv-pamba-chengannur', 'Pamba at Chengannur / Ranni', 'Pamba River', 'WESTERN_COASTAL', 'Western Coastal Basin', 'Kerala', 9.32, 76.62, 345, 925, 78, 'HIGH', 8.6, 7.2, 8.0, 10.4, 4900, 4.1, 82.0, 'RISING', 'Sabarimala Foothill Deluge & Kuttanad Waterlogging', 'Pre-position SDRF at Ranni; clear Chengannur relief shelters', true, 'CWC-KL-PAMB-037', {damName: 'Kakki Dam Upstream'}),
];

// Major Indian River Vector Channel Paths (Realistic Geographic SVG Coordinates)
export const NATIONAL_RIVER_PATHS: RiverVectorPath[] = [
  {
    id: 'path-ganga',
    name: 'Ganges Mainstem & Tributaries',
    basin: 'GANGA',
    color: '#06b6d4',
    strokeWidth: 3.5,
    pathData: 'M 382,268 L 370,280 L 348,300 Q 420,360 510,375 T 535,425 T 588,400 T 625,530',
    flowDirection: 'FORWARD',
  },
  {
    id: 'path-yamuna',
    name: 'Yamuna River',
    basin: 'GANGA',
    color: '#38bdf8',
    strokeWidth: 2.5,
    pathData: 'M 358,274 Q 330,310 326,342 Q 380,410 535,425',
    flowDirection: 'FORWARD',
  },
  {
    id: 'path-brahmaputra',
    name: 'Brahmaputra Mainstem',
    basin: 'BRAHMAPUTRA',
    color: '#a855f7',
    strokeWidth: 4.0,
    pathData: 'M 840,310 L 830,330 Q 790,360 765,395 Q 740,375 700,430',
    flowDirection: 'FORWARD',
  },
  {
    id: 'path-teesta',
    name: 'Teesta River',
    basin: 'BRAHMAPUTRA',
    color: '#c084fc',
    strokeWidth: 2.2,
    pathData: 'M 635,350 Q 645,410 700,430',
    flowDirection: 'FORWARD',
  },
  {
    id: 'path-indus-jhelum',
    name: 'Jhelum & Chenab System',
    basin: 'INDUS',
    color: '#3b82f6',
    strokeWidth: 3.0,
    pathData: 'M 250,130 Q 254,160 258,180 Q 240,210 210,250',
    flowDirection: 'FORWARD',
  },
  {
    id: 'path-beas-satluj',
    name: 'Beas & Satluj System',
    basin: 'INDUS',
    color: '#60a5fa',
    strokeWidth: 2.8,
    pathData: 'M 310,220 L 295,235 Q 260,260 210,250',
    flowDirection: 'FORWARD',
  },
  {
    id: 'path-godavari',
    name: 'Godavari Mainstem',
    basin: 'GODAVARI',
    color: '#f59e0b',
    strokeWidth: 3.5,
    pathData: 'M 260,600 Q 350,610 430,620 Q 470,670 505,710',
    flowDirection: 'FORWARD',
  },
  {
    id: 'path-krishna',
    name: 'Krishna & Tungabhadra',
    basin: 'KRISHNA',
    color: '#ec4899',
    strokeWidth: 3.2,
    pathData: 'M 280,710 Q 330,720 375,735 Q 420,740 460,740',
    flowDirection: 'FORWARD',
  },
  {
    id: 'path-cauvery',
    name: 'Cauvery River',
    basin: 'CAUVERY',
    color: '#10b981',
    strokeWidth: 2.8,
    pathData: 'M 320,865 L 340,840 Q 370,850 390,860 Q 430,870 450,880',
    flowDirection: 'FORWARD',
  },
  {
    id: 'path-narmada',
    name: 'Narmada River',
    basin: 'NARMADA_TAPI',
    color: '#f97316',
    strokeWidth: 3.0,
    pathData: 'M 480,510 Q 360,520 250,530 Q 220,540 190,550',
    flowDirection: 'FORWARD',
  },
  {
    id: 'path-mahanadi',
    name: 'Mahanadi System',
    basin: 'MAHANADI',
    color: '#e11d48',
    strokeWidth: 3.2,
    pathData: 'M 460,510 L 495,535 Q 530,550 560,575 Q 590,585 610,590',
    flowDirection: 'FORWARD',
  },
  {
    id: 'path-periyar-pamba',
    name: 'Periyar & Pamba Coastal',
    basin: 'WESTERN_COASTAL',
    color: '#6366f1',
    strokeWidth: 2.5,
    pathData: 'M 345,925 L 330,900 Q 310,910 290,920',
    flowDirection: 'FORWARD',
  },
];
