export interface ReliefCampaignData {
  id: string;
  title: string;
  disasterType: 'CLOUDBURST' | 'FLASH_FLOOD' | 'RIVER_INUNDATION' | 'LANDSLIDE' | 'URBAN_FLOOD' | 'GENERAL_DISASTER';
  state: string;
  district: string;
  basin: string;
  headline: string;
  description: string;
  targetAmountInr: number;
  raisedAmountInr: number;
  donorsCount: number;
  beneficiariesAssisted: number;
  status: 'ACTIVE_EMERGENCY' | 'RECOVERY_PHASE' | 'LONG_TERM_REHABILITATION';
  isGovernmentFund: boolean;
  verifiedAuthority: string;
  upiId: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankBranch: string;
  taxExempt80g: boolean;
  imageBadge: string;
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  recentEventDate: string;
  reliefBreakdown: {
    rationsPct: number;
    shelterPct: number;
    medicalPct: number;
    sensorRepairPct: number;
  };
}

export const RELIEF_CAMPAIGNS: ReliefCampaignData[] = [
  {
    id: 'camp-uk-chamoli-2026',
    title: 'Chamoli & Upper Alaknanda Cloudburst Relief Fund',
    disasterType: 'CLOUDBURST',
    state: 'Uttarakhand',
    district: 'Chamoli',
    basin: 'Alaknanda & Dhauliganga Basin',
    headline: 'High-altitude emergency shelters, warm rations & drinking water for displaced mountain villages.',
    description: 'Sudden flash flood torrents severed bridge access to 4 villages in Tapovan, Raini, and Joshimath sectors. Funds provide waterproof geodesic tents, solar lanterns, high-altitude food rations, and early-warning IoT gauge repairs.',
    targetAmountInr: 50000000,
    raisedAmountInr: 34280000,
    donorsCount: 4120,
    beneficiariesAssisted: 2850,
    status: 'ACTIVE_EMERGENCY',
    isGovernmentFund: true,
    verifiedAuthority: 'Uttarakhand State Disaster Management Authority (USDMA) & CMRF',
    upiId: 'ukcmrf.chamoli@sbi',
    bankAccountName: 'Chief Minister Relief Fund Uttarakhand - Chamoli Disaster',
    bankAccountNumber: '30894512984',
    bankIfsc: 'SBIN0001058',
    bankBranch: 'Dehradun Main Branch',
    taxExempt80g: true,
    imageBadge: '🏔️',
    urgencyLevel: 'CRITICAL',
    recentEventDate: 'August 2026',
    reliefBreakdown: { rationsPct: 40, shelterPct: 30, medicalPct: 18, sensorRepairPct: 12 },
  },
  {
    id: 'camp-as-brahmaputra-2026',
    title: 'Assam Brahmaputra Inundation & Majuli Flood Relief',
    disasterType: 'RIVER_INUNDATION',
    state: 'Assam',
    district: 'Majuli & Dhemaji',
    basin: 'Brahmaputra Mainstem',
    headline: 'Rescue boats, water purification kits & livestock fodder for marooned island communities.',
    description: 'Severe monsoon surge breached river embankments, inundating 140 char settlements across Majuli river island and Dhemaji. Emergency SDRF patrol boats, chlorination tablets, and mobile veterinary kits are actively deployed.',
    targetAmountInr: 80000000,
    raisedAmountInr: 61500000,
    donorsCount: 7890,
    beneficiariesAssisted: 8400,
    status: 'ACTIVE_EMERGENCY',
    isGovernmentFund: true,
    verifiedAuthority: 'Assam State Disaster Management Authority (ASDMA) & Assam CMRF',
    upiId: 'ascmrf.majuli@sbi',
    bankAccountName: 'Chief Minister Relief Fund Assam - Flood Relief Pool',
    bankAccountNumber: '39482019482',
    bankIfsc: 'SBIN0000078',
    bankBranch: 'Guwahati Secretariat Branch',
    taxExempt80g: true,
    imageBadge: '🌊',
    urgencyLevel: 'CRITICAL',
    recentEventDate: 'August 2026',
    reliefBreakdown: { rationsPct: 45, shelterPct: 20, medicalPct: 20, sensorRepairPct: 15 },
  },
  {
    id: 'camp-kl-wayanad-2026',
    title: 'Wayanad Western Ghats Landslide Rehabilitation Fund',
    disasterType: 'LANDSLIDE',
    state: 'Kerala',
    district: 'Wayanad',
    basin: 'Kabini River Basin',
    headline: 'Geo-stable permanent housing rebuild & livelihood restoration in Chooralmala & Meppadi.',
    description: 'Multi-slope debris flows impacted plantation communities. Contributions fund geo-engineered safe settlement construction, children education rehabilitation scholarships, and trauma healthcare.',
    targetAmountInr: 100000000,
    raisedAmountInr: 89200000,
    donorsCount: 12450,
    beneficiariesAssisted: 5200,
    status: 'RECOVERY_PHASE',
    isGovernmentFund: true,
    verifiedAuthority: "Chief Minister's Distress Relief Fund (CMDRF) Kerala",
    upiId: 'cmdrf.kerala@sbi',
    bankAccountName: "Chief Minister's Distress Relief Fund Kerala",
    bankAccountNumber: '67319948201',
    bankIfsc: 'SBIN0070028',
    bankBranch: 'Thiruvananthapuram Main',
    taxExempt80g: true,
    imageBadge: '⛰️',
    urgencyLevel: 'HIGH',
    recentEventDate: 'August 2026',
    reliefBreakdown: { rationsPct: 25, shelterPct: 45, medicalPct: 15, sensorRepairPct: 15 },
  },
  {
    id: 'camp-ts-godavari-2026',
    title: 'Telangana Godavari Urban & Rural Flash Flood Response',
    disasterType: 'URBAN_FLOOD',
    state: 'Telangana',
    district: 'Bhadradri Kothagudem & Warangal',
    basin: 'Godavari River Basin',
    headline: 'High-capacity dewatering pumps, colony sanitation & dry ration distribution.',
    description: 'Heavy precipitation caused flash flooding in Bhadrachalam lowlands and Warangal municipal wards. Funds support urban slum hygiene sanitization, school restoration, and vulnerable elder support.',
    targetAmountInr: 45000000,
    raisedAmountInr: 28400000,
    donorsCount: 3600,
    beneficiariesAssisted: 4100,
    status: 'ACTIVE_EMERGENCY',
    isGovernmentFund: true,
    verifiedAuthority: 'Telangana State Disaster Management Authority & CMRF',
    upiId: 'tgcmrf.godavari@sbi',
    bankAccountName: 'Chief Minister Relief Fund Telangana',
    bankAccountNumber: '48192049182',
    bankIfsc: 'SBIN0020087',
    bankBranch: 'Hyderabad Gunfoundry Branch',
    taxExempt80g: true,
    imageBadge: '⛈️',
    urgencyLevel: 'HIGH',
    recentEventDate: 'August 2026',
    reliefBreakdown: { rationsPct: 35, shelterPct: 25, medicalPct: 25, sensorRepairPct: 15 },
  },
  {
    id: 'camp-hp-kullu-2026',
    title: 'Himachal Beas & Kullu Cloudburst Emergency Fund',
    disasterType: 'FLASH_FLOOD',
    state: 'Himachal Pradesh',
    district: 'Kullu & Mandi',
    basin: 'Beas River Basin',
    headline: 'Bailey bridge reconnections, riverbank stone gabions & riverside family aid.',
    description: 'Swollen mountain rivers triggered localized bank scouring and road washouts in Kullu and Parvati valleys. Emergency relief supports displaced shopkeepers, bridge repairs, and solar emergency communications.',
    targetAmountInr: 60000000,
    raisedAmountInr: 41000000,
    donorsCount: 5200,
    beneficiariesAssisted: 3900,
    status: 'ACTIVE_EMERGENCY',
    isGovernmentFund: true,
    verifiedAuthority: 'Himachal Pradesh State Disaster Management Authority (HPSDMA) & CMRF',
    upiId: 'hpcmrf.kullu@sbi',
    bankAccountName: "HP Chief Minister's Relief Fund",
    bankAccountNumber: '28401928401',
    bankIfsc: 'SBIN0000718',
    bankBranch: 'Shimla Secretariat',
    taxExempt80g: true,
    imageBadge: '🌲',
    urgencyLevel: 'CRITICAL',
    recentEventDate: 'August 2026',
    reliefBreakdown: { rationsPct: 35, shelterPct: 35, medicalPct: 15, sensorRepairPct: 15 },
  },
  {
    id: 'camp-national-pmnrf',
    title: "Prime Minister's National Relief Fund (PMNRF) - Disaster Pool",
    disasterType: 'GENERAL_DISASTER',
    state: 'National',
    district: 'Pan-India',
    basin: 'All Basins',
    headline: 'National ex-gratia assistance, immediate disaster relief & pan-India disaster response.',
    description: 'National statutory relief pool operated by the Prime Minister Office (PMO) dedicated to providing swift ex-gratia financial assistance and physical relief to families affected by natural calamities across all Indian states.',
    targetAmountInr: 250000000,
    raisedAmountInr: 198000000,
    donorsCount: 34200,
    beneficiariesAssisted: 24500,
    status: 'ACTIVE_EMERGENCY',
    isGovernmentFund: true,
    verifiedAuthority: "Prime Minister's Office (PMO), Government of India",
    upiId: 'pmnrf@sbi',
    bankAccountName: "Prime Minister's National Relief Fund",
    bankAccountNumber: '100010001000',
    bankIfsc: 'SBIN0000691',
    bankBranch: 'New Delhi Main Branch',
    taxExempt80g: true,
    imageBadge: '🏛️',
    urgencyLevel: 'HIGH',
    recentEventDate: 'Ongoing 2026',
    reliefBreakdown: { rationsPct: 40, shelterPct: 30, medicalPct: 20, sensorRepairPct: 10 },
  },
];

export const DONATION_PRESETS = [
  {
    amount: 500,
    label: '₹500',
    impact: '1 Emergency Drinking Water & Dry Ration Kit (3-Day Supply)',
    icon: '🍞',
  },
  {
    amount: 1500,
    label: '₹1,500',
    impact: 'Potable Water Filter + First-Aid Medical Kit for a Family of 4',
    icon: '💧',
  },
  {
    amount: 3500,
    label: '₹3,500',
    impact: 'Waterproof High-Ground Family Dome Tent & Solar Lantern Kit',
    icon: '⛺',
  },
  {
    amount: 10000,
    label: '₹10,000',
    impact: 'Community Dewatering Pump Fuel + Emergency Ration Packs for 8 Families',
    icon: '🚤',
  },
  {
    amount: 25000,
    label: '₹25,000',
    impact: 'Early-Warning IoT Ultrasonic River Sensor & Rain Gauge Repair Kit',
    icon: '📡',
  },
];
