import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

// Hardcode the URL to force port 5000
const API_BASE_URL = 'http://localhost:5000/api';

const AttendanceDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async (search = '', date = '') => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (date) params.date = date;
      
      console.log('🔍 Fetching from:', `${API_BASE_URL}/attendance`);
      const response = await axios.get(`${API_BASE_URL}/attendance`, { 
        params,
        timeout: 10000
      });
      
      setAttendance(response.data);
      console.log('✅ Data loaded:', response.data.length, 'records');
    } catch (error) {
      console.error('❌ Error:', error);
      setError(`Cannot connect to server at ${API_BASE_URL}. Please make sure the backend is running on port 5000.`);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchAttendance(value, dateFilter);
  };

  const handleDateFilter = (e) => {
    const value = e.target.value;
    setDateFilter(value);
    fetchAttendance(searchTerm, value);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await axios.delete(`${API_BASE_URL}/attendance/${id}`);
        fetchAttendance(searchTerm, dateFilter);
        alert('Record deleted successfully!');
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Error deleting record. Please check backend connection.');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    fetchAttendance();
  };

  const retryConnection = () => {
    fetchAttendance();
  };

  return (
    <div className="app">
      <Navbar />
      <div className="main-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2 className="dashboard-title">Attendance Dashboard</h2>
            <div className="controls">
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <input
                type="date"
                value={dateFilter}
                onChange={handleDateFilter}
                className="date-filter"
              />
              {(searchTerm || dateFilter) && (
                <button onClick={clearFilters} className="cta-button">
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="error-state">
              <h3>❌ Connection Error</h3>
              <p>{error}</p>
              <div className="troubleshooting">
                <p><strong>Quick check:</strong></p>
                <ol>
                  <li>Is backend running? Check terminal for "🚀 Server running on port 5000"</li>
                  <li>Test manually: <a href="http://localhost:5000/health" target="_blank" rel="noopener noreferrer">http://localhost:5000/health</a></li>
                  <li>Backend should show: ✅ PostgreSQL connected successfully!</li>
                </ol>
              </div>
              <button onClick={retryConnection} className="cta-button">
                Retry Connection
              </button>
            </div>
          )}

          {loading && !error && (
            <div className="loading">Loading attendance data...</div>
          )}

          {!loading && !error && attendance.length === 0 && (
            <div className="empty-state">
              <h3>No attendance records found</h3>
              <p>Start by marking some attendance records in the "Mark Attendance" page.</p>
            </div>
          )}

          {!loading && !error && attendance.length > 0 && (
            <div className="table-container">
              <div className="stats-bar">
                <span className="stat-item">
                  <strong>Total Records:</strong> {attendance.length}
                </span>
                <span className="stat-item">
                  <strong>Present:</strong> {attendance.filter(a => a.status === 'Present').length}
                </span>
                <span className="stat-item">
                  <strong>Absent:</strong> {attendance.filter(a => a.status === 'Absent').length}
                </span>
              </div>
              
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Employee ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td>{record.employeename}</td>
                      <td>{record.employeeid}</td>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-${record.status.toLowerCase()}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AttendanceDashboard;