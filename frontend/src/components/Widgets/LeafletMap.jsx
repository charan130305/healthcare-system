import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../../services/api';
import { ShieldAlert, Crosshair, Navigation, Sparkles } from 'lucide-react';

// FIX Leaflet marker icon issue in Vite/Webpack bundling
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom Red marker for emergency-ready hospitals
const emergencyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom Blue marker for regular clinics
const standardIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically re-center map on coordinates change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom]);
  return null;
}

export default function LeafletMap() {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'Government', 'Private'
  const [filterEmergency, setFilterEmergency] = useState(false);
  const [center, setCenter] = useState([28.6139, 77.2090]); // Default New Delhi
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    fetchHospitals();
    
    // Auto locate citizen
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.log('Location access not granted for maps')
      );
    }
  }, []);

  const fetchHospitals = async () => {
    try {
      const data = await api.citizen.getHospitals();
      setHospitals(data);
      setFilteredHospitals(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Run filters
  useEffect(() => {
    let result = hospitals;
    
    if (filterType !== 'ALL') {
      result = result.filter(h => h.type === filterType);
    }
    
    if (filterEmergency) {
      result = result.filter(h => h.isEmergencyReady);
    }
    
    setFilteredHospitals(result);
  }, [filterType, filterEmergency, hospitals]);

  const handleRecenter = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setZoom(14);
      });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="font-sans text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Navigation className="h-4 w-4 text-health-500" />
            Hospital & Clinic Locator
          </h2>
          <p className="text-[11px] text-slate-400">Discover healthcare points inside local and rural blocks.</p>
        </div>

        {/* Map Filters */}
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
          >
            <option value="ALL">All Facilities</option>
            <option value="Government">Government Centres</option>
            <option value="Private">Private Clinics</option>
          </select>

          <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 cursor-pointer dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
            <input
              type="checkbox"
              checked={filterEmergency}
              onChange={(e) => setFilterEmergency(e.target.checked)}
              className="rounded text-health-500 focus:ring-health-500"
            />
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldAlert className="h-3 w-3 text-red-500" />
              Emergency Ready
            </span>
          </label>

          <button
            onClick={handleRecenter}
            className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            <Crosshair className="h-3.5 w-3.5" />
            <span>My Location</span>
          </button>
        </div>
      </div>

      {/* Map Window */}
      <div className="mt-4 h-[350px] w-full overflow-hidden rounded-xl border border-slate-150 dark:border-slate-800">
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full">
          <ChangeView center={center} zoom={zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredHospitals.map(h => (
            <Marker
              key={h.id}
              position={[h.latitude, h.longitude]}
              icon={h.isEmergencyReady ? emergencyIcon : standardIcon}
            >
              <Popup>
                <div className="p-1 font-sans">
                  <h3 className="font-bold text-slate-800 text-sm leading-tight">{h.name}</h3>
                  <p className="text-slate-500 text-[10px] mt-1 leading-normal">{h.address}</p>
                  
                  <div className="mt-2 flex flex-col gap-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="font-semibold text-slate-700">{h.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="font-mono text-slate-700">{h.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold text-red-500 flex items-center gap-0.5">
                        {h.isEmergencyReady && <Sparkles className="h-2.5 w-2.5 text-amber-500" />} Emergency Ready:
                      </span>
                      <span className={`font-semibold ${h.isEmergencyReady ? 'text-emerald-600' : 'text-red-500'}`}>
                        {h.isEmergencyReady ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
