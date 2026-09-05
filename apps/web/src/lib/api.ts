const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      next: { revalidate: 10 }, // 10s ISR
    });
    
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`Fetch failed for ${url}:`, error);
    throw error;
  }
}

export const api = {
  getSystemHealth: () => fetchApi('/health'),
  getRiskAssessments: () => fetchApi('/api/v1/risk/assessments'),
  getAlerts: () => fetchApi('/api/v1/alerts'),
  getIncidents: () => fetchApi('/api/v1/incidents'),
  getRegions: () => fetchApi('/api/v1/locations/regions'),
  getWatersheds: () => fetchApi('/api/v1/locations/watersheds'),
  getIoTDevices: () => fetchApi('/api/v1/iot/devices'),
  runSimulation: (data: any) => fetchApi('/api/v1/simulation/run', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
