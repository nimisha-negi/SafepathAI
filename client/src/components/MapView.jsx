import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

const redZonePolygons = [
  {
    name: 'Ajmeri Gate Area',
    coordinates: [
      [28.6532, 77.2188],
      [28.6536, 77.2199],
      [28.6523, 77.2205],
      [28.6520, 77.2190],
    ],
  },
  {
    name: 'Nangloi Block C',
    coordinates: [
      [28.6790, 77.0600],
      [28.6802, 77.0612],
      [28.6785, 77.0621],
      [28.6777, 77.0605],
    ],
  },
];

const liveLocationIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

const carIcon = L.icon({
  iconUrl: './car.jpg', 
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Red zone proximity checker
function isPointNearRedZone(lat, lng) {
  const pt = turf.point([lng, lat]);
  return redZonePolygons.some(zone => {
    const coords = zone.coordinates.map(([lat, lng]) => [lng, lat]);
    const poly = turf.polygon([[...coords, coords[0]]]);
    const dist = turf.pointToPolygonDistance(pt, poly, { units: 'kilometers' });
    return dist < 0.1; // 100m
  });
}

// Beep sound
async function playBeep() {
  const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
  await audio.play();
}

// Live location marker
const LiveLocationMarker = () => {
  const map = useMap();
  const markerRef = useRef(null);
  const inRedZoneRef = useRef(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const latlng = L.latLng(latitude, longitude);

        if (!markerRef.current) {
          markerRef.current = L.marker(latlng, { icon: liveLocationIcon }).addTo(map);
          map.setView(latlng, 14);
        } else {
          markerRef.current.setLatLng(latlng);
        }

        const isInRedZone = isPointNearRedZone(latitude, longitude);
        if (isInRedZone && !inRedZoneRef.current) {
          inRedZoneRef.current = true;
          await playBeep();
          alert('⚠️ You are entering a red zone!');
        } else if (!isInRedZone) {
          inRedZoneRef.current = false;
        }
      },
      (err) => console.error('Geolocation error:', err),
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  return null;
};

// Routing component
const Routing = ({ from, to, onRouteInfo, routeIndex, onPathReady }) => {
  const map = useMap();
  const controlRef = useRef();

  useEffect(() => {
    if (!map || !from || !to) return;

    if (controlRef.current) {
      map.removeControl(controlRef.current);
    }

    const waypoints = [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)];

    const routingControl = L.Routing.control({
      waypoints,
      routeWhileDragging: false,
      showAlternatives: true,
      addWaypoints: false,
      createMarker: () => null,
      lineOptions: { styles: [{ color: '#2A9D8F', weight: 6 }] },
      router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
    }).addTo(map);

    controlRef.current = routingControl;

    routingControl.on('routesfound', async (e) => {
      const route = e.routes[routeIndex] || e.routes[0];
      const coords = route.coordinates.map(c => [c.lat, c.lng]);

      const intersects = coords.some(([lat, lng]) => isPointNearRedZone(lat, lng));
      onPathReady(coords); // 🔁 pass full path to parent

      if (intersects) await playBeep();

      const duration = Math.round(route.summary.totalTime / 60);
      const distance = (route.summary.totalDistance / 1000).toFixed(2);
      onRouteInfo({ duration, distance, intersects });
    });

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
      }
    };
  }, [map, from, to, routeIndex]);

  return null;
};

export default function MapView() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [suggestions, setSuggestions] = useState({ from: [], to: [] });
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeKey, setRouteKey] = useState(0);
  const [routeIndex, setRouteIndex] = useState(0);

  const [carPath, setCarPath] = useState([]);
  const [carPosition, setCarPosition] = useState(null);
  const carIndexRef = useRef(0);
  const carIntervalRef = useRef(null);
  const carBeepedRef = useRef(false); // track beep


  const animateCar = (path) => {
    clearInterval(carIntervalRef.current);
    if (!path.length) return;

    carIndexRef.current = 0;
    carIntervalRef.current = setInterval(() => {
      if (carIndexRef.current < path.length) {
        const pos = path[carIndexRef.current];
        setCarPosition(pos);

        if (isPointNearRedZone(pos[0], pos[1]) && !carBeepedRef.current) {
  playBeep();
  alert("⚠️ Approaching red zone within 50 meters!");
  carBeepedRef.current = true;
}


        carIndexRef.current++;
      } else {
        clearInterval(carIntervalRef.current);
      }
    }, 400);
  };

  const getSuggestions = async (text, key) => {
    if (!text) return;
    const res = await axios.get(`https://photon.komoot.io/api/?q=${text}&lang=en&limit=5&lat=28.6&lon=77.2`);
    setSuggestions(prev => ({
      ...prev,
      [key]: res.data.features.map(f => ({
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
    setSuggestions(prev => ({ ...prev, [key]: [] }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!fromCoords || !toCoords) return alert('Please select valid locations.');
    setRouteKey(prev => prev + 1);
  };

  return (
    <div style={{ fontFamily: 'Poppins', background: '#12151c', color: 'green' }}>
      <div style={{ padding: '1rem', textAlign: 'center', background: '#1C1F26' }}>
        <h2>SafePath AI – Navigate Smart. Travel Safe.</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          {['from', 'to'].map(key => (
            <div key={key} style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
              <input
                placeholder={`${key === 'from' ? 'From' : 'To'} (type to search)`}
                value={key === 'from' ? from : to}
                onChange={e => {
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
            {/* {routeInfo.intersects && (
              // <button
              //   onClick={() => {
              //     setRouteIndex(1);
              //     setRouteKey(prev => prev + 1);
              //   }}
              //   style={{ marginTop: '0.5rem', background: '#f44336', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: 6 }}
              // >
              //   Try Alternate Route
              // </button>
            )} */}
          </div>
        )}
      </div>

      <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: '85vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {redZonePolygons.map((zone, i) => (
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
          />
        )}

        <LiveLocationMarker />

        {carPosition && <Marker position={carPosition} icon={carIcon} />}
      </MapContainer>
    </div>
  );
}
