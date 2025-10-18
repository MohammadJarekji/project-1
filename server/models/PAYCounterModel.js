const mongoose = require('mongoose');

const payCounterSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true,
  },
  lastSerial: {
    type: Number,
    required: true,
    default: 0,
  },
});

const PAYCounter = mongoose.model('PAYCounter', payCounterSchema);

module.exports = PAYCounter;