const WorkHours = require('../models/StaffWorkHoursModel');
const Staff = require('../models/staffModel');
const dayjs = require('dayjs');

/**
 * ADD STAFF HOURS (Frontend sends: { name, hours })
 */
const addStaffHours = async (req, res) => {
  try {
    const { name, hours } = req.body;

    if (!name || hours === undefined) {
      return res.status(400).json({ message: 'Name and hours are required' });
    }

    const currentDate = dayjs().startOf('day');

    let workHours = await WorkHours.findOne({
      TodayDate: currentDate.toDate(),
    });

    if (!workHours) {
      workHours = new WorkHours({
        TodayDate: currentDate.toDate(),
        staffHours: [{ name, hours: Number(hours) }],
      });
    } else {
      const staffIndex = workHours.staffHours.findIndex(
        (staff) => staff.name === name
      );

      if (staffIndex === -1) {
        workHours.staffHours.push({ name, hours: Number(hours) });
      } else {
        workHours.staffHours[staffIndex].hours = Number(hours);
      }
    }

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
   console.log('staff: hello');
  try {
    const { date } = req.query;

    const currentDate = date
      ? dayjs(date).startOf('day')
      : dayjs().startOf('day');

    const workHours = await WorkHours.findOne({
      TodayDate: currentDate.toDate(),
    });

    const staff = await Staff.find();
   

    if (!workHours) {
      return res.status(200).json({
        message: 'No work hours found',
        workHours: { staffHours: [] },
        staff,
      });
    }

    res.status(200).json({
      message: 'Work hours retrieved successfully',
      workHours,
      staff,
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