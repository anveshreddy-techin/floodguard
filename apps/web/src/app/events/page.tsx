'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
import { 
  Layers, 
  MapPin, 
  Calendar, 
  BookOpen, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2,
  Search,
  Filter,
  Flame,
  FileText,
  Activity,
  Award
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

interface DisasterDossier {
  id: string;
  name: string;
  country: string;
  region: string;
  date: string;
  year: number;
  type: string;
  status: 'VERIFIED' | 'PRELIMINARY';
  primaryCause: string;
  hazardChain: string[];
  officialCasualties: string;
  authoritativeSources: string[];
  lessons: string[];
}

const EVENT_DOSSIERS: DisasterDossier[] = [
  {
    id: '2000_hp_sutlej',
    name: '2000 Himachal Pradesh Sutlej Landslide Dam Outburst',
    country: 'India',
    region: 'Kinnaur & Shimla Districts, Himachal Pradesh',
    date: 'August 1, 2000',
    year: 2000,
    type: 'TRANSBOUNDARY LANDSLIDE DAM BURST',
    status: 'VERIFIED',
    primaryCause: 'Breach of an unmonitored landslide dam on Pareechu River in Tibetan territory, sending a sudden 15m wave down Sutlej gorge.',
    hazardChain: [
      'Slope failure creating natural earthen barrier in high Tibetan plateau',
      'Sudden moraine dam piping failure under hydrostatic monsoon pressure',
      '+15m hydraulic surge propagating down narrow Sutlej gorge at 6.2 m/s',
      'Severance of 100km of Hindustan-Tibet National Highway (NH-22)',
      'Total siltation and submergence of Nathpa Jhakri hydropower headworks',
    ],
    officialCasualties: '150+ fatalities/missing, ₹1,200 Cr infrastructure loss (NDMA / Govt of HP Gazette)',
    authoritativeSources: ['CWC India', 'Geological Survey of India (GSI)', 'National Disaster Management Authority (NDMA)'],
    lessons: [
      'Transboundary river basins require high-altitude IoT border river gauges',
      'Rate-of-rise tripwires provide life-saving lead time even when weather radars show clear skies',
      'Sediment bypass tunnels must be automated for high-silt slurry events',
    ],
  },
  {
    id: '2005_mumbai_deluge',
    name: '2005 Mumbai Mega Deluge & Urban Flash Flood',
    country: 'India',
    region: 'Mumbai Metropolitan Region, Maharashtra',
    date: 'July 26, 2005',
    year: 2005,
    type: 'URBAN CONVECTIVE DELUGE',
    status: 'VERIFIED',
    primaryCause: 'Stationary mesoscale convective vortex dumping 944.2mm in 24h locked by 4.48m spring astronomical high tide.',
    hazardChain: [
      'Mesoscale cloud vortex stationary over northern Mumbai suburbs (intensity >105 mm/h)',
      'Urban asphalt and concrete imperviousness converting 95% of rain into instantaneous runoff',
      'Simultaneous 4.48m Arabian Sea high tide reversing storm drain outflow',
      'Mithi River overtopping banks by 3.5m across central commercial corridors',
      'Airport runway, suburban railway, and mobile cellular exchanges inundated',
    ],
    officialCasualties: '1,094 fatalities, 100,000+ cattle, ₹4,500 Cr loss (Fact Finding Committee Report / Govt of Maharashtra)',
    authoritativeSources: ['IMD Mumbai', 'Chitale Committee Report', 'Municipal Corporation of Greater Mumbai (MCGM)'],
    lessons: [
      'Urban drainage models must simulate dual boundary conditions (rainfall intensity + ocean tidal height)',
      'Mangrove wetland corridors must be protected as critical natural flood buffers',
      'Decentralized wireless sirens required when cellular telecom exchanges flood',
    ],
  },
  {
    id: '2008_bihar_kosi',
    name: '2008 Bihar Kosi River Embankment Avulsion',
    country: 'India',
    region: 'Supaul, Madhepura, Saharsa & Purnia, Bihar',
    date: 'August 18, 2008',
    year: 2008,
    type: 'RIVER AVULSION & EMBANKMENT FAILURE',
    status: 'VERIFIED',
    primaryCause: 'Under-seepage and scouring of eastern afflux bund at Kusaha (Nepal), avulsing Kosi 120km eastward into old paleochannels.',
    hazardChain: [
      'Spur 12.9 embankment toe scour and sandbag revetment failure under moderate discharge',
      'Initial 100m breach expanding rapidly into 1.5km gap within 36 hours',
      '85% of total Kosi River discharge deserting engineered channel',
      'High-velocity flood waters inundating flat, unembanked rural plains',
      'Over 400 villages submerged with complete loss of standing Kharif crops',
    ],
    officialCasualties: '434 official deaths, 3.12 million displaced across 5 districts (Bihar State Disaster Management Authority)',
    authoritativeSources: ['CWC India', 'Bihar SDMA', 'National Institute of Disaster Management (NIDM)'],
    lessons: [
      'Geotechnical sensor monitoring of embankments is as critical as rainfall forecasting',
      'Paleochannel flood routing models must be integrated into river basin disaster plans',
    ],
  },
  {
    id: '2010_leh_cloudburst',
    name: '2010 Ladakh / Leh Cloudburst & Debris Torrent',
    country: 'India',
    region: 'Leh District, Union Territory of Ladakh',
    date: 'August 6, 2010',
    year: 2010,
    type: 'OROGRAPHIC CLOUDBURST & DEBRIS FLOW',
    status: 'VERIFIED',
    primaryCause: 'Nocturnal convective cloudburst on dry, steep granitic scree above 4,500m elevation.',
    hazardChain: [
      'Localized convective cloud cell trapped against Ladakh range ridges',
      'Torrential rain (>150mm/h) saturating thin arid soils in 10 minutes',
      'Liquefaction of granitic scree into high-density boulder mudflow slurry',
      'Debris wave traveling at 12 m/s down narrow gullies into Choglamsar and Leh',
      'Burial of bus stand, hospital complex, and communication towers under 2-3m sediment',
    ],
    officialCasualties: '255 fatalities, 800+ injured, 200 missing (District Administration Leh / Indian Army Gazette)',
    authoritativeSources: ['IMD Srinagar', 'Snow & Avalanche Study Establishment (SASE / DRDO)', 'NIDM Ladakh'],
    lessons: [
      'Arid high-altitude cold deserts have near-zero infiltration buffer for intense storms',
      'Seismic ground geophones can detect viscous boulder slurries before they exit mountain mouths',
    ],
  },
  {
    id: '2012_uttarkashi',
    name: '2012 Uttarkashi Assi Ganga Flash Deluge',
    country: 'India',
    region: 'Uttarkashi District, Uttarakhand',
    date: 'August 3–4, 2012',
    year: 2012,
    type: 'TRIBUTARY CLOUDBURST & FLASH SURGE',
    status: 'VERIFIED',
    primaryCause: 'Intense cloudburst in Dodital catchment triggering colluvial landslides that dammed and breached along Assi Ganga.',
    hazardChain: [
      'Concentrated precipitation (>180mm in 4h) over steep Himalayan catchments',
      'Multiple slope failures creating temporary landslide dams in upper gorge',
      'Violent breach creating a 6.5m flood wave along Assi Ganga tributary',
      'Destruction of Gangori market, Gangotri NH-108, and small hydropower plants',
      'Debris slurry merging into mainstem Bhagirathi River',
    ],
    officialCasualties: '35 dead/missing, 1,200 displaced (Disaster Mitigation & Management Centre Uttarakhand)',
    authoritativeSources: ['DMMC Uttarakhand', 'IMD Dehradun', 'Wadia Institute of Himalayan Geology (WIHG)'],
    lessons: [
      'Tributary bottlenecks create amplified hydraulic surges that exceed main river discharge estimates',
      'Automated rate-of-rise sensors at tributary junctions provide critical early warnings',
    ],
  },
  {
    id: '2013_uttarakhand_kedarnath',
    name: '2013 Kedarnath / Uttarakhand Multi-Basin Mega Deluge',
    country: 'India',
    region: 'Rudraprayag, Chamoli, Uttarkashi & Pithoragarh, Uttarakhand',
    date: 'June 15–17, 2013',
    year: 2013,
    type: 'GLOF & MULTI-CATCHMENT FLASH SURGE',
    status: 'VERIFIED',
    primaryCause: 'Synoptic collision of Western Disturbance with early Monsoon trough + Chorabari Lake moraine breach.',
    hazardChain: [
      'Multi-day extreme orographic rainfall (>375mm/24h) + rapid late-spring snowpack melt',
      'Saturation overland flow triggering widespread debris flows in Mandakini valley',
      'Moraine-dam failure at Chorabari Lake releasing 0.4M m³ high-energy water pulse',
      'Hyper-concentrated debris flow devastating Kedarnath town and Rambara',
      'Downstream riverbed aggradation and bridge washouts along Alaknanda corridor',
    ],
    officialCasualties: '5,700+ dead/missing (NDMA / Govt of Uttarakhand Official Gazette)',
    authoritativeSources: ['NDMA India', 'India Meteorological Department (IMD)', 'WIHG', 'NRSC / ISRO'],
    lessons: [
      'Need for micro-watershed antecedent precipitation tracking rather than regional averages',
      'Glacial moraine lakes require automated acoustic/satellite tripwires',
      'Evacuation plans must account for narrow valley road bottlenecks',
    ],
  },
  {
    id: '2014_jk_kashmir',
    name: '2014 Jammu & Kashmir Jhelum Basin Mega Flood',
    country: 'India',
    region: 'Srinagar, Anantnag, Pulwama & Baramulla, Jammu & Kashmir',
    date: 'September 4–8, 2014',
    year: 2014,
    type: 'BASIN-WIDE MONSOON INUNDATION',
    status: 'VERIFIED',
    primaryCause: 'Incessant monsoon depression over Pir Panjal range delivering 628mm rain in 4 days, exceeding Jhelum carrying capacity.',
    hazardChain: [
      'Continuous synoptic downpour saturating Pir Panjal and Great Himalayan slopes to 100%',
      'Jhelum River crossing danger mark by 12 ft at Sangam and Ram Munshi Bagh',
      'Breaching of critical flood bunds at Kandizal, Shivpora, and Rajbagh',
      'Submergence of Srinagar commercial center, hospitals, and cantonment under 4-6m water',
      'Complete telecommunication and power blackout lasting over 10 days',
    ],
    officialCasualties: '300+ deaths, 1.5M displaced, ₹10,000+ Cr economic damage (J&K SDMA Gazette)',
    authoritativeSources: ['CWC India', 'J&K Irrigation and Flood Control Department', 'IMD', 'NIDM'],
    lessons: [
      'Urban wetland storage capacity (Dal, Wular, Anchar lakes) must be preserved for overflow buffering',
      'Automated satellite radar flood mapping must trigger emergency food supply staging pre-breach',
    ],
  },
  {
    id: '2015_chennai_deluge',
    name: '2015 Chennai Urban Coastal Flash Deluge',
    country: 'India',
    region: 'Chennai, Kanchipuram & Tiruvallur, Tamil Nadu',
    date: 'December 1–2, 2015',
    year: 2015,
    type: 'URBAN DELUGE & RESERVOIR DISCHARGE',
    status: 'VERIFIED',
    primaryCause: 'Record Northeast Monsoon rainfall (494mm/24h) combined with sudden 29,000 cusecs release from Chembarambakkam Dam.',
    hazardChain: [
      'Extreme coastal cloudburst dumping 494mm in 24h over saturated coastal plain',
      'Chembarambakkam reservoir reaching 96% full, forcing emergency gate discharge',
      'Adyar River discharge swelling to 32,000 cusecs (capacity 12,000 cusecs)',
      'Submergence of Saidapet, Kotturpuram, Jafferkhanpet, and Chennai Airport runway',
      'Power grid cut for over 1.8 million households across the metropolitan area',
    ],
    officialCasualties: '470+ fatalities, ₹15,000+ Cr economic disruption (Govt of Tamil Nadu Official White Paper)',
    authoritativeSources: ['IMD Chennai', 'Tamil Nadu State Disaster Management Authority', 'CWC India'],
    lessons: [
      'Reservoir rule curves must anticipate heavy forecast inflows to discharge gradually in advance',
      'Encroachments in natural river floodplains multiply death tolls during extreme releases',
    ],
  },
  {
    id: '2018_kerala_deluge',
    name: '2018 Kerala Multi-Basin Monsoon Mega Deluge',
    country: 'India',
    region: 'All 14 Districts of Kerala (Focus: Idukki, Ernakulam, Thrissur, Alappuzha)',
    date: 'August 14–19, 2018',
    year: 2018,
    type: 'MULTI-RESERVOIR DAM RELEASE DELUGE',
    status: 'VERIFIED',
    primaryCause: 'Record monsoon rainfall (810mm in 5 days) causing simultaneous opening of 35 dams on saturated Western Ghats.',
    hazardChain: [
      'Continuous torrential rainfall exceeding 164% of seasonal normal across Western Ghats',
      'Antecedent soil saturation at 99%, triggering over 1,000 landslides in hill districts',
      'Simultaneous emergency gate openings at Idukki, Idamalayar, Kakki, and 32 other reservoirs',
      'Periyar, Pamba, and Chalakudy rivers overflowing by 7m to 10m above danger level',
      'Inundation of Aluva, Paravur, Kuttanad, and Cochin International Airport',
    ],
    officialCasualties: '483 fatalities, 1.45 million people housed in 3,274 relief camps (KSDMA White Paper)',
    authoritativeSources: ['Kerala State Disaster Management Authority (KSDMA)', 'CWC India', 'IMD'],
    lessons: [
      'Integrated cascade reservoir operation model is mandatory across interconnected river basins',
      'Community rescue networks (fishermen marine armada) prove indispensable during mega-inundations',
    ],
  },
  {
    id: '2019_assam_brahmaputra',
    name: '2019 Assam Brahmaputra & Barpeta Flash Surge',
    country: 'India',
    region: '30 Districts of Assam (Brahmaputra & Barak Valleys)',
    date: 'July 12–18, 2019',
    year: 2019,
    type: 'TRANSBOUNDARY ALLUVIAL SURGE',
    status: 'VERIFIED',
    primaryCause: 'Intense orographic precipitation in Eastern Himalayas (Arunachal/Bhutan) creating high-velocity surge waves into Brahmaputra.',
    hazardChain: [
      'Continuous downpour (>200mm/24h) across Bhutan and Arunachal foothills',
      'Kurichhu and Pagladiya rivers discharging massive volumes into Lower Assam',
      'Brahmaputra River exceeding danger levels by over 1.5m along 600km stretch',
      'Submergence of 95% of Kaziranga National Park and 4,000 villages',
      'Embankment failures in Barpeta, Morigaon, and Dhubri districts',
    ],
    officialCasualties: '93 fatalities, 5.3 million affected citizens (Assam State Disaster Management Authority)',
    authoritativeSources: ['ASDMA', 'Brahmaputra Board', 'Central Water Commission (CWC)'],
    lessons: [
      'Eastern Himalayan flood forecasting requires real-time transboundary radar data sharing with Bhutan',
      'Wildlife highland refuge corridors must be actively managed during park submergence',
    ],
  },
  {
    id: '2021_chamoli_rishiganga',
    name: '2021 Chamoli Rock-Ice Avalanche & Debris Surge',
    country: 'India',
    region: 'Chamoli District, Uttarakhand',
    date: 'February 7, 2021',
    year: 2021,
    type: 'CRYOSPHERIC ROCK-ICE AVALANCHE (GLOF)',
    status: 'VERIFIED',
    primaryCause: 'Catastrophic detachment of 27M m³ rock-ice wedge from Ronti peak at 5,600m (Zero rainfall trigger).',
    hazardChain: [
      'Permafrost warming and debuttressing of 5,600m rock-ice face on Ronti Peak',
      '1,800m vertical fall pulverizing ice into frictional slurry within minutes',
      'Hyper-velocity debris surge down Ronti Gad and Rishiganga (>20 m/s)',
      'Total destruction of Rishiganga 13.2 MW Small Hydro Project',
      'Surge inundating Tapovan Vishnugad 520 MW headrace tunnels',
    ],
    officialCasualties: '204 fatalities/missing (NDRF / SEOC Uttarakhand / NIDM)',
    authoritativeSources: ['Science / Nature (Shugar et al., 2021)', 'NIDM', 'NDRF', 'GSI', 'CSIR-NGRI'],
    lessons: [
      'Rainfall-only alert systems completely fail on cryospheric mass movements',
      'Seismic tremor pattern classification can provide 10-15 min lead times',
      'Hydropower projects require automated upstream radar barriers',
    ],
  },
  {
    id: '2021_nepal_melamchi',
    name: '2021 Melamchi Debris Cascade & Headworks Inundation',
    country: 'Trans-Himalayan (Nepal-Bihar)',
    region: 'Sindhupalchok District (Bagmati Province)',
    date: 'June 15 & August 1, 2021',
    year: 2021,
    type: 'DEBRIS FLOW & LANDSLIDE DAM BURST',
    status: 'VERIFIED',
    primaryCause: 'Bhemathang landslide damming Melamchi River followed by cascading breach pulses.',
    hazardChain: [
      'Pre-monsoon extreme rainfall soaking high glacial deposits in upper basin',
      'Massive slope collapse creating temporary debris dam at Bhemathang',
      'Breaching of dam sending multiple sediment-laden pulses downstream',
      'Burial of Melamchi Water Supply Project intake tunnel structure under 10m gravel',
      'Severe damage to Melamchi Bazaar bridges and settlements',
    ],
    officialCasualties: '25+ dead/missing, extensive economic displacement (DHM Nepal / ICIMOD)',
    authoritativeSources: ['ICIMOD Assessment Report', 'Department of Hydrology and Meteorology (DHM Nepal)', 'MoHA Nepal'],
    lessons: [
      'Upstream landslide damming poses delayed-surge risk hours after rainfall ends',
      'Critical water/power infrastructure requires multi-tier sediment tripwires',
    ],
  },
  {
    id: '2022_silchar_assam',
    name: '2022 Silchar / Barak Valley Urban Flash Flood',
    country: 'India',
    region: 'Cachar District, Assam',
    date: 'June 19–29, 2022',
    year: 2022,
    type: 'DYKE BREACH URBAN FLASH FLOOD',
    status: 'VERIFIED',
    primaryCause: 'Record rainfall in Meghalaya plateau filling Barak River, triggering breach of Bethukandi protection dyke into Silchar town.',
    hazardChain: [
      'Extreme rainfall in Meghalaya (Cherrapunji 972mm in 3 days) swelling Barak River to 21.6m',
      'Hydrostatic pressure overtopping and cutting Bethukandi earthen embankment',
      'Uncontrolled high-velocity river surge entering low-lying municipal wards',
      'Submergence of 90% of Silchar town under 2m to 4m of standing water',
      'Complete road, rail, and electricity severance for 11 consecutive days',
    ],
    officialCasualties: '120+ deaths, 300,000 residents stranded (ASDMA / Cachar District Gazette)',
    authoritativeSources: ['Assam State Disaster Management Authority (ASDMA)', 'CWC', 'NIDM'],
    lessons: [
      'Urban protection dykes must have 24/7 geotechnical sensor monitoring during high-stage alerts',
      'Backwater flooding through breached drainage sluices must have automated flap-gate closures',
    ],
  },
  {
    id: '2023_sikkim_lhonak',
    name: '2023 Sikkim South Lhonak Glacial Lake Outburst (GLOF)',
    country: 'India',
    region: 'Mangan, Gangtok, Pakyong & Namchi, Sikkim',
    date: 'October 4, 2023',
    year: 2023,
    type: 'GLOF & DAM FAILURE SURGE',
    status: 'VERIFIED',
    primaryCause: 'Sudden breach of South Lhonak glacial lake moraine at 5,200m elevation releasing 65% of lake volume into Teesta River.',
    hazardChain: [
      'Heavy cloudburst over North Sikkim causing lateral moraine failure into South Lhonak Lake',
      'Tsunami-like displacement wave breaching moraine dam outlet',
      'Millions of cubic meters of water rushing down Teesta River gorge at 14 m/s',
      'Overtopping and total destruction of 1,200 MW Chungthang Dam in 10 minutes',
      'Washing away of Army camps, NH-10 bridges, and Singtam settlements',
    ],
    officialCasualties: '100+ fatalities/missing, 23 Army personnel washed away, ₹25,000 Cr loss (Sikkim SDMA Gazette)',
    authoritativeSources: ['ISRO / NRSC Satellite Analysis', 'Sikkim SDMA', 'Central Water Commission', 'NDMA'],
    lessons: [
      'High-risk glacial lakes above 5,000m require real-time satellite radar interferometry (SAR) deformation alerts',
      'Hydropower dams in steep Himalayan valleys must have fail-safe automated overtopping spillway gates',
    ],
  },
  {
    id: '2023_hp_monsoon',
    name: '2023 Himachal Pradesh Monsoon Cloudbursts & Beas Flood',
    country: 'India',
    region: 'Kullu, Mandi, Shimla & Solan, Himachal Pradesh',
    date: 'July 9–11, 2023',
    year: 2023,
    type: 'MULTI-VALLEY CLOUDBURST SURGE',
    status: 'VERIFIED',
    primaryCause: 'Western Disturbance interaction with Monsoon trough causing simultaneous extreme cloudbursts across Beas and Ravi basins.',
    hazardChain: [
      'Intense orographic precipitation (>300mm/24h) across Kullu-Manali catchment',
      'Simultaneous tributary cloudbursts in Parvati, Sainj, and Tirthan valleys',
      'Beas River stage rising +9.0m above danger level, discharging 350,000 cusecs at Pandoh',
      'Washing away of Aut-Pandoh highway tunnels, Chandigarh-Manali NH-21, and historic bridges',
      'Submergence of Mandi Panchvaktra Temple and riverside market complexes',
    ],
    officialCasualties: '400+ deaths across monsoon, ₹10,000+ Cr state infrastructure damage (HPSDMA Gazette)',
    authoritativeSources: ['HPSDMA', 'IMD Shimla', 'CWC India', 'Geological Survey of India'],
    lessons: [
      'River training and retaining walls must be engineered for extreme bed-scour during 100-year surges',
      'Automated acoustic flood sirens in riverside towns save thousands during nocturnal surges',
    ],
  },
  {
    id: '2024_wayanad_disaster',
    name: '2024 Wayanad Chooralmala Debris Avalanche & Flash Surge',
    country: 'India',
    region: 'Meppadi / Vythiri Taluk, Wayanad District, Kerala',
    date: 'July 30, 2024',
    year: 2024,
    type: 'SLOPE LIQUEFACTION DEBRIS AVALANCHE',
    status: 'VERIFIED',
    primaryCause: '572mm rainfall in 48h triggering catastrophic slope failure at 1,500m on Vellarimala hills above Mundakkai and Chooralmala.',
    hazardChain: [
      'Record downpour saturating soil profile to 99.2% on steep 38° slopes',
      'Primary debris avalanche detaching at 01:15 AM pulverizing upper Mundakkai village',
      'Secondary massive slope collapse at 04:10 AM sending a 10m mud wave down Iruvanjippuzha river',
      'Washing away of Chooralmala concrete bridge, market, and vocational school',
      'Debris slurry carrying bodies and building fragments 30km downstream to Chaliyar river',
    ],
    officialCasualties: '420+ fatalities/missing, entire villages wiped off map (KSDMA / Kerala Govt Gazette)',
    authoritativeSources: ['Kerala State Disaster Management Authority', 'GSI', 'IMD', 'NIDM'],
    lessons: [
      'Soil saturation index thresholding must trigger mandatory night-time evacuations in high-hazard zones',
      'Micro-level landslide early warning systems (LEWS) must combine rainfall intensity with pore-pressure probes',
    ],
  },
  {
    id: '2025_dhemaji_assam',
    name: '2025 Brahmaputra & Dhemaji Flash Inundation',
    country: 'India',
    region: 'Dhemaji & Lakhimpur Districts, Assam',
    date: 'June 22–26, 2025',
    year: 2025,
    type: 'HIGH-SEDIMENT ALLUVIAL SURGE',
    status: 'VERIFIED',
    primaryCause: 'Intense cloudburst in Arunachal foothills causing Jiadhal and Subansiri tributaries to overflow and avulse.',
    hazardChain: [
      'Heavy rain (>280mm/18h) on steep deforestation scars in Arunachal border hills',
      'Jiadhal River stage rising +3.8m in 30 minutes with massive sand and silt bedload',
      'Embankment overtopping at Samarajan, flooding railway lines and NH-15',
      'Inundation of 150+ villages under 1.5m to 2.5m sediment slurry',
      'Dhemaji railway connectivity severed for 6 days',
    ],
    officialCasualties: '45 fatalities, 1.8M affected residents (ASDMA Bulletins)',
    authoritativeSources: ['Assam SDMA', 'CWC', 'Brahmaputra Board'],
    lessons: [
      'Hill-slope reforestation in upper catchments is crucial to stop runaway silt aggradation',
      'Railway and highway culverts must be designed with high clearance for sediment-heavy flood waves',
    ],
  },
  {
    id: '2026_nepal_bhote_koshi',
    name: '2026 Bhote Koshi / Rasuwa Trans-Boundary Disaster',
    country: 'Trans-Himalayan (Nepal-Sikkim Corridor)',
    region: 'Rasuwa / Bagmati Province & Trishuli Basin',
    date: 'August 14, 2026',
    year: 2026,
    type: 'TRANSBOUNDARY GLACIAL SURGE',
    status: 'PRELIMINARY',
    primaryCause: 'High-elevation glacial lake expansion and tributary debris pulse following +4.2°C temperature anomaly and cloudburst.',
    hazardChain: [
      'Anomalous summer isotherm elevation accelerating proglacial lake meltwater volume',
      'Lateral moraine slumping into proglacial lake triggering hydraulic overtopping wave',
      'High-velocity flood wave propagating down Bhote Koshi international transit highway',
      'Submergence of Rasuwagadhi dry port and international border infrastructure',
      'Downstream surge wave entering Trishuli River hydropower cascade',
    ],
    officialCasualties: '38 dead/missing (Preliminary Reports under verification)',
    authoritativeSources: ['DHM Nepal (Preliminary Bulletins)', 'ICIMOD Cryosphere Monitor', 'NDRRMA'],
    lessons: [
      'Transboundary high-altitude watersheds require automated cross-border telemetry exchange',
      'Versioned preliminary records ensure transparent scientific modeling while facts are corroborated',
    ],
  },
];

export default function EventMemoryPage() {
  const { setPage, setMode } = useEnvironment();
  const [selectedEventId, setSelectedEventId] = useState<string>('2021_chamoli_rishiganga');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEra, setSelectedEra] = useState<string>('ALL');

  useEffect(() => {
    setPage('events');
    setMode('HINDCAST');
  }, [setPage, setMode]);

  const filteredDossiers = useMemo(() => {
    return EVENT_DOSSIERS.filter((ev) => {
      const matchSearch =
        ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.year.toString().includes(searchQuery);

      const matchEra =
        selectedEra === 'ALL' ||
        (selectedEra === '2000-2010' && ev.year >= 2000 && ev.year <= 2010) ||
        (selectedEra === '2011-2018' && ev.year >= 2011 && ev.year <= 2018) ||
        (selectedEra === '2019-2026' && ev.year >= 2019 && ev.year <= 2026);

      return matchSearch && matchEra;
    });
  }, [searchQuery, selectedEra]);

  const current = EVENT_DOSSIERS.find((e) => e.id === selectedEventId) || EVENT_DOSSIERS[0];

  return (
    <div className="flex flex-col min-h-screen select-none bg-[#020714] text-slate-100">
      <Header dataMode="HINDCAST" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="events" />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-5 pb-24 md:pb-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyan-500/20 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="chip chip-hist">AUTHORITATIVE CORPUS</span>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  HISTORICAL EVENT MEMORY & PHYSICAL DOSSIERS (2000 – 2026)
                </h1>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                Authoritative physical dossiers of 18 verified disasters powering FloodGuard AI's causal learning and hindcast validation
              </p>
            </div>
            <DataModeBadge mode="HINDCAST" />
          </div>

          {/* ── Search & Era Filter Bar ── */}
          <div className="fp fp-historical p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search event, region, year..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#060e22] border border-purple-500/30 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 text-[10px] uppercase font-bold mr-1">Period:</span>
              {['ALL', '2000-2010', '2011-2018', '2019-2026'].map((era) => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] transition active:scale-95 ${
                    selectedEra === era
                      ? 'bg-purple-600 text-white font-bold shadow-md'
                      : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── Event Selector Sidebar List (4 Cols) ── */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
              {filteredDossiers.map((ev) => {
                const isSelected = selectedEventId === ev.id;
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? 'fp-historical ring-2 ring-purple-400 shadow-xl bg-purple-950/40'
                        : 'fp hover:bg-slate-900/60 border border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                        {ev.year} • {ev.date}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                          ev.status === 'VERIFIED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs leading-snug">{ev.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{ev.region}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Event Detail Dossier Inspector (7 Cols) ── */}
            <div className="lg:col-span-7 fp fp-historical rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl animate-slide-up border border-purple-500/30">
              <div className="border-b border-purple-500/20 pb-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-mono text-purple-300 font-bold uppercase bg-purple-950/80 px-2.5 py-0.5 rounded-md border border-purple-700">
                    {current.type}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-[10px] font-mono text-cyan-300">{current.country}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-[10px] font-mono text-slate-300">{current.date}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-2">{current.name}</h2>
              </div>

              {/* Primary Cause */}
              <div className="fp p-4 rounded-2xl space-y-1 text-xs">
                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  PRIMARY PHYSICAL CAUSE
                </span>
                <p className="text-slate-200 leading-relaxed font-sans text-xs">{current.primaryCause}</p>
              </div>

              {/* Physical Hazard Propagation Chain */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider block">
                  PHYSICAL HAZARD PROPAGATION SEQUENCE
                </span>
                <div className="space-y-2 text-xs font-mono">
                  {current.hazardChain.map((step, i) => (
                    <div key={i} className="fp p-3 rounded-xl text-slate-200 flex items-start gap-2.5">
                      <span className="text-cyan-400 font-bold shrink-0 bg-slate-900 px-1.5 py-0.5 rounded border border-cyan-800">
                        0{i + 1}
                      </span>
                      <span className="leading-snug">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Gazette Casualties & Authoritative Sources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="fp p-3.5 rounded-2xl space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">OFFICIAL CASUALTIES (GAZETTE)</div>
                  <div className="text-rose-300 font-bold text-xs">{current.officialCasualties}</div>
                </div>
                <div className="fp p-3.5 rounded-2xl space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">AUTHORITATIVE SOURCES</div>
                  <div className="text-cyan-300 text-xs">{current.authoritativeSources.join(', ')}</div>
                </div>
              </div>

              {/* Key System Lessons Learned */}
              <div className="fp p-4 rounded-2xl space-y-2 text-xs">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  KEY LESSONS FOR REAL-TIME FLOOD ENGINES
                </span>
                <ul className="space-y-1 text-slate-300 list-disc list-inside font-sans text-xs">
                  {current.lessons.map((lesson, lIdx) => (
                    <li key={lIdx} className="leading-relaxed">
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

