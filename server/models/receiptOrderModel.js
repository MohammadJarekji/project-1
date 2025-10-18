const mongoose = require('mongoose');

const receiptOrderSchema = new mongoose.Schema({

    recNumber: {
    type: String,
    required: true,
    unique: true,
    },
    customerId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Customer", required: true,
    },
    amount:{
        type: mongoose.Schema.Types.Decimal128,
        required:true,
    },
    currencyId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Currency",
        required:true, 
    },
    remark:{
        type: String,
    }

},{
  timestamps: true, // adds createdAt and updatedAt
})

const ReceiptOrder = mongoose.model('ReceiptOrder', receiptOrderSchema)

module.exports= ReceiptOrder;