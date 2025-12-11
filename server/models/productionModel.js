const mongoose = require('mongoose');


// Sub-schema for assembled Products
const asproductSchema = new mongoose.Schema({

  productId:{
    type:mongoose.Schema.Types.ObjectId, ref:"Product",
    required:true, 
  },
  quantity: {
    type: mongoose.Schema.Types.Decimal128,
  },
});

const productionSchema = new mongoose.Schema({

    productId:{
    type:mongoose.Schema.Types.ObjectId, ref:"Product",
    required:true, 
  },
    assembledProduct: [asproductSchema],
    
},{
  timestamps: true, // adds createdAt and updatedAt
})

const Production = mongoose.model('Production', productionSchema)

module.exports= Production;