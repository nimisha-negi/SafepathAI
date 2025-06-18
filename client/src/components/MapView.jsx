import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker
} from 'react-leaflet';
import axios from 'axios';
import 'leaflet-routing-machine';

import Routing from '../components/Routing';
import LiveLocationMarker from '../components/LiveLocationMarker';
import { carIcon } from '../utils/icons';
import { isPointNearRedZone } from '../utils/geo';
import { playBeep } from '../utils/sound';

export default function MapView() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [suggestions, setSuggestions] = useState({ from: [], to: [] });
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeKey, setRouteKey] = useState(0);
  const [routeIndex, setRouteIndex] = useState(0);
  const [redZonePolygons, setRedZonePolygons] = useState([]);

  const [carPath, setCarPath] = useState([]);
  const [carPosition, setCarPosition] = useState(null);
  const carIndexRef = useRef(0);
  const carIntervalRef = useRef(null);
  const carBeepedRef = useRef(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/ws/redzones');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          setRedZonePolygons(data);
        }
      } catch (err) {
        console.error("Red zone parse error:", err);
      }
    };
    return () => ws.close();
  }, []);

  const animateCar = (path) => {
    clearInterval(carIntervalRef.current);
    carBeepedRef.current = false;

    if (!path.length) return;

    carIndexRef.current = 0;
    carIntervalRef.current = setInterval(() => {
      if (carIndexRef.current < path.length) {
        const pos = path[carIndexRef.current];
        setCarPosition(pos);

        if (
          isPointNearRedZone(pos[0], pos[1], redZonePolygons) &&
          !carBeepedRef.current
        ) {
          playBeep();
          alert("⚠️ Approaching red zone within 50 meters!");
          carBeepedRef.current = true;
        }

        carIndexRef.current++;
      } else {
        clearInterval(carIntervalRef.current);
      }
    }, 500);
  };

  const getSuggestions = async (text, key) => {
    if (!text) return;
    const res = await axios.get(
      `https://photon.komoot.io/api/?q=${text}&lang=en&limit=5&lat=28.6&lon=77.2`
    );
    setSuggestions((prev) => ({
      ...prev,
      [key]: res.data.features.map((f) => ({
        label: f.properties.name + ', ' + (f.properties.city || 'Delhi'),
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      })),
    }));
  };

  const selectLocation = (item, key) => {
    if (key === 'from') {
      setFrom(item.label);
      setFromCoords({ lat: item.lat, lng: item.lng });
    } else {
      setTo(item.label);
      setToCoords({ lat: item.lat, lng: item.lng });
    }
    setSuggestions((prev) => ({ ...prev, [key]: [] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromCoords || !toCoords) return alert('Please select valid locations.');
    setRouteKey((prev) => prev + 1);
  };

  return (
    <div style={{ fontFamily: 'Poppins', background: '#12151c', color: 'green' }}>
      <div style={{ padding: '1rem', textAlign: 'center', background: '#1C1F26' }}>
        <h2>SafePath AI – Navigate Smart. Travel Safe.</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          {['from', 'to'].map((key) => (
            <div key={key} style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
              <input
                placeholder={`${key === 'from' ? 'From' : 'To'} (type to search)`}
                value={key === 'from' ? from : to}
                onChange={(e) => {
                  key === 'from' ? setFrom(e.target.value) : setTo(e.target.value);
                  getSuggestions(e.target.value, key);
                }}
                style={{ padding: '0.7rem 1rem', width: '100%', borderRadius: 8, border: '1px solid #aaa' }}
              />
              {suggestions[key].length > 0 && (
                <ul style={{ position: 'absolute', zIndex: 1000, width: '100%', background: '#fff', color: '#000', borderRadius: 4 }}>
                  {suggestions[key].map((item, i) => (
                    <li key={i} onClick={() => selectLocation(item, key)} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <button type="submit" style={{ background: '#2A9D8F', padding: '0.7rem 2rem', color: 'white', border: 'none', borderRadius: 8 }}>
            Show Route
          </button>
        </form>

        {routeInfo && (
          <div style={{ marginTop: '1rem', background: '#20242d', padding: '1rem 2rem', borderRadius: 12 }}>
            <p>🕒 ETA: <strong>{routeInfo.duration} min</strong></p>
            <p>📏 Distance: <strong>{routeInfo.distance} km</strong></p>
          </div>
        )}
      </div>

      <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: '85vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {Array.isArray(redZonePolygons) &&
          redZonePolygons.map((zone, i) => (
            <Polygon
              key={i}
              positions={zone.coordinates}
              pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }}
            />
          ))}

        {fromCoords && toCoords && (
          <Routing
            key={routeKey}
            from={fromCoords}
            to={toCoords}
            routeIndex={routeIndex}
            onRouteInfo={setRouteInfo}
            onPathReady={animateCar}
            redZonePolygons={redZonePolygons}
          />
        )}

        <LiveLocationMarker redZonePolygons={redZonePolygons} />

        {carPosition && <Marker position={carPosition} icon={carIcon} />}
      </MapContainer>
    </div>
  );
}
