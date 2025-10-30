import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    totalRecords: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchAttendanceStats();
  }, []);

  const fetchAttendanceStats = async () => {
    try {
      console.log('📊 Fetching attendance data from:', `${API_BASE_URL}/attendance`);
      
      const response = await axios.get(`${API_BASE_URL}/attendance`, {
        timeout: 10000
      });
      
      const attendanceData = response.data;
      console.log('📈 Raw attendance data:', attendanceData);
      
      // Get today's date in multiple formats to handle different date formats
      const today = new Date();
      const todayISO = today.toISOString().split('T')[0]; // YYYY-MM-DD
      const todayLocal = today.toLocaleDateString('en-CA'); // YYYY-MM-DD
      
      console.log('📅 Today dates:', { todayISO, todayLocal });
      
      // Calculate unique employees
      const uniqueEmployees = [...new Set(attendanceData.map(record => record.employeeid))];
      
      // Calculate today's attendance - try multiple date formats
      const todayRecords = attendanceData.filter(record => {
        const recordDate = new Date(record.date);
        const recordDateISO = recordDate.toISOString().split('T')[0];
        const recordDateLocal = recordDate.toLocaleDateString('en-CA');
        
        return recordDateISO === todayISO || 
               recordDateLocal === todayLocal ||
               record.date === todayISO ||
               record.date === todayLocal;
      });
      
      console.log('👥 Today records:', todayRecords);
      
      const presentToday = todayRecords.filter(record => record.status === 'Present').length;
      const absentToday = todayRecords.filter(record => record.status === 'Absent').length;

      console.log('📊 Calculated stats:', {
        totalEmployees: uniqueEmployees.length,
        presentToday,
        absentToday,
        totalRecords: attendanceData.length
      });

      setStats({
        totalEmployees: uniqueEmployees.length,
        presentToday: presentToday,
        absentToday: absentToday,
        totalRecords: attendanceData.length,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      setStats(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to load statistics' 
      }));
    }
  };

  const refreshStats = () => {
    setStats(prev => ({ ...prev, loading: true, error: null }));
    fetchAttendanceStats();
  };

  return (
    <div className="app">
      <Navbar />
      <div className="main-content">
        <div className="landing-container">
          <marquee><h1 className="landing-title">Employee Attendance Tracker</h1></marquee>

          <p className="landing-subtitle">
            Streamline your HR processes with our professional attendance management system. 
            Track employee attendance, generate reports, and manage records efficiently.
          </p>

          {/* Debug Info - Remove in production */}
          <div style={{ 
            background: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            <strong>Debug Info:</strong> Backend URL: {API_BASE_URL}
            {stats.error && <div style={{color: 'red'}}>Error: {stats.error}</div>}
            <button 
              onClick={refreshStats}
              style={{ 
                marginLeft: '1rem', 
                padding: '0.25rem 0.5rem',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh Stats
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-content">
                <h3 className="stat-number">{stats.loading ? '...' : stats.totalEmployees}</h3>
                <p className="stat-label">Total Employees</p>
                <p className="stat-description">Registered in system</p>
              </div>
            </div>
            
            <div className="stat-card present-card">
              <div className="stat-content">
                <h3 className="stat-number">{stats.loading ? '...' : stats.presentToday}</h3>
                <p className="stat-label">Present Today</p>
                <p className="stat-description">Currently at work</p>
              </div>
            </div>
            
            <div className="stat-card absent-card">
              <div className="stat-content">
                <h3 className="stat-number">{stats.loading ? '...' : stats.absentToday}</h3>
                <p className="stat-label">Absent Today</p>
                <p className="stat-description">Not present today</p>
              </div>
            </div>
            
            <div className="stat-card records-card">
              <div className="stat-content">
                <h3 className="stat-number">{stats.loading ? '...' : stats.totalRecords}</h3>
                <p className="stat-label">Total Records</p>
                <p className="stat-description">All attendance entries</p>
              </div>
            </div>
          </div>

          <button 
            className="cta-button"
            onClick={() => navigate('/attendance-form')}
          >
            Get Started
          </button>
          
          <div className="features-grid">
            <div className="feature-card">
              <h3>Easy Marking</h3>
              <p>Quick and simple attendance marking with intuitive forms</p>
            </div>
            <div className="feature-card">
              <h3>Live Dashboard</h3>
              <p>Real-time attendance data with search and filter capabilities</p>
            </div>
            <div className="feature-card">
              <h3>Smart Search</h3>
              <p>Find records quickly by name, ID, or date</p>
            </div>
            <div className="feature-card">
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