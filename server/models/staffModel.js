const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({

    name:{
        type: String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    dob:{
        type:Date,
    },
    phoneNumber:{
        type:String,
    },
    joinedDate:{
        type:Date,
    },
    hireDate:{
        type:Date,
    },

})

const Staff = mongoose.model('Staff', staffSchema)

module.exports= Staff;