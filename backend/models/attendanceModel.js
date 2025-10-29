const { pool } = require('../db');

const attendanceModel = {
  // Add attendance record
  addAttendance: async (employeeName, employeeID, date, status) => {
    try {
      const query = `
        INSERT INTO Attendance (employeeName, employeeID, date, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const values = [employeeName, employeeID, date, status];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get all attendance records
  getAllAttendance: async () => {
    try {
      const query = `
        SELECT * FROM Attendance 
        ORDER BY date DESC, created_at DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Get attendance by date range
  getAttendanceByDate: async (startDate, endDate) => {
    try {
      const query = `
        SELECT * FROM Attendance 
        WHERE date BETWEEN $1 AND $2 
        ORDER BY date DESC, created_at DESC
      `;
      const result = await pool.query(query, [startDate, endDate]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Search attendance by name or ID
  searchAttendance: async (searchTerm) => {
    try {
      const query = `
        SELECT * FROM Attendance 
        WHERE employeeName ILIKE $1 OR employeeID ILIKE $1
        ORDER BY date DESC, created_at DESC
      `;
      const result = await pool.query(query, [`%${searchTerm}%`]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Delete attendance record
  deleteAttendance: async (id) => {
    try {
      const query = 'DELETE FROM Attendance WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = attendanceModel;