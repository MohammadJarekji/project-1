const WorkHours = require('../models/StaffWorkHoursModel');
const Staff = require('../models/staffModel');
const dayjs = require('dayjs');

/**
 * ADD STAFF HOURS (Frontend sends: { name, hours })
 */
const addStaffHours = async (req, res) => {
  try {
    const { name, hours, date } = req.body; // Extract name, hours, and date

    if (!name || hours === undefined || !date) {
      return res.status(400).json({ message: 'Name, hours, and date are required' });
    }

    const currentDate = dayjs(date).startOf('day'); // Normalize the date

    // Find existing work hours for the selected date
    let workHours = await WorkHours.findOne({
      date: currentDate.toDate(),
    });

    // If no work hours exist for that date, create a new entry
    if (!workHours) {
      workHours = new WorkHours({
        date: currentDate.toDate(),
        staffHours: [{ name, hours: Number(hours) }],
      });
    } else {
      // If work hours exist, check if the staff member already exists
      const staffIndex = workHours.staffHours.findIndex(
        (staff) => staff.name === name
      );

      if (staffIndex === -1) {
        // Add new staff if not found
        workHours.staffHours.push({ name, hours: Number(hours) });
      } else {
        // Update existing staff's hours
        workHours.staffHours[staffIndex].hours = Number(hours);
      }
    }

    // Save the updated work hours
    await workHours.save();

    res.status(200).json({
      message: 'Staff hours added successfully',
      workHours,
    });
  } catch (error) {
    console.error('Error adding staff hours:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET WORK HOURS (for today or specific date)
 */
const getWorkHours = async (req, res) => {
  try {
    const { date } = req.query; // Date passed in query (optional)

    // Use provided date, or default to today's date if none is given
    const currentDate = date
      ? dayjs(date).startOf('day')
      : dayjs().startOf('day');

    // Find work hours for the selected date
    const workHours = await WorkHours.findOne({
      date: currentDate.toDate(),
    });

    // Fetch all staff data (to display in a dropdown or for other purposes)
    const staff = await Staff.find(); 

    // If no work hours are found for the selected date
    if (!workHours) {
      return res.status(200).json({
        message: 'No work hours found for the selected date',
        workHours: { staffHours: [] }, // Return empty staffHours if none found
        staff, // Return staff list
      });
    }

    // If work hours exist, return the data along with staff
    res.status(200).json({
      message: 'Work hours retrieved successfully',
      workHours, // Contains the staff hours for that date
      staff, // Contains the list of all staff
    });
  } catch (error) {
    console.error('Error fetching work hours:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * UPDATE STAFF HOURS
 */
const updateStaffHours = async (req, res) => {
  try {
    const { date, staffName, newStaffName, newHours } = req.body;

    const currentDate = date ? dayjs(date).startOf('day') : dayjs().startOf('day');

    if (!staffName || !newStaffName || newHours === undefined) {
      return res.status(400).json({ message: 'All fields except date are required' });
    }

    const workHours = await WorkHours.findOne({
      TodayDate: currentDate.toDate(),
    });

    if (!workHours) {
      return res.status(404).json({ message: 'No work hours found for this date' });
    }

    // Check if the new staff name already exists in today's records
    const isNameDuplicate = workHours.staffHours.some(
      (staff) => staff.name === newStaffName && staff.name !== staffName
    );

    if (isNameDuplicate) {
      return res.status(400).json({
        message: 'This staff name already exists today, please choose another name.',
      });
    }

    const staffIndex = workHours.staffHours.findIndex(
      (staff) => staff.name === staffName
    );

    if (staffIndex === -1) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    workHours.staffHours[staffIndex].name = newStaffName;
    workHours.staffHours[staffIndex].hours = Number(newHours);

    await workHours.save();

    res.status(200).json({
      message: 'Staff hours updated successfully',
      workHours,
    });
  } catch (error) {
    console.error('Error updating staff hours:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * DELETE STAFF
 */
const deleteStaff = async (req, res) => {
  try {
    const { date, staffName } = req.body;

    if (!date || !staffName) {
      return res.status(400).json({ message: 'Date and staff name are required' });
    }

    const workHours = await WorkHours.findOne({
      TodayDate: dayjs(date).startOf('day').toDate(),
    });

    if (!workHours) {
      return res.status(404).json({ message: 'No work hours found' });
    }

    workHours.staffHours = workHours.staffHours.filter(
      (staff) => staff.name !== staffName
    );

    await workHours.save();

    res.status(200).json({
      message: 'Staff deleted successfully',
      workHours,
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addStaffHours,
  getWorkHours,
  updateStaffHours,
  deleteStaff,
};