const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

console.log("✅ WebSocket server running on ws://localhost:8080");

wss.on('connection', function connection(ws) {
  console.log('🔌 Client connected');

  const redZones = [
    {
      name: 'Ajmeri Gate Area',
      coordinates: [
        [28.6532, 77.2188],
        [28.6536, 77.2199],
        [28.6523, 77.2205],
        [28.6520, 77.2190]
      ]
    },
    {
      name: 'Nangloi Block C',
      coordinates: [
        [28.6790, 77.0600],
        [28.6802, 77.0612],
        [28.6785, 77.0621],
        [28.6777, 77.0605]
      ]
    }
  ];

  // Send data on connection
  ws.send(JSON.stringify(redZones));

  ws.on('close', () => console.log('❌ Client disconnected'));
});
