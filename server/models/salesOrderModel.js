const mongoose = require('mongoose');

const salesOrderSchema = new mongoose.Schema({

    soNumber: {
    type: String,
    required: true,
    unique: true,
    },
    customerId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Customer", required: true,
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
    deliveryDate:{
        type: Date,
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

const SalesOrder = mongoose.model('SalesOrder', salesOrderSchema)

module.exports= SalesOrder;