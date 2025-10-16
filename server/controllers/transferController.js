const UOM = require('../models/uomModel');
const Product = require('../models/productsModel');
const Transfer = require('../models/transferModel');
const WareHouse = require('../models/warehouseModel');
const mongoose = require('mongoose');

exports.addTransfer = async (req, res) =>{
    try{
        const {productId, quantity, uomId, fromWareHouseId, toWareHouseId} = req.body;

        // Convert decimal quantity
        const decimalQuantity = mongoose.Types.Decimal128.fromString(quantity.toString());

        // Create a new transfer
        const newTransfer = new Transfer({

            productId, 
            quantity:decimalQuantity, 
            uomId, 
            fromWareHouseId,
            toWareHouseId,
        });

        await newTransfer.save();

        console.log("newTransfer: ",newTransfer)

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Cast to Number to avoid string concatenation
    product.quantity = Number(product.quantity) - Number(quantity);
    await product.save();

        return res.status(201).json({success: true, message:'Transfer added successfully'})
    } catch (error){
        console.error("Error adding Transfer: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getTransfer = async (req, res)=>{
    try{
        const transfer = await Transfer.find();
          const formattedTransfers = transfer.map(p => {
            const quantity = p.quantity && p.quantity.toString ? parseFloat(p.quantity.toString()) : p.quantity;

      return {
        ...p.toObject(),
        quantity,       // convert Mongoose doc to plain object
                        // overwrite price with plain number
         
      };
    });

        const product = await Product.find();
        const uom = await UOM.find();
        const wareHouse = await WareHouse.find();
        
        return res.status(200).json({success: true, transfer:formattedTransfers,product, uom, wareHouse}); 
    }catch (error){
        console.error('Error fetching transfers: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateTransfer = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {productId, quantity, uomId, fromWareHouseId, toWareHouseId} = req.body;

        // Convert decimal quantity
        const decimalQuantity = mongoose.Types.Decimal128.fromString(quantity.toString());

        // update the transfer
        const updatedTransfer = await Transfer.findByIdAndUpdate(id, {
            productId, 
            quantity:decimalQuantity, 
            uomId, 
            fromWareHouseId,
            toWareHouseId,
        },{new:true});

        if(!updatedTransfer) {
            return res.status(400).json({success: false, message:"Transfer not found"});
        }
        return res.status(200).json({success: true,  message:'Transfer updated successfully', transfer: updatedTransfer})
    } catch (error) {
        console.log('Error updating Transfer: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deleteTransfer = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedTransfer = await Transfer.findByIdAndDelete(id);
        if(!deletedTransfer){
            return res.status(400).json({success: false, message:'Transfer not found'})
        }
        return res.status(200).json({ success: true, message: 'Transfer deleted successfully' });
    } catch (error) {
    console.error('Error deleting transfer:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
