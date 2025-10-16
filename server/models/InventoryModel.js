const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({

    productId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Product", required: true, 
    },
    adjustmentType:{
        type:String,
        enum: ['Gain', 'Loss'],
        required:true,
    },
    quantity:{
        type: mongoose.Schema.Types.Decimal128,
        required:true,
    },
    uomId:{
        type:mongoose.Schema.Types.ObjectId, ref:"UOM", 
    },
    remark:{
        type: String,
    }

},{
  timestamps: true, // adds createdAt and updatedAt
})

const Inventory = mongoose.model('Inventory', inventorySchema)

module.exports= Inventory;