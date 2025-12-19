const mongoose = require('mongoose');


// Sub-schema for Assembly Lines
const assemblyLineSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  uomId: {
    type: mongoose.Schema.Types.ObjectId,
  },

});

const assemblySchema = new mongoose.Schema({

    asNumber: {
    type: String,
    required: true,
    unique: true,
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Product", required: true, 
    },
    startDate:{
        type: Date,
    },
    endDate:{
        type: Date,
    },
    laborHours:{
        type: mongoose.Schema.Types.Decimal128,
    },
    status:{
        type:String,
        enum: ['Planned', 'In Progress', 'Finished'],
        required:true,
    },
    lines: [assemblyLineSchema],
    assetId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Asset",
    },
    hours:{
        type: mongoose.Schema.Types.Decimal128,
    }



},{
  timestamps: true, // adds createdAt and updatedAt
})

assemblySchema.index({ productId: 1 }, { unique: true });

const Assembly = mongoose.model('Assembly', assemblySchema)

module.exports= Assembly;