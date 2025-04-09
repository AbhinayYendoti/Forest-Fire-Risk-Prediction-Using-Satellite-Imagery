import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Flame, AlertTriangle, ThermometerSun, Wind, Droplets, History, Satellite } from 'lucide-react';
import { Auth } from './components/Auth';
import { HistoricalChart } from './components/HistoricalChart';
import { getWeatherData, getHistoricalData, getSatelliteImagery } from './services/api';
import type { WeatherData, HistoricalData, SatelliteImage } from './types';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default marker icon in React-Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [satelliteImages, setSatelliteImages] = useState<SatelliteImage[]>([]);
  
  const riskAreas = [
    { position: [37.7749, -122.4194], risk: 'high', name: 'San Francisco Forest' },
    { position: [34.0522, -118.2437], risk: 'medium', name: 'Los Angeles National Park' },
    { position: [40.7128, -74.0060], risk: 'low', name: 'New York State Forest' },
  ];

  useEffect(() => {
    if (selectedRegion) {
      const area = riskAreas.find(a => a.name === selectedRegion);
      if (area) {
        // Fetch weather data
        getWeatherData(area.position[0], area.position[1])
          .then(data => setWeatherData(data));

        // Fetch historical data
        getHistoricalData(selectedRegion)
          .then(data => setHistoricalData(data));

        // Fetch satellite imagery
        getSatelliteImagery(area.position)
          .then(images => setSatelliteImages(images));
      }
    }
  }, [selectedRegion]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Flame className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Forest Fire Prediction System</h1>
          </div>
          <Auth />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="h-[600px] rounded-lg overflow-hidden">
              <MapContainer
                center={[39.8283, -98.5795]}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {riskAreas.map((area, index) => (
                  <Marker
                    key={index}
                    position={area.position as [number, number]}
                    eventHandlers={{
                      click: () => setSelectedRegion(area.name),
                    }}
                  >
                    <Popup>{area.name} - Risk Level: {area.risk}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Stats and Info Section */}
          <div className="space-y-6">
            {/* Current Conditions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Current Conditions</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ThermometerSun className="h-5 w-5 text-orange-500" />
                    <span>Temperature</span>
                  </div>
                  <span className="font-medium">{weatherData?.temperature ?? '--'}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wind className="h-5 w-5 text-blue-500" />
                    <span>Wind Speed</span>
                  </div>
                  <span className="font-medium">{weatherData?.windSpeed ?? '--'} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <span>Humidity</span>
                  </div>
                  <span className="font-medium">{weatherData?.humidity ?? '--'}%</span>
                </div>
              </div>
            </div>

            {/* Satellite Imagery */}
            {satelliteImages.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Satellite className="h-5 w-5 text-purple-500" />
                  <h2 className="text-lg font-semibold">Satellite Imagery</h2>
                </div>
                <div className="space-y-4">
                  {satelliteImages.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt={`Satellite image from ${image.timestamp}`}
                        className="w-full rounded-lg"
                      />
                      <span className="text-sm text-gray-500">
                        {new Date(image.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historical Data */}
            {historicalData.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <History className="h-5 w-5 text-indigo-500" />
                  <h2 className="text-lg font-semibold">Historical Analysis</h2>
                </div>
                <HistoricalChart data={historicalData} />
              </div>
            )}

            {/* Risk Assessment */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Risk Assessment</h2>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Flame className="h-5 w-5 text-red-500" />
                    <span className="font-medium text-red-700">High Risk Areas</span>
                  </div>
                  <p className="mt-2 text-sm text-red-600">
                    San Francisco Forest region shows elevated fire risk due to high temperatures and low humidity.
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium text-yellow-700">Medium Risk Areas</span>
                  </div>
                  <p className="mt-2 text-sm text-yellow-600">
                    Los Angeles National Park area requires monitoring due to increasing wind speeds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;