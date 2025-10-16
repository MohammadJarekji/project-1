const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({

    name:{
        type: String,
        required:true,
    },
    address:{
        type: String,
        required:true,
    },
    contactName:{
        type: String,
        required:true,
    },
    contactPhoneNumber:{
        type: String,
        required:true,
    },
    vatnum:{
        type: mongoose.Schema.Types.Decimal128,
    },
    creditLimit:{
        type: mongoose.Schema.Types.Decimal128,
    },
    paymentId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Payment", 
    },
    salesRegion:{
        type: String,
    },
    remark:{
        type: String,
    }

})

const Customer = mongoose.model('Customer', CustomerSchema)

module.exports= Customer;