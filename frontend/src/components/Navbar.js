import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
           Attendance Tracker
        </Link>
        
        {/* Show navigation links only on non-landing pages */}
        {!isLandingPage && (
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className="nav-link"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/attendance-form" 
                className={`nav-link ${location.pathname === '/attendance-form' ? 'active' : ''}`}
              >
                Mark Attendance
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                View Dashboard
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;