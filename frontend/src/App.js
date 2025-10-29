import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AttendanceForm from './components/AttendanceForm';
import AttendanceDashboard from './components/AttendanceDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/attendance-form" element={<AttendanceForm />} />
          <Route path="/dashboard" element={<AttendanceDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;