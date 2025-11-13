const mongoose = require('mongoose');

const paymentOrderSchema = new mongoose.Schema({

    payNumber: {
    type: String,
    required: true,
    unique: true,
    },
    vendorId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Vendor", required: true,
    },
    amount:{
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    currencyId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Currency",
        required: true,
    },
    date:{
        type:Date,
    },
    remark:{
        type: String,
    }

},{
  timestamps: true, // adds createdAt and updatedAt
})

const PaymentOrder = mongoose.model('PaymentOrder', paymentOrderSchema)

module.exports= PaymentOrder;