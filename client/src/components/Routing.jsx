// import { useEffect, useRef } from 'react';
// import { useMap } from 'react-leaflet';
// import L from 'leaflet';
// import { isPointInsideAnyPolygon, playBeep } from '../utils/Helpers';

// const Routing = ({ from, to, onRouteInfo, onSelectRoute, mapboxToken }) => {
//   const map = useMap();
//   const controlRef = useRef();
//   const linesRef = useRef([]);
//   const selectedLineRef = useRef(null);

//   useEffect(() => {
//     if (!map || !from || !to || !mapboxToken) return;

//     const waypoints = [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)];

//     const routingControl = L.Routing.control({
//       waypoints,
//       routeWhileDragging: false,
//       showAlternatives: true,
//       addWaypoints: false,
//       createMarker: () => null,
//       router: L.Routing.mapbox(mapboxToken, { profile: 'mapbox/driving' }),
//     }).addTo(map);

//     controlRef.current = routingControl;

//     routingControl.on('routesfound', e => {
//       e.routes.forEach((route, index) => {
//         const intersects = route.coordinates.some(c => isPointInsideAnyPolygon(c.lat, c.lng));

//         const line = L.Routing.line(route, {
//           styles: [{ color: intersects ? 'red' : '#888', weight: 4, dashArray: '5, 10' }],
//           addWaypoints: false,
//         }).addTo(map);

//         linesRef.current.push(line);

//         // Auto-select first route
//         if (index === 0) {
//           onSelectRoute(route);
//         }

//         line.on('click', async () => {
//           if (selectedLineRef.current) map.removeLayer(selectedLineRef.current);
//           selectedLineRef.current = L.Routing.line(route, {
//             styles: [{ color: intersects ? 'red' : '#0077ff', weight: 6 }],
//             addWaypoints: false,
//           }).addTo(map);

//           onRouteInfo({
//             duration: Math.round(route.summary.totalTime / 60),
//             distance: (route.summary.totalDistance / 1000).toFixed(2),
//             intersects,
//           });

//           if (intersects) {
//             await playBeep();
//             alert("⚠️ This route enters a red zone!");
//           }

//           onSelectRoute(route);
//         });
//       });
//     });

//     return () => {
//       if (controlRef.current) map.removeControl(controlRef.current);
//       linesRef.current.forEach(line => map.removeLayer(line));
//       if (selectedLineRef.current) map.removeLayer(selectedLineRef.current);
//     };
//   }, [map, from, to, onRouteInfo, onSelectRoute, mapboxToken]);

//   return null;
// };

// export default Routing;
