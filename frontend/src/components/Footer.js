import React from 'react';


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title"> Attendance Tracker</h3>
            <p className="footer-description">
              Professional employee attendance management system for modern HR departments.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/attendance-form">Mark Attendance</a></li>
              <li><a href="/dashboard">View Dashboard</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Features</h4>
            <ul className="footer-links">
              <li>Real-time Tracking</li>
              <li>Search & Filter</li>
              
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Contact</h4>
            <div className="footer-contact">
              <p> milo@gmail.com</p>
              <p>  (+266)59467425</p>
              <p> Mafeteng, Maseru LESOTHO</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Employee Attendance Tracker. All rights reserved.</p>
          </div>
          <div className="footer-tech">
            <span>Developed by Mr. MOKHETSENGOANE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;