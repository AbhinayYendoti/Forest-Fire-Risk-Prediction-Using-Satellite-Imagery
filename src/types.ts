export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface HistoricalData {
  date: string;
  fireCount: number;
  avgTemperature: number;
  avgHumidity: number;
}

export interface SatelliteImage {
  id: string;
  url: string;
  timestamp: string;
  coordinates: [number, number];
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
}