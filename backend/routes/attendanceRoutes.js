const express = require('express');
const router = express.Router();
const attendanceModel = require('../models/attendanceModel');

// POST /api/attendance - Add new attendance record
router.post('/attendance', async (req, res) => {
  try {
    const { employeeName, employeeID, date, status } = req.body;
    
    if (!employeeName || !employeeID || !date || !status) {
      return res.status(400).json({ 
        error: 'All fields are required: employeeName, employeeID, date, status' 
      });
    }

    const newRecord = await attendanceModel.addAttendance(
      employeeName, 
      employeeID, 
      date, 
      status
    );
    
    res.status(201).json({
      message: 'Attendance recorded successfully',
      record: newRecord
    });
  } catch (error) {
    console.error('Error adding attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/attendance - Get all attendance records
router.get('/attendance', async (req, res) => {
  try {
    const { date, search } = req.query;
    
    let records;
    if (date) {
      // Get records for specific date
      records = await attendanceModel.getAttendanceByDate(date, date);
    } else if (search) {
      // Search records by name or ID
      records = await attendanceModel.searchAttendance(search);
    } else {
      // Get all records
      records = await attendanceModel.getAllAttendance();
    }
    
    res.json(records);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/attendance/:id - Delete attendance record
router.delete('/attendance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await attendanceModel.deleteAttendance(id);
    
    if (!deletedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({
      message: 'Attendance record deleted successfully',
      record: deletedRecord
    });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;