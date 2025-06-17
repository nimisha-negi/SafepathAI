// import { useEffect, useRef } from 'react';
// import { useMap } from 'react-leaflet';
// import L from 'leaflet';
// import * as turf from '@turf/turf';
// import { redZonePolygons, playBeep } from '../utils/Helpers';

// const icon = L.icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
//   iconSize: [25, 25],
//   iconAnchor: [12, 12],
// });

// const LiveLocationMarker = ({ selectedRoute }) => {
//   const map = useMap();
//   const markerRef = useRef(null);
//   const alerted = useRef(false);
//   const stepIndex = useRef(0);

//   useEffect(() => {
//     const id = navigator.geolocation.watchPosition(async ({ coords }) => {
//       const { latitude, longitude } = coords;
//       const user = L.latLng(latitude, longitude);
//       map.panTo(user, { animate: true });

//       if (!markerRef.current) {
//         markerRef.current = L.marker(user, { icon }).addTo(map);
//       } else {
//         markerRef.current.setLatLng(user);
//       }

//       const userPoint = turf.point([longitude, latitude]);

//       for (const zone of redZonePolygons) {
//         const coords = zone.coordinates.map(([lat, lng]) => [lng, lat]);
//         const polygon = turf.polygon([[...coords, coords[0]]]);
//         const distance = turf.pointToPolygonDistance(userPoint, polygon, { units: 'kilometers' });
//         if (distance < 0.1 && !alerted.current) {
//           alerted.current = true;
//           await playBeep();
//           alert('⚠️ You are near a red zone!');
//           break;
//         }
//       }

//       if (selectedRoute?.instructions) {
//         for (let i = stepIndex.current; i < selectedRoute.instructions.length; i++) {
//           const instr = selectedRoute.instructions[i];
//           if (!instr.latLng) continue;

//           const dist = turf.distance(userPoint, turf.point([instr.latLng.lng, instr.latLng.lat]), { units: 'kilometers' });
//           if (dist < 0.05) {
//             const speak = new SpeechSynthesisUtterance(instr.text);
//             speak.lang = 'en-US';
//             window.speechSynthesis.speak(speak);
//             stepIndex.current = i + 1;
//             break;
//           }
//         }
//       }
//     });

//     return () => navigator.geolocation.clearWatch(id);
//   }, [map, selectedRoute]);

//   return null;
// };

// export default LiveLocationMarker;
