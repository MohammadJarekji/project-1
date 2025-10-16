const mongoose = require('mongoose');

const soCounterSchema = new mongoose.Schema({
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

const SOCounter = mongoose.model('SOCounter', soCounterSchema);

module.exports = SOCounter;