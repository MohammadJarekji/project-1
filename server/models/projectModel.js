const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({

    name:{
        type: String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    cost:{
        type:mongoose.Schema.Types.Decimal128,
        required:true,
    },
    fromDate:{
        type:Date,
        required:true,
    },
    toDate:{
        type:Date,
        required:true,
    },

})

const Project = mongoose.model('Project', projectSchema)

module.exports= Project;