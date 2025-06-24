# 🚨 SafePathAI

**SafePathAI** is a safety-first smart navigation tool designed to alert users of danger zones along their route. The application fetches red zone data (e.g., from Delhi Police datasets) and notifies users visually and audibly when they approach these areas.


## 📌 Features

- 🔴 **Red Zone Alerts**: Detects and highlights danger zones on a route.
- 🧭 **Live Location Tracking**: Shows your current location dynamically.
- 🚨 **Proximity Warning System**: Alerts users with a beep and on-screen message 50 meters before entering a danger zone.
- 🗺️ **Simple Route Display**: Allows users to enter 'From' and 'To' points to view a route.
- ⚠️ **Map-Based Visuals**: Danger zones are visually marked for better awareness.



## 🧠 Tech Stack

### 🌐 Frontend
- React.js
- React Router
- CSS Modules
- Lottie Animations
- Leaflet.js or custom map rendering
- Geolocation API

### 🛠 Backend
- Node.js
- Express.js
- MongoDB (for storing red zone data, routes, etc.)

### 📡 Data Sources
- Delhi Police Red Zone Dataset
- Static datasets from SafePath AI


## 🧪 Installation & Setup

1. Clone the Repository

```bash
git clone https://github.com/nimisha-negi/SafePathAI.git
cd SafePathAI
```
2. Setup Frontend

```bash
cd client
npm install
npm start
```
3. Setup Backend

```bash
cd server
npm install
npm run dev
```
## 🔍 How It Works
- User lands on the homepage with intro animation
- Clicks “Launch App” to go to the map interface
- Inputs To and From locations
  ### Map displays:
- The route (static line, not dynamically optimized)
- Red Zones as shaded areas or markers
- Live user location using GPS
  ### On approaching a red zone:
- A beep sound is triggered
- An on-screen alert is shown 50m before the zone

## 📁 Project Structure
```bash
SafePathAI/
├── client/              # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/      # Icons, animations, images
│   │   ├── components/  # React components
│   │   ├── utils/       # Utility functions
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   ├── package.json
│   └── README.md
├── server/              # Node.js + Express Backend
│   ├── Server.js        # Main entry point
│   └── package.json
```
## 🤝 Contributing
Contributions are welcome.
```bash
git checkout -b feature/your-feature-name
git commit -m "Add your feature"
git push origin feature/your-feature-name
```
