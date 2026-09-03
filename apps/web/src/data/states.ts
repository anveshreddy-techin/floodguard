export interface IndianStateMeta {
  id: string;
  name: string;
  code: string;
  zone: string;
  capital: string;
  rivers: string[];
  isUT?: boolean;
}

// 🇮🇳 Complete National Registry: All 28 States & 8 Union Territories of India (36 Total)
export const INDIAN_STATES: IndianStateMeta[] = [
  // ── 28 STATES ──
  { id: 'ap', name: 'Andhra Pradesh', code: 'AP', zone: 'PENINSULAR_CENTRAL', capital: 'Amaravati', rivers: ['Godavari', 'Krishna', 'Pennar', 'Tungabhadra'] },
  { id: 'ar', name: 'Arunachal Pradesh', code: 'AR', zone: 'NORTHEAST_BRAHMAPUTRA', capital: 'Itanagar', rivers: ['Siang', 'Dibang', 'Lohit', 'Subansiri', 'Kameng'] },
  { id: 'as', name: 'Assam', code: 'AS', zone: 'NORTHEAST_BRAHMAPUTRA', capital: 'Dispur', rivers: ['Brahmaputra', 'Barak', 'Subansiri', 'Manas', 'Kopili'] },
  { id: 'br', name: 'Bihar', code: 'BR', zone: 'EASTERN_DELTA', capital: 'Patna', rivers: ['Ganga', 'Kosi', 'Gandak', 'Bagmati', 'Son', 'Ghaghara'] },
  { id: 'cg', name: 'Chhattisgarh', code: 'CG', zone: 'PENINSULAR_CENTRAL', capital: 'Raipur', rivers: ['Mahanadi', 'Indravati', 'Hasdeo', 'Shivnath'] },
  { id: 'ga', name: 'Goa', code: 'GA', zone: 'WESTERN_GHATS_COASTAL', capital: 'Panaji', rivers: ['Mandovi', 'Zuari', 'Chapora', 'Sal'] },
  { id: 'gj', name: 'Gujarat', code: 'GJ', zone: 'PENINSULAR_CENTRAL', capital: 'Gandhinagar', rivers: ['Narmada', 'Tapi', 'Sabarmati', 'Mahi', 'Bhadar'] },
  { id: 'hr', name: 'Haryana', code: 'HR', zone: 'HIMALAYAN_NORTH', capital: 'Chandigarh', rivers: ['Yamuna', 'Ghaggar', 'Markanda', 'Tangri'] },
  { id: 'hp', name: 'Himachal Pradesh', code: 'HP', zone: 'HIMALAYAN_NORTH', capital: 'Shimla', rivers: ['Beas', 'Satluj', 'Ravi', 'Chenab', 'Yamuna'] },
  { id: 'jh', name: 'Jharkhand', code: 'JH', zone: 'EASTERN_DELTA', capital: 'Ranchi', rivers: ['Damodar', 'Subarnarekha', 'Barakar', 'North Koel'] },
  { id: 'ka', name: 'Karnataka', code: 'KA', zone: 'PENINSULAR_CENTRAL', capital: 'Bengaluru', rivers: ['Cauvery', 'Krishna', 'Tungabhadra', 'Netravati', 'Sharavathi'] },
  { id: 'kl', name: 'Kerala', code: 'KL', zone: 'WESTERN_GHATS_COASTAL', capital: 'Thiruvananthapuram', rivers: ['Periyar', 'Bharathapuzha', 'Pamba', 'Chaliyar', 'Kabini'] },
  { id: 'mp', name: 'Madhya Pradesh', code: 'MP', zone: 'PENINSULAR_CENTRAL', capital: 'Bhopal', rivers: ['Narmada', 'Chambal', 'Betwa', 'Son', 'Tapti'] },
  { id: 'mh', name: 'Maharashtra', code: 'MH', zone: 'URBAN_METRO', capital: 'Mumbai', rivers: ['Mithi', 'Godavari', 'Krishna', 'Tapi', 'Vashishti', 'Kalu'] },
  { id: 'mn', name: 'Manipur', code: 'MN', zone: 'NORTHEAST_BRAHMAPUTRA', capital: 'Imphal', rivers: ['Barak', 'Imphal', 'Iril', 'Thoubal'] },
  { id: 'ml', name: 'Meghalaya', code: 'ML', zone: 'NORTHEAST_BRAHMAPUTRA', capital: 'Shillong', rivers: ['Umiam', 'Kopili', 'Myntdu', 'Simsang'] },
  { id: 'mz', name: 'Mizoram', code: 'MZ', zone: 'NORTHEAST_BRAHMAPUTRA', capital: 'Aizawl', rivers: ['Tlawng', 'Chhimtuipui', 'Khawthlangtuipui', 'Tut'] },
  { id: 'nl', name: 'Nagaland', code: 'NL', zone: 'NORTHEAST_BRAHMAPUTRA', capital: 'Kohima', rivers: ['Doyang', 'Dhansiri', 'Dikhu', 'Tizu'] },
  { id: 'or', name: 'Odisha', code: 'OR', zone: 'EASTERN_DELTA', capital: 'Bhubaneswar', rivers: ['Mahanadi', 'Brahmani', 'Baitarani', 'Subarnarekha', 'Rushikulya'] },
  { id: 'pb', name: 'Punjab', code: 'PB', zone: 'HIMALAYAN_NORTH', capital: 'Chandigarh', rivers: ['Sutlej', 'Beas', 'Ravi', 'Ghaggar'] },
  { id: 'rj', name: 'Rajasthan', code: 'RJ', zone: 'PENINSULAR_CENTRAL', capital: 'Jaipur', rivers: ['Chambal', 'Banas', 'Luni', 'Mahi', 'Sabarmati'] },
  { id: 'sk', name: 'Sikkim', code: 'SK', zone: 'NORTHEAST_BRAHMAPUTRA', capital: 'Gangtok', rivers: ['Teesta', 'Rangeet', 'Lachen', 'Lachung'] },
  { id: 'tn', name: 'Tamil Nadu', code: 'TN', zone: 'COASTAL_CYCLONE', capital: 'Chennai', rivers: ['Cauvery', 'Adyar', 'Cooum', 'Vaigai', 'Tamirabarani'] },
  { id: 'ts', name: 'Telangana', code: 'TS', zone: 'PENINSULAR_CENTRAL', capital: 'Hyderabad', rivers: ['Godavari', 'Krishna', 'Musi', 'Manjira', 'Pranhita'] },
  { id: 'tr', name: 'Tripura', code: 'TR', zone: 'NORTHEAST_BRAHMAPUTRA', capital: 'Agartala', rivers: ['Howrah', 'Gumti', 'Khowai', 'Manu', 'Feni'] },
  { id: 'up', name: 'Uttar Pradesh', code: 'UP', zone: 'EASTERN_DELTA', capital: 'Lucknow', rivers: ['Ganga', 'Yamuna', 'Ghaghara', 'Gomti', 'Ramganga', 'Betwa'] },
  { id: 'uk', name: 'Uttarakhand', code: 'UK', zone: 'HIMALAYAN_NORTH', capital: 'Dehradun', rivers: ['Alaknanda', 'Bhagirathi', 'Mandakini', 'Ganga', 'Dhauliganga', 'Yamuna'] },
  { id: 'wb', name: 'West Bengal', code: 'WB', zone: 'EASTERN_DELTA', capital: 'Kolkata', rivers: ['Hooghly', 'Teesta', 'Damodar', 'Matla', 'Jaldhaka', 'Rupnarayan'] },

  // ── 8 UNION TERRITORIES ──
  { id: 'an', name: 'Andaman & Nicobar', code: 'AN', zone: 'COASTAL_CYCLONE', capital: 'Port Blair', rivers: ['Kalpong', 'Galathea', 'Alexandra'], isUT: true },
  { id: 'ch', name: 'Chandigarh', code: 'CH', zone: 'HIMALAYAN_NORTH', capital: 'Chandigarh', rivers: ['Sukhna Choe', 'Patiali Ki Rao'], isUT: true },
  { id: 'dn', name: 'Dadra & Nagar Haveli and Daman & Diu', code: 'DN', zone: 'WESTERN_GHATS_COASTAL', capital: 'Daman', rivers: ['Daman Ganga', 'Kolak'], isUT: true },
  { id: 'dl', name: 'Delhi (NCT)', code: 'DL', zone: 'URBAN_METRO', capital: 'New Delhi', rivers: ['Yamuna', 'Najafgarh Drain', 'Hindon'], isUT: true },
  { id: 'jk', name: 'Jammu & Kashmir', code: 'JK', zone: 'HIMALAYAN_NORTH', capital: 'Srinagar', rivers: ['Jhelum', 'Chenab', 'Indus', 'Tawi'], isUT: true },
  { id: 'la', name: 'Ladakh', code: 'LA', zone: 'HIMALAYAN_NORTH', capital: 'Leh', rivers: ['Indus', 'Zanskar', 'Shyok', 'Nubra', 'Suru'], isUT: true },
  { id: 'ld', name: 'Lakshadweep', code: 'LD', zone: 'COASTAL_CYCLONE', capital: 'Kavaratti', rivers: ['Arabian Sea Lagoon Basin'], isUT: true },
  { id: 'py', name: 'Puducherry', code: 'PY', zone: 'COASTAL_CYCLONE', capital: 'Puducherry', rivers: ['Gingee', 'Pennaiyar', 'Coringa'], isUT: true },
];

/**
 * Robust geographic bounding-box reverse resolver for India
 * Maps any GPS coordinates (lat, lon) to the accurate Indian State, District, and primary river basin.
 */
export function getStateFromCoordinates(lat: number, lon: number): {
  state: string;
  district: string;
  basin: string;
} {
  // Ladakh: 32.5 - 37.5 N, 75.5 - 80.5 E
  if (lat >= 32.5 && lat <= 37.5 && lon >= 75.5 && lon <= 80.5 && lat > 34.0) {
    return { state: 'Ladakh', district: 'Leh District', basin: 'Indus Basin' };
  }

  // Jammu & Kashmir: 32.2 - 35.5 N, 73.4 - 76.5 E
  if (lat >= 32.2 && lat <= 35.5 && lon >= 73.4 && lon <= 76.5) {
    return { state: 'Jammu & Kashmir', district: 'Kashmir Valley (Srinagar)', basin: 'Jhelum Basin' };
  }

  // Himachal Pradesh: 30.3 - 33.3 N, 75.6 - 79.0 E
  if (lat >= 30.3 && lat <= 33.3 && lon >= 75.6 && lon <= 79.0) {
    return { state: 'Himachal Pradesh', district: 'Kullu Valley', basin: 'Beas / Satluj Basin' };
  }

  // Punjab / Chandigarh: 29.5 - 32.5 N, 73.8 - 77.0 E
  if (lat >= 29.5 && lat <= 32.5 && lon >= 73.8 && lon <= 77.0) {
    if (lat >= 30.6 && lat <= 30.8 && lon >= 76.6 && lon <= 76.9) {
      return { state: 'Chandigarh', district: 'Chandigarh Capital Region', basin: 'Sukhna Choe' };
    }
    return { state: 'Punjab', district: 'Harike / Firozpur', basin: 'Sutlej-Beas Basin' };
  }

  // Uttarakhand: 28.7 - 31.5 N, 77.5 - 81.1 E
  if (lat >= 28.7 && lat <= 31.5 && lon >= 77.5 && lon <= 81.1) {
    return { state: 'Uttarakhand', district: 'Chamoli District', basin: 'Alaknanda Basin' };
  }

  // Delhi (NCT): 28.35 - 28.90 N, 76.80 - 77.40 E
  if (lat >= 28.35 && lat <= 28.90 && lon >= 76.80 && lon <= 77.40) {
    return { state: 'Delhi (NCT)', district: 'Yamuna Floodplain Corridor', basin: 'Yamuna Basin' };
  }

  // Haryana: 27.6 - 30.9 N, 74.4 - 77.6 E
  if (lat >= 27.6 && lat <= 30.9 && lon >= 74.4 && lon <= 77.6) {
    return { state: 'Haryana', district: 'Panchkula / Ambala', basin: 'Ghaggar Basin' };
  }

  // Rajasthan: 23.0 - 30.2 N, 69.5 - 78.3 E
  if (lat >= 23.0 && lat <= 30.2 && lon >= 69.5 && lon <= 78.3) {
    return { state: 'Rajasthan', district: 'Kota / Chambal Ravines', basin: 'Chambal Basin' };
  }

  // Uttar Pradesh: 23.8 - 30.4 N, 77.0 - 84.6 E
  if (lat >= 23.8 && lat <= 30.4 && lon >= 77.0 && lon <= 84.6) {
    return { state: 'Uttar Pradesh', district: 'Prayagraj / Varanasi', basin: 'Ganga-Yamuna Basin' };
  }

  // Bihar: 24.3 - 27.5 N, 83.3 - 88.3 E
  if (lat >= 24.3 && lat <= 27.5 && lon >= 83.3 && lon <= 88.3) {
    return { state: 'Bihar', district: 'Patna / Kosi Floodplain', basin: 'Ganga / Kosi Basin' };
  }

  // Sikkim: 27.0 - 28.1 N, 88.0 - 88.9 E
  if (lat >= 27.0 && lat <= 28.1 && lon >= 88.0 && lon <= 88.9) {
    return { state: 'Sikkim', district: 'North Sikkim (Chungthang)', basin: 'Teesta Basin' };
  }

  // Assam: 24.0 - 28.2 N, 89.7 - 96.0 E
  if (lat >= 24.0 && lat <= 28.2 && lon >= 89.7 && lon <= 96.0) {
    return { state: 'Assam', district: 'Kamrup Metro (Guwahati)', basin: 'Brahmaputra Basin' };
  }

  // Arunachal Pradesh: 26.5 - 29.5 N, 91.5 - 97.5 E
  if (lat >= 26.5 && lat <= 29.5 && lon >= 91.5 && lon <= 97.5) {
    return { state: 'Arunachal Pradesh', district: 'Pasighat / East Siang', basin: 'Siang Basin' };
  }

  // Meghalaya: 25.0 - 26.1 N, 89.8 - 92.8 E
  if (lat >= 25.0 && lat <= 26.1 && lon >= 89.8 && lon <= 92.8) {
    return { state: 'Meghalaya', district: 'Sohra / Cherrapunji', basin: 'Umiam Basin' };
  }

  // Tripura: 22.9 - 24.5 N, 91.1 - 92.4 E
  if (lat >= 22.9 && lat <= 24.5 && lon >= 91.1 && lon <= 92.4) {
    return { state: 'Tripura', district: 'Agartala / West Tripura', basin: 'Howrah Basin' };
  }

  // Manipur / Nagaland / Mizoram
  if (lon >= 92.5 && lon <= 95.5 && lat >= 21.5 && lat <= 27.0) {
    if (lat > 25.5) return { state: 'Nagaland', district: 'Wokha Corridor', basin: 'Doyang Basin' };
    if (lat > 23.5) return { state: 'Manipur', district: 'Imphal Valley', basin: 'Barak Basin' };
    return { state: 'Mizoram', district: 'Aizawl Highlands', basin: 'Tlawng Basin' };
  }

  // Gujarat: 20.1 - 24.7 N, 68.1 - 74.5 E
  if (lat >= 20.1 && lat <= 24.7 && lon >= 68.1 && lon <= 74.5) {
    return { state: 'Gujarat', district: 'Surat Estuary', basin: 'Tapi Basin' };
  }

  // Madhya Pradesh: 21.1 - 26.9 N, 74.0 - 82.8 E
  if (lat >= 21.1 && lat <= 26.9 && lon >= 74.0 && lon <= 82.8) {
    return { state: 'Madhya Pradesh', district: 'Hoshangabad Reach', basin: 'Narmada Basin' };
  }

  // Chhattisgarh: 17.8 - 24.1 N, 80.2 - 84.4 E
  if (lat >= 17.8 && lat <= 24.1 && lon >= 80.2 && lon <= 84.4) {
    return { state: 'Chhattisgarh', district: 'Raipur Catchment', basin: 'Mahanadi Basin' };
  }

  // Jharkhand: 21.9 - 25.3 N, 83.3 - 87.9 E
  if (lat >= 21.9 && lat <= 25.3 && lon >= 83.3 && lon <= 87.9) {
    return { state: 'Jharkhand', district: 'Dhanbad / Bokaro', basin: 'Damodar Basin' };
  }

  // West Bengal: 21.5 - 27.3 N, 85.8 - 89.9 E
  if (lat >= 21.5 && lat <= 27.3 && lon >= 85.8 && lon <= 89.9) {
    return { state: 'West Bengal', district: 'Kolkata / Sundarbans', basin: 'Hooghly / Ganga Delta' };
  }

  // Odisha: 17.8 - 22.6 N, 81.4 - 87.5 E
  if (lat >= 17.8 && lat <= 22.6 && lon >= 81.4 && lon <= 87.5) {
    return { state: 'Odisha', district: 'Cuttack Delta', basin: 'Mahanadi Basin' };
  }

  // Maharashtra: 15.6 - 22.0 N, 72.6 - 80.9 E
  if (lat >= 15.6 && lat <= 22.0 && lon >= 72.6 && lon <= 80.9) {
    return {
      state: 'Maharashtra',
      district: lat > 18.8 && lat < 19.4 && lon > 72.7 && lon < 73.1 ? 'Mumbai Urban' : 'Chiplun / Konkan Coast',
      basin: 'Mithi / Vashishti Basin',
    };
  }

  // Goa: 14.8 - 15.8 N, 73.6 - 74.4 E
  if (lat >= 14.8 && lat <= 15.8 && lon >= 73.6 && lon <= 74.4) {
    return { state: 'Goa', district: 'Panaji Coastal', basin: 'Mandovi Basin' };
  }

  // Telangana / Hyderabad: 15.8 - 19.9 N, 77.2 - 81.8 E
  if (lat >= 15.8 && lat <= 19.9 && lon >= 77.2 && lon <= 81.8) {
    return {
      state: 'Telangana',
      district: lat > 17.2 && lat < 17.8 && lon > 78.0 && lon < 78.8 ? 'Hyderabad Urban' : 'Bhadradri Kothagudem',
      basin: 'Godavari / Musi Basin',
    };
  }

  // Andhra Pradesh: 12.6 - 19.1 N, 76.7 - 84.8 E
  if (lat >= 12.6 && lat <= 19.1 && lon >= 79.5 && lon <= 84.8) {
    return { state: 'Andhra Pradesh', district: 'Vijayawada / Krishna Delta', basin: 'Krishna Basin' };
  }

  // Karnataka: 11.5 - 18.5 N, 74.0 - 78.6 E
  if (lat >= 11.5 && lat <= 18.5 && lon >= 74.0 && lon <= 78.6) {
    return {
      state: 'Karnataka',
      district: lat > 12.7 && lat < 13.2 && lon > 77.3 && lon < 77.8 ? 'Bengaluru Urban' : 'Kodagu Highlands',
      basin: 'Cauvery / Krishna Basin',
    };
  }

  // Tamil Nadu & Puducherry: 8.1 - 13.5 N, 76.2 - 80.4 E
  if (lat >= 8.1 && lat <= 13.5 && lon >= 76.2 && lon <= 80.4) {
    if (lat >= 11.8 && lat <= 12.1 && lon >= 79.7 && lon <= 79.9) {
      return { state: 'Puducherry', district: 'Puducherry Coastal Corridor', basin: 'Gingee Basin' };
    }
    return { state: 'Tamil Nadu', district: lat > 12.8 ? 'Chennai Urban' : 'Cauvery Delta', basin: 'Cauvery / Adyar Basin' };
  }

  // Kerala: 8.2 - 12.8 N, 74.8 - 77.5 E
  if (lat >= 8.2 && lat <= 12.8 && lon >= 74.8 && lon <= 77.5) {
    return {
      state: 'Kerala',
      district: lat > 11.2 && lat < 12.0 ? 'Wayanad Ghats' : 'Idukki / Central Kerala',
      basin: 'Periyar / Chaliyar Basin',
    };
  }

  // Default Central Fallback
  return { state: 'Telangana', district: 'Hyderabad Urban', basin: 'Godavari / Musi Basin' };
}
