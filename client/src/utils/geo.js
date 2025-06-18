import * as turf from '@turf/turf';

export function isPointNearRedZone(lat, lng, redZones) {
  const pt = turf.point([lng, lat]);
  return redZones.some(zone => {
    const coords = zone.coordinates.map(([lat, lng]) => [lng, lat]);
    const poly = turf.polygon([[...coords, coords[0]]]);
    const dist = turf.pointToPolygonDistance(pt, poly, { units: 'kilometers' });
    return dist < 0.05; // within 50 meters
  });
}
