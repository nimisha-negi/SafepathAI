import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { liveLocationIcon } from '../utils/icons';
import { isPointNearRedZone } from '../utils/geo';
import { playBeep } from '../utils/sound';
import L from 'leaflet';

export default function LiveLocationMarker({ redZonePolygons }) {
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

        const isNear = isPointNearRedZone(latitude, longitude, redZonePolygons);
        if (isNear && !inRedZoneRef.current) {
          inRedZoneRef.current = true;
          await playBeep();
          alert('⚠️ You are entering a red zone!');
        } else if (!isNear) {
          inRedZoneRef.current = false;
        }
      },
      err => console.error('Geolocation error:', err),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, redZonePolygons]);

  return null;
}
