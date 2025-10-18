const mongoose = require('mongoose');

const recCounterSchema = new mongoose.Schema({
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

const RECCounter = mongoose.model('RECCounter', recCounterSchema);

module.exports = RECCounter;