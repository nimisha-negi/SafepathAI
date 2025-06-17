// import * as turf from '@turf/turf';

// export const redZonePolygons = [
//   {
//     name: 'Ajmeri Gate Area',
//     coordinates: [
//       [28.6532, 77.2188],
//       [28.6536, 77.2199],
//       [28.6523, 77.2205],
//       [28.6520, 77.2190],
//     ],
//   },
//   {
//     name: 'Nangloi Block C',
//     coordinates: [
//       [28.6790, 77.0600],
//       [28.6802, 77.0612],
//       [28.6785, 77.0621],
//       [28.6777, 77.0605],
//     ],
//   },
// ];

// export const isPointInsideAnyPolygon = (lat, lng) => {
//   const pt = turf.point([lng, lat]);
//   return redZonePolygons.some(zone => {
//     const coords = [...zone.coordinates, zone.coordinates[0]];
//     const poly = turf.polygon([[...coords.map(([lat, lng]) => [lng, lat])]]);
//     return turf.booleanPointInPolygon(pt, poly);
//   });
// };

// export const playBeep = async () => {
//   const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
//   await audio.play();
// };
