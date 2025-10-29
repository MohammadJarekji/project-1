const mongoose = require('mongoose');


// Sub-schema for staff
const staffSchema = new mongoose.Schema({

  staffId:{
    type:mongoose.Schema.Types.ObjectId, ref:"Staff", 
  },
  hours: {
    type: mongoose.Schema.Types.Decimal128,
  },
});

// Sub-schema for asset
const assetSchema = new mongoose.Schema({

  assetId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Asset",
    },
    hours:{
        type: mongoose.Schema.Types.Decimal128,
    }
});


const projectDetailsSchema = new mongoose.Schema({

    projectId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Project", required: true, 
    },

    staff: [staffSchema],
    asset: [assetSchema],
    
},{
  timestamps: true, // adds createdAt and updatedAt
})

const ProjectDetails = mongoose.model('ProjectDetails', projectDetailsSchema)

module.exports= ProjectDetails;