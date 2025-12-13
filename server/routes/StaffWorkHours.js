const express = require('express');
const { addStaffHours, getWorkHours, updateStaffHours, deleteStaff } = require('../controllers/StaffWorkHours');
const router = express.Router();

// Define the route to get work hours for a specific date
router.post('/add', addStaffHours);
router.get('/', getWorkHours);
router.put('/workhours', updateStaffHours);
router.delete('/workhours', deleteStaff);

module.exports = router;