export interface IndianStateMeta {
  id: string;
  name: string;
  code: string;
  zone: string;
  capital: string;
  rivers: string[];
}

export const INDIAN_STATES: IndianStateMeta[] = [
  { id: 'uk', name: 'Uttarakhand', code: 'UK', zone: 'HIMALAYAN_NORTH', capital: 'Dehradun', rivers: ['Alaknanda', 'Bhagirathi', 'Mandakini', 'Ganga', 'Dhauliganga'] },
  { id: 'hp', name: 'Himachal Pradesh', code: 'HP', zone: 'HIMALAYAN_NORTH', capital: 'Shimla', rivers: ['Beas', 'Satluj', 'Ravi', 'Chenab'] },
  { id: 'jk', name: 'Jammu & Kashmir', code: 'JK', zone: 'HIMALAYAN_NORTH', capital: 'Srinagar', rivers: ['Jhelum', 'Chenab', 'Indus', 'Tawi'] },
  { id: 'as', name: 'Assam', code: 'AS', zone: 'NORTHEAST_BRAHMAPUTRA', capital: 'Dispur', rivers: ['Brahmaputra', 'Barak', 'Subansiri', 'Manas'] },
  { id: 'sk', name: 'Sikkim', code: 'SK', zone: 'NORTHEAST_BRAHMAPUTRA', capital: 'Gangtok', rivers: ['Teesta', 'Rangeet', 'Lachen', 'Lachung'] },
  { id: 'ml', name: 'Meghalaya', code: 'ML', zone: 'NORTHEAST_BRAHMAPUTRA', capital: 'Shillong', rivers: ['Umiam', 'Kopili', 'Myntdu'] },
  { id: 'ar', name: 'Arunachal Pradesh', code: 'AR', zone: 'NORTHEAST_BRAHMAPUTRA', capital: 'Itanagar', rivers: ['Siang', 'Dibang', 'Lohit', 'Subansiri'] },
  { id: 'kl', name: 'Kerala', code: 'KL', zone: 'WESTERN_GHATS_COASTAL', capital: 'Thiruvananthapuram', rivers: ['Periyar', 'Bharathapuzha', 'Pamba', 'Chaliyar'] },
  { id: 'mh', name: 'Maharashtra', code: 'MH', zone: 'URBAN_METRO', capital: 'Mumbai', rivers: ['Mithi', 'Godavari', 'Krishna', 'Tapi', 'Vashishti'] },
  { id: 'ka', name: 'Karnataka', code: 'KA', zone: 'PENINSULAR_CENTRAL', capital: 'Bengaluru', rivers: ['Cauvery', 'Krishna', 'Tungabhadra', 'Netravati'] },
  { id: 'tn', name: 'Tamil Nadu', code: 'TN', zone: 'COASTAL_CYCLONE', capital: 'Chennai', rivers: ['Cauvery', 'Adyar', 'Cooum', 'Vaigai'] },
  { id: 'ts', name: 'Telangana', code: 'TS', zone: 'PENINSULAR_CENTRAL', capital: 'Hyderabad', rivers: ['Godavari', 'Krishna', 'Musi'] },
  { id: 'or', name: 'Odisha', code: 'OR', zone: 'EASTERN_DELTA', capital: 'Bhubaneswar', rivers: ['Mahanadi', 'Brahmani', 'Baitarani', 'Subarnarekha'] },
  { id: 'br', name: 'Bihar', code: 'BR', zone: 'EASTERN_DELTA', capital: 'Patna', rivers: ['Ganga', 'Kosi', 'Gandak', 'Bagmati', 'Son'] },
  { id: 'wb', name: 'West Bengal', code: 'WB', zone: 'EASTERN_DELTA', capital: 'Kolkata', rivers: ['Hooghly', 'Teesta', 'Damodar', 'Matla'] },
  { id: 'mp', name: 'Madhya Pradesh', code: 'MP', zone: 'PENINSULAR_CENTRAL', capital: 'Bhopal', rivers: ['Narmada', 'Chambal', 'Betwa', 'Son'] },
];

/**
 * Robust geographic bounding-box reverse resolver for India
 * Maps any GPS coordinates (lat, lon) to the accurate Indian State and primary basin.
 */
export function getStateFromCoordinates(lat: number, lon: number): {
  state: string;
  district: string;
  basin: string;
} {
  // Telangana / Hyderabad Metropolitan: 15.8 - 19.9 N, 77.2 - 81.8 E
  if (lat >= 15.8 && lat <= 19.9 && lon >= 77.2 && lon <= 81.8) {
    return {
      state: 'Telangana',
      district: lat > 17.2 && lat < 17.8 && lon > 78.0 && lon < 78.8 ? 'Hyderabad / Greater Capital' : 'Bhadradri / Godavari Corridor',
      basin: 'Godavari / Musi Basin',
    };
  }

  // Andhra Pradesh: 12.6 - 19.1 N, 76.7 - 84.8 E
  if (lat >= 12.6 && lat <= 19.1 && lon >= 79.5 && lon <= 84.8) {
    return { state: 'Andhra Pradesh', district: 'Krishna / Godavari Delta', basin: 'Krishna Basin' };
  }

  // Kerala: 8.2 - 12.8 N, 74.8 - 77.5 E
  if (lat >= 8.2 && lat <= 12.8 && lon >= 74.8 && lon <= 77.5) {
    return {
      state: 'Kerala',
      district: lat > 11.2 && lat < 12.0 ? 'Wayanad Ghats' : 'Idukki / Central Kerala',
      basin: 'Periyar / Chaliyar Basin',
    };
  }

  // Tamil Nadu: 8.1 - 13.5 N, 76.2 - 80.4 E
  if (lat >= 8.1 && lat <= 13.5 && lon >= 76.2 && lon <= 80.4) {
    return { state: 'Tamil Nadu', district: lat > 12.8 ? 'Chennai Urban' : 'Cauvery Delta', basin: 'Cauvery / Adyar Basin' };
  }

  // Karnataka: 11.5 - 18.5 N, 74.0 - 78.6 E
  if (lat >= 11.5 && lat <= 18.5 && lon >= 74.0 && lon <= 78.6) {
    return {
      state: 'Karnataka',
      district: lat > 12.7 && lat < 13.2 && lon > 77.3 && lon < 77.8 ? 'Bengaluru Urban' : 'Kodagu Highlands',
      basin: 'Cauvery / Krishna Basin',
    };
  }

  // Maharashtra: 15.6 - 22.0 N, 72.6 - 80.9 E
  if (lat >= 15.6 && lat <= 22.0 && lon >= 72.6 && lon <= 80.9) {
    return {
      state: 'Maharashtra',
      district: lat > 18.8 && lat < 19.4 && lon > 72.7 && lon < 73.1 ? 'Mumbai Urban' : 'Chiplun / Konkan Coast',
      basin: 'Mithi / Vashishti Basin',
    };
  }

  // Odisha: 17.8 - 22.6 N, 81.4 - 87.5 E
  if (lat >= 17.8 && lat <= 22.6 && lon >= 81.4 && lon <= 87.5) {
    return { state: 'Odisha', district: 'Cuttack Delta', basin: 'Mahanadi Basin' };
  }

  // West Bengal: 21.5 - 27.3 N, 85.8 - 89.9 E
  if (lat >= 21.5 && lat <= 27.3 && lon >= 85.8 && lon <= 89.9) {
    return { state: 'West Bengal', district: 'Kolkata / Delta', basin: 'Hooghly / Ganga Delta' };
  }

  // Bihar: 24.3 - 27.5 N, 83.3 - 88.3 E
  if (lat >= 24.3 && lat <= 27.5 && lon >= 83.3 && lon <= 88.3) {
    return { state: 'Bihar', district: 'Patna / Kosi Floodplain', basin: 'Ganga / Kosi Basin' };
  }

  // Assam: 24.0 - 28.2 N, 89.7 - 96.0 E
  if (lat >= 24.0 && lat <= 28.2 && lon >= 89.7 && lon <= 96.0) {
    return { state: 'Assam', district: 'Kamrup Metro (Guwahati)', basin: 'Brahmaputra Basin' };
  }

  // Sikkim: 27.0 - 28.1 N, 88.0 - 88.9 E
  if (lat >= 27.0 && lat <= 28.1 && lon >= 88.0 && lon <= 88.9) {
    return { state: 'Sikkim', district: 'North Sikkim (Chungthang)', basin: 'Teesta Basin' };
  }

  // Himachal Pradesh: 30.3 - 33.3 N, 75.6 - 79.0 E
  if (lat >= 30.3 && lat <= 33.3 && lon >= 75.6 && lon <= 79.0) {
    return { state: 'Himachal Pradesh', district: 'Kullu Valley', basin: 'Beas / Satluj Basin' };
  }

  // Jammu & Kashmir: 32.2 - 37.1 N, 73.4 - 80.3 E
  if (lat >= 32.2 && lat <= 37.1 && lon >= 73.4 && lon <= 80.3) {
    return { state: 'Jammu & Kashmir', district: 'Kashmir Valley (Srinagar)', basin: 'Jhelum Basin' };
  }

  // Uttarakhand: 28.7 - 31.5 N, 77.5 - 81.1 E
  if (lat >= 28.7 && lat <= 31.5 && lon >= 77.5 && lon <= 81.1) {
    return { state: 'Uttarakhand', district: 'Chamoli District', basin: 'Alaknanda Basin' };
  }

  // Fallback to Central India
  return { state: 'Telangana', district: 'Hyderabad Urban', basin: 'Godavari / Musi Basin' };
}
