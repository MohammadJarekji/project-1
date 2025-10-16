const mongoose = require('mongoose');


// Sub-schema for asset
const assetSchema = new mongoose.Schema({

  assetId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Asset",
        required:true,
    },
    quantity:{
        type: mongoose.Schema.Types.Decimal128,
        required:true,
    }
});


const dieselSchema = new mongoose.Schema({

    productId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Project", required: true, 
    },
    uomId:{
        type:mongoose.Schema.Types.ObjectId, ref:"UOM",
    },
    machineCounter:{
      type: mongoose.Schema.Types.Decimal128,
    },
    averageCost:{
      type: mongoose.Schema.Types.Decimal128,
    },
    asset: [assetSchema],
    
},{
  timestamps: true, // adds createdAt and updatedAt
})

const Diesel = mongoose.model('Diesel', dieselSchema)

module.exports= Diesel;