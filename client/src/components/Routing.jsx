import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { isPointNearRedZone } from '../utils/geo';
import { playBeep } from '../utils/sound';

export default function Routing({ from, to, onRouteInfo, routeIndex, onPathReady, redZonePolygons }) {
  const map = useMap();
  const controlRef = useRef();

  useEffect(() => {
    if (!map || !from || !to) return;

    if (controlRef.current) map.removeControl(controlRef.current);

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

      const intersects = coords.some(([lat, lng]) =>
        isPointNearRedZone(lat, lng, redZonePolygons)
      );

      onPathReady(coords);

      if (intersects) await playBeep();

      const duration = Math.round(route.summary.totalTime / 60);
      const distance = (route.summary.totalDistance / 1000).toFixed(2);
      onRouteInfo({ duration, distance, intersects });
    });

    return () => {
      if (controlRef.current) map.removeControl(controlRef.current);
    };
  }, [map, from, to, routeIndex, redZonePolygons]);

  return null;
}
