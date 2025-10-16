const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name:{
        type: String,
        required:true,
    },
    description:{
        type:String,
    },
    quantity:{
        type: mongoose.Schema.Types.Decimal128,
    },
    uomId:{
        type:mongoose.Schema.Types.ObjectId, ref:"UOM",
    },
    price:{
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    currencyId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Currency", required: true 
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Category", 
    },
    warehouseId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Warehouse", required: true 
    },
    minStkLevel:{
        type: mongoose.Schema.Types.Decimal128,
    },
    maxStkLevel:{
        type: mongoose.Schema.Types.Decimal128,
    },
    reorderPoint:{
        type: mongoose.Schema.Types.Decimal128,
    },
    vendorId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Vendor", 
    },
    blocked:{
        type:Boolean,
    },
    assembled:{
        type:Boolean,
    },
    remark:{
        type:String,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId, ref:"User", 
    },
})

const Product = mongoose.model('Product', productSchema)

module.exports= Product;