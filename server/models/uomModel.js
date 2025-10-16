const mongoose = require('mongoose');

const uomSchema = new mongoose.Schema({

    name:{
        type: String,
        required:true,
    },
    code:{
        type:String,
        required:true,
    },

})

const UOM = mongoose.model('UOM', uomSchema)

module.exports= UOM;