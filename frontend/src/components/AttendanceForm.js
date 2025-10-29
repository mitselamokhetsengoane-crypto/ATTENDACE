import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

// Hardcode the URL to force port 5000
const API_BASE_URL = 'http://localhost:5000/api';

const AttendanceForm = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    status: 'Present'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const today = new Date().toISOString().split('T')[0];
      const submissionData = {
        ...formData,
        date: today
      };

      console.log('📤 Submitting to:', `${API_BASE_URL}/attendance`);
      await axios.post(`${API_BASE_URL}/attendance`, submissionData, {
        timeout: 10000
      });
      
      alert('✅ Attendance submitted successfully!');
      setFormData({
        employeeName: '',
        employeeID: '',
        status: 'Present'
      });
    } catch (error) {
      console.error('❌ Error:', error);
      setError(`Failed to connect to backend. Please ensure the server is running on port 5000.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar />
      <div className="main-content">
        <div className="form-container">
          <h2 className="form-title">Mark Employee Attendance</h2>
          
          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
              <p><strong>Backend URL:</strong> {API_BASE_URL}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Employee Name</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter employee name"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Employee ID</label>
              <input
                type="text"
                name="employeeID"
                value={formData.employeeID}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter employee ID"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Attendance Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AttendanceForm;