const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({

    name:{
        type: String,
        required:true,
    },
    code:{
        type:String,
        required:true,
    },
    convertCurrency:{
        type: mongoose.Schema.Types.Decimal128,
        required:true,
    },

})

const Currency = mongoose.model('Currency', currencySchema)

module.exports= Currency;