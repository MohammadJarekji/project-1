const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({

    serialNumber: {
      type: String,
     
    },

      name: {
      type: String,
      required: true,
    },

    assetType: {
      type: String,
      required: true,
      trim: true,
    },

    acquisitionCost: {
      type: mongoose.Schema.Types.Decimal128,
      min: 0,
      default: 0,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor', // (2) Assuming you have a Vendor model
    },

    location: {
      type: String,
      trim: true,
    },

    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff', // (11) Assuming a User/Staff model
    },

    depreciationMethod: {
      type: String,
    },

    warrantyExpiry: {
      type: Date,
    },

    maintenanceDate: {
      type: Date,
    },

    maintenanceHour: {
      type: Number,
      min: 0,
    },

    insurance: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ['Active', 'Scrapped', 'Sold'],
      default: 'Active',
    },

    attachment: {
      type: String, // Store file path or URL
    },

    remark: {
      type: String,
      trim: true,
    },

},{
    timestamps: true,
  })

const Asset = mongoose.model('Asset', assetSchema)

module.exports= Asset;