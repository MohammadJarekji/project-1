const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({

    poNumber: {
    type: String,
    required: true,
    unique: true,
    },
    vendorId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Vendor", required: true, 
    },
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
    price:{
        type: mongoose.Schema.Types.Decimal128,
        required:true,
    },
    currencyId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Currency",
    },
    paymentId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Payment",
    },
    remark:{
        type: String,
    }

},{
  timestamps: true, // adds createdAt and updatedAt
})

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema)

module.exports= PurchaseOrder;