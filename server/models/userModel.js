const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    userName:{
        type: String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required: true,
    },
    role:{
        type: String,
        default:'user',
    },
    password:{
        type:String,
        required: true,
    },
        DateOfBirth:{
        type:Date,
     
    },
        phoneNumber:{
        type:String,
       
    },
        joinedDate:{
        type:String,
       
    },
        joinedDate:{
        type:String,
       
    },

    // •	Module Access (Later)

})

const User = mongoose.model('User', userSchema)

module.exports= User;