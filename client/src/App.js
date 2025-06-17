import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './pages/Home';
import MapView from '../src/components/MapView';
// import SafeRouteMap from '../src/components/SafeRouteMap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapView />} />
        {/* <Route path="/" element={<SafeRouteMap />} /> */}

      </Routes>
    </Router>
  );
}

export default App;