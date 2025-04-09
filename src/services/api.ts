import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import type { WeatherData, HistoricalData, SatelliteImage } from '../types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// NASA FIRMS API for active fire data
const NASA_FIRMS_API = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv/';
const API_KEY = import.meta.env.VITE_NASA_API_KEY;

// OpenWeatherMap API for weather data
const WEATHER_API = 'https://api.openweathermap.org/data/3.0/onecall';
const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getActiveFireData = async (bounds: { north: number; south: number; east: number; west: number }) => {
  try {
    const response = await axios.get(`${NASA_FIRMS_API}${API_KEY}`, {
      params: {
        area: [bounds.north, bounds.south, bounds.east, bounds.west].join(','),
        date: 'current'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching fire data:', error);
    return null;
  }
};

export const getWeatherData = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    const response = await axios.get(WEATHER_API, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    
    return {
      temperature: response.data.current.temp,
      humidity: response.data.current.humidity,
      windSpeed: response.data.current.wind_speed,
      precipitation: response.data.current.rain?.['1h'] || 0
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export const getHistoricalData = async (region: string): Promise<HistoricalData[]> => {
  const { data, error } = await supabase
    .from('historical_data')
    .select('*')
    .eq('region', region)
    .order('date', { ascending: false })
    .limit(30);

  if (error) throw error;
  return data;
};

export const getSatelliteImagery = async (coordinates: [number, number]): Promise<SatelliteImage[]> => {
  const { data, error } = await supabase
    .from('satellite_images')
    .select('*')
    .eq('coordinates', coordinates)
    .order('timestamp', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};