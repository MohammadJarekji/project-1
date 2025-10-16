const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({

    productId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Product", required: true, 
    },
    quantity:{
        type: mongoose.Schema.Types.Decimal128,
        required:true,
    },
    uomId:{
        type:mongoose.Schema.Types.ObjectId, ref:"UOM", 
    },
    fromWareHouseId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Warehouse",
        required:true,
    },
    toWareHouseId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Warehouse",
        required:true,
    },


},{
  timestamps: true, // adds createdAt and updatedAt
})

const Transfer = mongoose.model('Transfer', transferSchema)

module.exports= Transfer;