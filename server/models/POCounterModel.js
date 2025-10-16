const mongoose = require('mongoose');

const poCounterSchema = new mongoose.Schema({
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

const POCounter = mongoose.model('POCounter', poCounterSchema);

module.exports = POCounter;