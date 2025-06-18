import L from 'leaflet';

export const liveLocationIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

export const carIcon = L.icon({
  iconUrl: process.env.PUBLIC_URL + '/car.jpg',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});
