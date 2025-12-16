const WorkHours = require('../models/StaffWorkHoursModel');


const dayjs = require('dayjs'); // Ensure you have dayjs for date manipulation

// Controller function to add staff hours
const addStaffHours = async (req, res) => {
  try {
    // Get the staff data from the request body
    const { staffData } = req.body;  // Expecting staffData as an array

    // Check if staff data is provided
    if (!staffData || !Array.isArray(staffData) || staffData.length === 0) {
      return res.status(400).json({ message: 'Staff data (name, hours) is required' });
    }

    // Validate that each staff entry contains a valid name and hours
    const invalidStaffData = staffData.filter(staff =>
      !staff.name || !staff.hours || isNaN(Number(staff.hours))  // Ensure hours is a valid number
    );

    if (invalidStaffData.length > 0) {
      return res.status(400).json({ message: 'Each staff entry must have a valid name and hours' });
    }

    // Coerce hours to a number (in case it was passed as a string)
    staffData.forEach(staff => {
      staff.hours = Number(staff.hours); // Ensure hours are stored as a number
    });

    // Get today's date (start of the day)
    const currentDate = dayjs().startOf('day'); // Normalize to midnight

    let workHours = await WorkHours.findOne({ TodayDate: currentDate.toDate() });

    if (!workHours) {
      // If no work hours exist for today, create new data
      workHours = new WorkHours({
        TodayDate: currentDate.toDate(),
        staffHours: staffData,
      });
    } else {
      // Update existing work hours or add new staff data
      staffData.forEach(staff => {
        const existingStaffIndex = workHours.staffHours.findIndex(existingStaff =>
          existingStaff.name === staff.name
        );

        if (existingStaffIndex === -1) {
          workHours.staffHours.push(staff); // Add new staff if not present
        } else {
          workHours.staffHours[existingStaffIndex].hours = staff.hours; // Update hours for existing staff
        }
      });
    }

    await workHours.save();

    return res.status(200).json({
      message: 'Staff hours added successfully',
      workHours: workHours,
    });
  } catch (error) {
    console.error('Error adding staff hours:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to get work hours for a specific date
const getWorkHours = async (req, res) => {
  try {
    // Get the date from the request query (if passed). If no date is provided, use today's date.
    const { date } = req.query;

    // If no date is provided, set it to today's date (backend handles it)
    const currentDate = date ? dayjs(date).startOf('day') : dayjs().startOf('day');

    // Find the work hours for the given date
    const workHours = await WorkHours.findOne({ TodayDate: currentDate.toDate() });

    if (!workHours) {
      return res.status(200).json({
        message: 'No work hours found for this date',
        workHours: [], // Return an empty array if no data is found
      });
    }

    return res.status(200).json({
      message: 'Work hours retrieved successfully',
      workHours: workHours,
    });
  } catch (error) {
    console.error('Error fetching work hours:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to update staff name and hours for a specific date
const updateStaffHours = async (req, res) => {
  try {
    // Get the date, staff name, and updated staff name and hours from the request body
    const { date, staffName, newStaffName, newHours } = req.body;

    // Check if all required fields are provided
    if (!date || !staffName || !newStaffName || newHours === undefined) {
      return res.status(400).json({ message: 'Date, staff name, new staff name, and new hours are required' });
    }

    // Find the record for the specific date
    const workHours = await WorkHours.findOne({ TodayDate: new Date(date) });

    // Check if the work hours record exists for the provided date
    if (!workHours) {
      return res.status(404).json({ message: 'No work hours found for this date' });
    }

    // Find the staff member in the array and update their name and hours
    const staffIndex = workHours.staffHours.findIndex(staff => staff.StaffName === staffName);

    if (staffIndex === -1) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Update the staff member's name and hours
    workHours.staffHours[staffIndex].StaffName = newStaffName;
    workHours.staffHours[staffIndex].Hours = newHours;

    // Save the updated work hours document
    await workHours.save();

    // Return the updated work hours
    return res.status(200).json({
      message: 'Staff hours updated successfully',
      workHours: workHours
    });
  } catch (error) {
    console.error('Error updating staff hours:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to delete a staff member's record for a specific date
const deleteStaff = async (req, res) => {
  try {
    // Get the date and staff name from the request body
    const { date, staffName } = req.body;

    // Check if both date and staffName are provided
    if (!date || !staffName) {
      return res.status(400).json({ message: 'Date and staff name are required' });
    }

    // Find the record for the specific date
    const workHours = await WorkHours.findOne({ TodayDate: new Date(date) });

    // Check if the work hours record exists for the provided date
    if (!workHours) {
      return res.status(404).json({ message: 'No work hours found for this date' });
    }

    // Find the staff member index in the staffHours array
    const staffIndex = workHours.staffHours.findIndex(staff => staff.StaffName === staffName);

    // If staff member is not found, return an error
    if (staffIndex === -1) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Remove the staff member from the staffHours array
    workHours.staffHours.splice(staffIndex, 1);

    // Save the updated work hours document
    await workHours.save();

    // Return the updated work hours
    return res.status(200).json({
      message: 'Staff member deleted successfully',
      workHours: workHours
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { addStaffHours, getWorkHours, updateStaffHours, deleteStaff };