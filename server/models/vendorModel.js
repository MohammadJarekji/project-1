const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({

    name:{
        type: String,
        required:true,
    },
    address:{
        type: String,
    },
    contactName:{
        type: String,
        required:true,
    },
    contactPhoneNumber:{
        type: String,
        required:true,
    },
    paymentId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Payment", 
    },
    creditLimit:{
        type: mongoose.Schema.Types.Decimal128,
    },
    remark:{
        type: String,
    }

})

const Vendor = mongoose.model('Vendor', VendorSchema)

module.exports= Vendor;