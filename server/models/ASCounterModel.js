const mongoose = require('mongoose');

const asCounterSchema = new mongoose.Schema({
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

const ASCounter = mongoose.model('ASCounter', asCounterSchema);

module.exports = ASCounter;