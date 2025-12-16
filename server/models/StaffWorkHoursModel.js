const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Staff Schema
const staffSchema = new Schema({
  name: { type: String, required: true },
  hours: { type: Number, required: true },
});

// Define the main Schema with Today Date and an array of staff objects
const workHoursSchema = new Schema({
  TodayDate: { type: Date, required: true }, // Store the current date
  staffHours: [staffSchema], // Array of staff objects
});

// Create the Model based on the Schema
const WorkHours = mongoose.model('WorkHours', workHoursSchema);

module.exports = WorkHours;