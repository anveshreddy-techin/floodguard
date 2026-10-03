export type IndiaDisasterZone = 
  | 'HIMALAYAN_NORTH' 
  | 'NORTHEAST_BRAHMAPUTRA' 
  | 'WESTERN_GHATS_COASTAL' 
  | 'PENINSULAR_CENTRAL' 
  | 'URBAN_METRO' 
  | 'EASTERN_DELTA'
  | 'COASTAL_CYCLONE';

export type DisasterApplicationType =
  | 'FLASH_FLOOD_CLOUDBURST'
  | 'GLOF_GLACIAL_OUTBURST'
  | 'URBAN_STORMWATER_INUNDATION'
  | 'DEBRIS_LANDSLIDE_CASCADE'
  | 'RESERVOIR_DAM_SPILL'
  | 'COASTAL_ESTUARINE_SURGE';

export interface LocationDossier {
  id: string;
  name: string;
  state: string;
  region: string;
  zone: IndiaDisasterZone;
  application: DisasterApplicationType;
  lat: number;
  lon: number;
  elevation: string;
  population: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  rainfall3h: string;
  soilMoisture: string;
  riverStage: string;
  leadTimeMinutes: number;
  primaryHazard: string;
  authoritativeAgency: string;
}

const loc = (
  id: string, name: string, state: string, region: string, zone: IndiaDisasterZone,
  application: DisasterApplicationType, lat: number, lon: number, elevation: string,
  population: number, riskScore: number, riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME',
  rainfall3h: string, soilMoisture: string, riverStage: string, leadTimeMinutes: number,
  primaryHazard: string, authoritativeAgency: string
): LocationDossier => ({
  id, name, state, region, zone, application, lat, lon, elevation,
  population, riskScore, riskLevel, rainfall3h, soilMoisture, riverStage,
  leadTimeMinutes, primaryHazard, authoritativeAgency
});

// 🇮🇳 Comprehensive Pan-India Multi-Basin Disaster Location Registry (41 Monitored Locations)
export const LOCATIONS: LocationDossier[] = [
  loc('loc-uk-chamoli', 'Raini Village', 'Uttarakhand', 'Chamoli District (Dhauliganga & Rishiganga Confluence)', 'HIMALAYAN_NORTH', 'FLASH_FLOOD_CLOUDBURST', 30.4850, 79.6920, '2,040 m ASL', 1850, 78.0, 'HIGH', '42.5 mm / 1h', '86%', 'Rising level (Simulation)', 42, 'Model-Estimated Flash-Flood Risk in Steep Hilly Catchment', 'FloodGuard AI Demonstration Scenario'),
  loc('loc-uk-kedarnath', 'Kedarnath Base / Mandakini Gorge', 'Uttarakhand', 'Garhwal Himalaya (Chorabari Catchment)', 'HIMALAYAN_NORTH', 'FLASH_FLOOD_CLOUDBURST', 30.7346, 79.0669, '3,583 m ASL', 2400, 82.5, 'EXTREME', '78.5 mm', '95% (Saturated)', '4.80 m (+0.80 m/h)', 20, 'Orographic Cloudburst & Lake Overflow Cascade', 'IMD & NDMA'),
  loc('loc-hp-kullu', 'Kullu Valley / Beas River Mainstem', 'Himachal Pradesh', 'Upper Beas Basin (Manali-Kullu Sector)', 'HIMALAYAN_NORTH', 'FLASH_FLOOD_CLOUDBURST', 31.9579, 77.1095, '1,278 m ASL', 18500, 68.0, 'HIGH', '52.0 mm', '84%', '4.10 m (+0.45 m/h)', 38, 'Torrential River Surge & Highway Bank Erosion', 'CWC & Himachal HP-SDMA'),
  loc('loc-jk-srinagar', 'Srinagar / Jhelum River Floodplain', 'Jammu & Kashmir', 'Kashmir Valley (Jhelum Basin)', 'HIMALAYAN_NORTH', 'RESERVOIR_DAM_SPILL', 34.0837, 74.7973, '1,585 m ASL', 1250000, 54.0, 'MODERATE', '32.0 mm', '78%', '18.4 ft (Gauge)', 65, 'Alluvial Basin Waterlogging & Spill Channel Inundation', 'Irrigation & Flood Control J&K'),
  loc('loc-as-guwahati', 'Guwahati / Brahmaputra Confluence', 'Assam', 'Kamrup Metro (Brahmaputra Basin)', 'NORTHEAST_BRAHMAPUTRA', 'URBAN_STORMWATER_INUNDATION', 26.1445, 91.7362, '55 m ASL', 960000, 71.0, 'HIGH', '62.0 mm', '91%', '49.85 m (Danger: 49.68m)', 45, 'Simultaneous River Surge & City Stormwater Backflow', 'CWC & ASDMA Assam'),
  loc('loc-sk-teesta', 'Chungthang / Teesta Basin GLOF Corridor', 'Sikkim', 'North Sikkim (South Lhonak Catchment)', 'NORTHEAST_BRAHMAPUTRA', 'GLOF_GLACIAL_OUTBURST', 27.6039, 88.6464, '1,790 m ASL', 4200, 79.5, 'EXTREME', '38.0 mm', '88%', '6.40 m (Surge Crest)', 15, 'South Lhonak Glacial Lake Outburst & Dam Breach', 'NRSC/ISRO & Sikkim SDMA'),
  loc('loc-mg-cherrapunji', 'Cherrapunji / Mawsynram Gorge Corridor', 'Meghalaya', 'East Khasi Hills (Southern Escarpment)', 'NORTHEAST_BRAHMAPUTRA', 'FLASH_FLOOD_CLOUDBURST', 25.2702, 91.7323, '1,430 m ASL', 11000, 76.0, 'HIGH', '124.0 mm', '98%', '4.90 m (+1.10 m/h)', 25, 'Hyper-Extreme Orographic Cloudburst & Valley Runoff', 'IMD AWS & Meghalaya SDMA'),
  loc('loc-ar-pasighat', 'Pasighat / Siang River Gorge', 'Arunachal Pradesh', 'East Siang (Yarlung Tsangpo Confluence)', 'NORTHEAST_BRAHMAPUTRA', 'FLASH_FLOOD_CLOUDBURST', 28.0664, 95.3263, '155 m ASL', 28000, 63.5, 'HIGH', '45.0 mm', '82%', '153.20 m ASL', 50, 'Transboundary Upstream Wave Arrival & Gorge Inundation', 'CWC Siang Monitoring'),
  loc('loc-kl-wayanad', 'Meppadi / Chooralmala Valley', 'Kerala', 'Wayanad Ghats (Chaliyar Basin)', 'WESTERN_GHATS_COASTAL', 'DEBRIS_LANDSLIDE_CASCADE', 11.5540, 76.1340, '890 m ASL', 8600, 84.0, 'EXTREME', '88.0 mm', '96% (Fluidized)', '4.50 m (+0.95 m/h)', 18, 'Multi-Slope Colluvial Debris Surge & River Choking', 'GSI & Kerala KSDMA'),
  loc('loc-mh-chiplun', 'Chiplun / Vashishti River Gorge', 'Maharashtra', 'Konkan Coast (Western Ghats Escarpment)', 'WESTERN_GHATS_COASTAL', 'FLASH_FLOOD_CLOUDBURST', 17.5323, 73.5186, '15 m ASL', 55000, 73.0, 'HIGH', '74.0 mm', '92%', '7.80 m (Danger: 7.00m)', 30, 'Koyna Ghat Torrential Spills & High-Tide Estuary Lock', 'CWC & Maharashtra SDMA'),
  loc('loc-ka-kodagu', 'Madikeri / Netravati Catchment Spur', 'Karnataka', 'Kodagu Highlands (Cauvery/Netravati Ridge)', 'WESTERN_GHATS_COASTAL', 'DEBRIS_LANDSLIDE_CASCADE', 12.4244, 75.7382, '1,150 m ASL', 32000, 61.0, 'HIGH', '46.0 mm', '86%', '3.60 m (+0.35 m/h)', 40, 'Slope Saturated Soil Slip & Feeder Stream Surge', 'KSNDMC Karnataka'),
  loc('loc-mh-mumbai', 'Mumbai City / Mithi River & Kurla Basin', 'Maharashtra', 'Mumbai Metropolitan (Mithi Basin)', 'URBAN_METRO', 'URBAN_STORMWATER_INUNDATION', 19.0760, 72.8777, '8 m ASL', 12500000, 77.0, 'HIGH', '85.0 mm', '98% (Impervious)', '4.20 m (Tidal Lock)', 22, 'Extreme Convection + 4.5m High Tide Stormwater Lock', 'MCGM & IMD Mumbai Doppler'),
  loc('loc-ka-bengaluru', 'Bengaluru / Vrishabhavathi & Bellandur Cascade', 'Karnataka', 'Bengaluru Urban (Dakshina Pinakini Basin)', 'URBAN_METRO', 'URBAN_STORMWATER_INUNDATION', 12.9716, 77.5946, '920 m ASL', 8400000, 59.0, 'HIGH', '55.0 mm', '90%', '2.80 m (Over-Drain)', 35, 'Interconnected Lake Cascade Breaches & SWD Backflow', 'BBMP & KSNDMC'),
  loc('loc-tn-chennai', 'Chennai / Adyar & Cooum River Basin', 'Tamil Nadu', 'Chennai Coastal Corridor (Adyar Basin)', 'URBAN_METRO', 'COASTAL_ESTUARINE_SURGE', 13.0827, 80.2707, '6 m ASL', 7100000, 66.5, 'HIGH', '68.0 mm', '94%', '3.90 m (+0.60 m/h)', 30, 'Chembarambakkam Reservoir Spill & Cyclone Backwater', 'TNSDMA & IMD Chennai'),
  loc('loc-ts-hyderabad', 'Hyderabad / Musi River & Hussain Sagar', 'Telangana', 'Hyderabad Urban (Musi Catchment)', 'URBAN_METRO', 'URBAN_STORMWATER_INUNDATION', 17.3850, 78.4867, '505 m ASL', 6800000, 58.5, 'HIGH', '48.0 mm', '85%', '3.40 m (Bankfull)', 40, 'Stormwater Nala Bottlenecks & Low-Lying Musi Overflow', 'GHMC & TSDMA'),
  loc('loc-or-mahanadi', 'Cuttack Delta / Mahanadi-Kathajodi Confluence', 'Odisha', 'Mahanadi Delta (Coastal Odisha)', 'PENINSULAR_CENTRAL', 'RESERVOIR_DAM_SPILL', 20.4625, 85.8828, '36 m ASL', 610000, 64.0, 'HIGH', '42.0 mm', '88%', '26.80 m (Gauge)', 60, 'Hirakud Dam 28-Gate Discharge Flood Wave Propagation', 'CWC & OSDMA Odisha'),
  loc('loc-ts-godavari', 'Bhadrachalam / Godavari Mainstem Gorge', 'Telangana', 'Lower Godavari Basin', 'PENINSULAR_CENTRAL', 'RESERVOIR_DAM_SPILL', 17.6689, 80.8936, '50 m ASL', 50000, 70.5, 'HIGH', '58.0 mm', '89%', '53.40 ft (Danger: 53.0ft)', 55, 'Upper Catchment Inflow & Srisailam/Polavaram Backwater', 'CWC Lower Godavari Circle'),
  loc('loc-mp-narmada', 'Hoshangabad / Narmada Ghat Corridor', 'Madhya Pradesh', 'Central Narmada Basin', 'PENINSULAR_CENTRAL', 'RESERVOIR_DAM_SPILL', 22.7519, 77.7289, '298 m ASL', 118000, 56.0, 'MODERATE', '35.0 mm', '80%', '964.20 ft (Danger: 964ft)', 50, 'Tawa Dam & Bargi Reservoir Synchronous Discharge', 'CWC Narmada Basin'),
  loc('loc-br-kosi', 'Supaul / Kosi River Active Embankment Zone', 'Bihar', 'Mithila Plains (Saptakoshi Transboundary)', 'EASTERN_DELTA', 'RESERVOIR_DAM_SPILL', 26.1260, 86.6040, '45 m ASL', 65000, 75.0, 'HIGH', '60.0 mm', '95%', '4.85 m (Embankment)', 48, 'Transboundary Siltation & High-Energy Embankment Breach', 'Disaster Management Dept Bihar & CWC'),
  loc('loc-wb-sundarbans', 'Gosaba / Sundarbans Estuarine Island Delta', 'West Bengal', 'South 24 Parganas (Matla/Bidya Estuary)', 'EASTERN_DELTA', 'COASTAL_ESTUARINE_SURGE', 22.1650, 88.8050, '3 m ASL', 245000, 69.0, 'HIGH', '50.0 mm', '97%', '3.60 m (High Tide Surge)', 35, 'Cyclone Wave Surge + Embankment Earthen Ring Overtopping', 'WB-SDMA & INCOIS'),
  loc('loc-dl-yamuna', 'Delhi Yamuna Floodplain Corridor', 'Delhi (NCT)', 'Central Delhi (Old Railway Bridge Sector)', 'URBAN_METRO', 'URBAN_STORMWATER_INUNDATION', 28.6562, 77.2410, '216 m ASL', 1450000, 64.0, 'HIGH', '42.0 mm', '88%', '205.80 m (Danger: 205.33m)', 45, 'Hathnikund Barrage Discharge & Drain Backflow', 'CWC & Delhi DDMA'),
  loc('loc-la-leh', 'Leh Valley & Indus Confluence', 'Ladakh', 'Leh District (Zanskar-Indus Sector)', 'HIMALAYAN_NORTH', 'GLOF_GLACIAL_OUTBURST', 34.1526, 77.5771, '3,500 m ASL', 30800, 58.0, 'MODERATE', '12.0 mm', '45%', '2.80 m (Normal)', 25, 'High-Altitude Cryosphere Outburst & Flash Debris', 'Ladakh Disaster Authority'),
  loc('loc-gj-surat', 'Surat City / Tapi Estuary Basin', 'Gujarat', 'South Gujarat (Ukai Dam Catchment)', 'PENINSULAR_CENTRAL', 'RESERVOIR_DAM_SPILL', 21.1702, 72.8311, '13 m ASL', 6000000, 66.0, 'HIGH', '55.0 mm', '91%', '9.40 m (Warning: 9.5m)', 60, 'Ukai Dam Heavy Discharge & High-Tide Backwater', 'CWC & GSDMA'),
  loc('loc-up-prayagraj', 'Prayagraj / Ganga-Yamuna Sangam Doab', 'Uttar Pradesh', 'Eastern UP (Sangam Lowland Inundation)', 'EASTERN_DELTA', 'RESERVOIR_DAM_SPILL', 25.4358, 81.8463, '98 m ASL', 1530000, 62.0, 'HIGH', '38.0 mm', '89%', '84.20 m (Danger: 84.73m)', 55, 'Simultaneous Ganga & Yamuna Flood Wave Coincidence', 'CWC & UP-SDMA'),
  loc('loc-ap-vijayawada', 'Vijayawada / Prakasam Barrage Krishna Delta', 'Andhra Pradesh', 'Krishna District (Prakasam Barrage Sector)', 'PENINSULAR_CENTRAL', 'RESERVOIR_DAM_SPILL', 16.5062, 80.6480, '20 m ASL', 1480000, 71.0, 'HIGH', '64.0 mm', '94%', '11.80 lakh cusecs Discharge', 40, 'Srisailam/Nagarjuna Sagar Spillway Synchronized Discharge', 'APSDMA & CWC'),
  loc('loc-pb-harike', 'Harike Wetland / Sutlej-Beas Confluence', 'Punjab', 'Tarn Taran & Firozpur Sector', 'HIMALAYAN_NORTH', 'RESERVOIR_DAM_SPILL', 31.1444, 74.9602, '210 m ASL', 42000, 59.0, 'MODERATE', '28.0 mm', '82%', '4.10 m (Normal)', 45, 'Bhakra / Pong Dam Release Spill Routing', 'Punjab SDMA & BBMB'),
  loc('loc-rj-kota', 'Kota Barrage / Chambal River Gorges', 'Rajasthan', 'Hadoti Region (Chambal Basin)', 'PENINSULAR_CENTRAL', 'RESERVOIR_DAM_SPILL', 25.1800, 75.8300, '271 m ASL', 1200000, 54.0, 'MODERATE', '30.0 mm', '76%', '128.5 m', 50, 'Gandhi Sagar & Rana Pratap Sagar Gate Spills', 'CWC & Rajasthan DM'),
  loc('loc-ga-panaji', 'Panaji / Mandovi Coastal Estuary', 'Goa', 'North Goa (Mandovi-Zuari Estuarine Complex)', 'WESTERN_GHATS_COASTAL', 'COASTAL_ESTUARINE_SURGE', 15.4909, 73.8278, '7 m ASL', 114000, 52.0, 'MODERATE', '40.0 mm', '85%', '2.40 m (Spring Tide)', 30, 'Monsoon Torrential Runoff & Spring Tide Backflow', 'Goa SDMA & NIO'),
  loc('loc-cg-raipur', 'Raipur / Mahanadi Upper Catchment', 'Chhattisgarh', 'Raipur & Dhamtari Sector (Gangrel Catchment)', 'PENINSULAR_CENTRAL', 'RESERVOIR_DAM_SPILL', 21.2514, 81.6296, '298 m ASL', 1010000, 55.0, 'MODERATE', '32.0 mm', '78%', '348.0 m ASL', 48, 'Gangrel Dam Rapid Surcharge Release', 'Chhattisgarh Revenue & DM'),
  loc('loc-jh-dhanbad', 'Dhanbad / Damodar Valley Reservoir Complex', 'Jharkhand', 'Chota Nagpur (Maithon & Panchet Sector)', 'EASTERN_DELTA', 'RESERVOIR_DAM_SPILL', 23.7957, 86.4304, '227 m ASL', 1160000, 61.0, 'HIGH', '45.0 mm', '86%', '148.20 m (Maithon)', 52, 'DVC Multi-Reservoir Coordinated Spill & Mining Runoff', 'Damodar Valley Corp (DVC) & CWC'),
  loc('loc-tr-agartala', 'Agartala / Howrah River Basin', 'Tripura', 'West Tripura (Howrah-Titas Floodplain)', 'NORTHEAST_BRAHMAPUTRA', 'FLASH_FLOOD_CLOUDBURST', 23.8315, 91.2868, '13 m ASL', 522000, 67.0, 'HIGH', '58.0 mm', '93%', '10.80 m (Danger: 10.50m)', 35, 'Hilly Catchment Runoff & Transboundary River Surge', 'Tripura SDMA'),
  loc('loc-mn-imphal', 'Imphal Valley Inundation Sector', 'Manipur', 'Imphal East & West (Nambul & Imphal Rivers)', 'NORTHEAST_BRAHMAPUTRA', 'URBAN_STORMWATER_INUNDATION', 24.8170, 93.9368, '786 m ASL', 418000, 72.0, 'HIGH', '62.0 mm', '95%', '792.80 m (Danger: 792.00m)', 28, 'Bowl-shaped Valley Runoff & Embankment Breaches', 'Manipur Disaster Management Authority'),
  loc('loc-nl-wokha', 'Wokha / Doyang River Hydro Catchment', 'Nagaland', 'Wokha District (Doyang Reservoir Sector)', 'NORTHEAST_BRAHMAPUTRA', 'DEBRIS_LANDSLIDE_CASCADE', 26.0980, 94.2630, '1,313 m ASL', 35000, 63.0, 'HIGH', '46.0 mm', '89%', '320.0 m ASL', 32, 'High-Slope Landslide Siltation & Dam Inflow Surges', 'Nagaland NSDMA & NEEPCO'),
  loc('loc-mz-aizawl', 'Aizawl Steep Hillslope Slips & Tlawng Basin', 'Mizoram', 'Aizawl District (Tlawng River Corridor)', 'NORTHEAST_BRAHMAPUTRA', 'DEBRIS_LANDSLIDE_CASCADE', 23.7271, 92.7176, '1,132 m ASL', 293000, 70.0, 'HIGH', '68.0 mm', '96%', '4.90 m (+0.60 m/h)', 22, 'Extreme Orographic Rain & Massive Saturated Slope Liquefaction', 'Mizoram SDMA'),
  loc('loc-hr-panchkula', 'Panchkula / Ghaggar River Foothill Corridor', 'Haryana', 'Panchkula (Shivalik Foothills)', 'HIMALAYAN_NORTH', 'FLASH_FLOOD_CLOUDBURST', 30.6942, 76.8606, '365 m ASL', 561000, 60.0, 'MODERATE', '36.0 mm', '79%', '3.60 m (+0.35 m/h)', 36, 'Shivalik Torrential Runoff & Causeways Submergence', 'Haryana Revenue & DM'),
  loc('loc-py-puducherry', 'Puducherry Estuarine Delta & Gingee River', 'Puducherry', 'Puducherry Coastal Zone (Gingee & Sankaraparani)', 'COASTAL_CYCLONE', 'COASTAL_ESTUARINE_SURGE', 11.9416, 79.8083, '3 m ASL', 244000, 65.0, 'HIGH', '52.0 mm', '92%', '2.90 m (Storm Tide)', 38, 'Bay of Bengal Depressions & Coastal Lowland Inundation', 'Puducherry DDMA'),
  loc('loc-ch-chandigarh', 'Chandigarh / Sukhna Lake Catchment Basin', 'Chandigarh', 'Capital Region (Sukhna Choe & Patiali Ki Rao)', 'HIMALAYAN_NORTH', 'URBAN_STORMWATER_INUNDATION', 30.7333, 76.7794, '321 m ASL', 1055000, 50.0, 'MODERATE', '31.0 mm', '74%', '1161.5 ft (Gates Open: 1163ft)', 40, 'Shivalik Cloudburst Drainage Surcharge', 'Chandigarh Administration DM'),
  loc('loc-an-portblair', 'Port Blair Coastal Corridor / Kalpong Reach', 'Andaman & Nicobar', 'South Andaman (Coastal Lowlands)', 'COASTAL_CYCLONE', 'COASTAL_ESTUARINE_SURGE', 11.6234, 92.7265, '16 m ASL', 100000, 56.0, 'MODERATE', '44.0 mm', '88%', '3.10 m (High Tide Surge)', 30, 'Tropical Cyclone Storm Surge & Coastal Flooding', 'Andaman Disaster Management Authority'),
  loc('loc-dn-daman', 'Daman / Daman Ganga Estuary Delta', 'Dadra & Nagar Haveli and Daman & Diu', 'Daman District (Daman Ganga Basin)', 'WESTERN_GHATS_COASTAL', 'COASTAL_ESTUARINE_SURGE', 20.3974, 72.8328, '5 m ASL', 191000, 61.0, 'HIGH', '48.0 mm', '90%', '3.40 m', 35, 'Madhuban Dam Outflow & Arabian Sea Tidal Lock', 'UT Administration DM'),
  loc('loc-ld-kavaratti', 'Kavaratti Island Tidal Lagoon', 'Lakshadweep', 'Central Lagoon Sector', 'COASTAL_CYCLONE', 'COASTAL_ESTUARINE_SURGE', 10.5667, 72.6417, '2 m ASL', 11200, 51.0, 'MODERATE', '35.0 mm', '85%', '1.90 m (Lagoon Surge)', 45, 'Cyclone Swell Waves & Island Lowland Submergence', 'Lakshadweep Disaster Management Authority'),
  loc('demo-village-003', 'Sunderbans Nagar (Exposure Target)', 'Uttarakhand', 'Upper Himalayan Catchment (Sector 4)', 'HIMALAYAN_NORTH', 'FLASH_FLOOD_CLOUDBURST', 30.5050, 79.1550, '1,240 m ASL', 3400, 68.5, 'HIGH', '48.0 mm', '82% (Critical)', '3.80 m (+0.40 m/h)', 42, 'Pre-Saturated Slope Runoff & Gorge Choking', 'IMD AWS-001 & CWC Radar'),
];

/**
 * Calculates geodesic distance between two points on Earth using Haversine formula
 */
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the nearest monitored location dossier in India from given GPS coordinates
 */
export function findNearestLocation(
  lat: number,
  lon: number
): {
  location: LocationDossier;
  distanceKm: number;
} {
  let nearest = LOCATIONS[0];
  let minDistance = Infinity;

  for (const l of LOCATIONS) {
    const d = getDistanceKm(lat, lon, l.lat, l.lon);
    if (d < minDistance) {
      minDistance = d;
      nearest = l;
    }
  }

  return {
    location: nearest,
    distanceKm: Math.round(minDistance * 10) / 10,
  };
}
