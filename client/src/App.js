import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
import LandingPage from '../src/components/LandingPage';
import MapView from '../src/components/MapView';
// import SafeRouteMap from '../src/components/SafeRouteMap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<MapView />} />
        {/* <Route path="/" element={<SafeRouteMap />} /> */}

      </Routes>
    </Router>
  );
}

export default App;