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
