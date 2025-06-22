import React from 'react';
import '../assets/LandingPage.css';
import { Player } from '@lottiefiles/react-lottie-player';

// Lottie JSON animations (import your actual .json files)
import searchAnim from '../assets/search.json';
import routeAnim from '../assets/route.json';
import dangerAnim from '../assets/danger.json';
import doneAnim from '../assets/destination.json';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <img src="/logo.png" alt="logo" className="logo" />
        <h2 className="brand-name">SafePath AI</h2>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/landing.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="overlay">
          <h1>SafePath AI</h1>
          <p>Navigate Smart. Travel Safe.</p>
          <div className="buttons">
            <a href="/map" className="btn primary">Launch App</a>
            <a href="#demo" className="btn secondary">Watch Full Demo</a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="feature-highlight">
        <h2>About Us</h2>
        <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: '#ccc' }}>
SafePath AI is an intelligent navigation platform built to enhance road safety and travel confidence. Whether you're commuting daily or exploring new areas, our system dynamically analyzes real-time data to detect and avoid high-risk zones. Using advanced geolocation, AI-driven routing, and real-time alerts, SafePath ensures you take the safest possible path to your destination. With live tracking and proactive notifications, we aim to reduce accidental exposure to danger-prone areas—making every journey smarter, safer, and stress-free.        </p>
        {/* <div className="features" style={{ marginTop: '2rem' }}>
          <Feature
            icon="🧭"
            title="Smart Safe Routing"
            desc="Avoid red zones in real-time using AI-powered route planning."
          />
          <Feature
            icon="🚨"
            title="Red Zone Alerts"
            desc="Get instant notifications with sound when near a red zone."
          />
          <Feature
            icon="📍"
            title="Live GPS Tracking"
            desc="Track your journey in real-time with precision and alerts."
          />
        </div> */}
      </section>

      {/* Walkthrough Section */}
      <section className="walkthrough-section">
        <h2>How It Works</h2>
        <div className="walkthrough-steps">
          <WalkthroughStep animation={searchAnim} title="Search Location" />
          <WalkthroughStep animation={routeAnim} title="Choose Route" />
          <WalkthroughStep animation={dangerAnim} title="Avoid Danger" />
          <WalkthroughStep animation={doneAnim} title="Arrive Safe" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 SafePath AI. All rights reserved.</p>
          <p>Made with 🚘 in Delhi</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="feature">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function WalkthroughStep({ animation, title }) {
  return (
    <div className="walkthrough-step">
      <Player
        autoplay
        loop
        src={animation}
        style={{ height: '150px', marginBottom: '1rem' }}
      />
      <h4>{title}</h4>
    </div>
  );
}
