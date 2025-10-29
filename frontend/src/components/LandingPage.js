import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Use the same Navbar component
import Footer from './Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="app">
      <Navbar /> {/* This will automatically show simplified version on landing page */}
      <div className="main-content">
        <div className="landing-container">
          <marquee> <h1 className="landing-title">Employee Attendance Tracker</h1></marquee>

          <p className="landing-subtitle">
            Streamline your HR processes with our professional attendance management system. 
            Track employee attendance, generate reports, and manage records efficiently.
          </p>
          <button 
            className="cta-button"
            onClick={() => navigate('/attendance-form')}
          >
            Get Started
          </button>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Easy Marking</h3>
              <p>Quick and simple attendance marking with intuitive forms</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Live Dashboard</h3>
              <p>Real-time attendance data with search and filter capabilities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Smart Search</h3>
              <p>Find records quickly by name, ID, or date</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Secure & Reliable</h3>
              <p>Your data is safe with our secure PostgreSQL database</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;