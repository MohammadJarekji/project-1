const UOM = require('../models/uomModel');
const Product = require('../models/productsModel');
const Inventory = require('../models/InventoryModel');
const mongoose = require('mongoose');

exports.addInventory = async (req, res) => {
  try {
    const { productId, adjustmentType, quantity, uomId, remark } = req.body;

    console.log("req.body:", req.body);

    // Convert quantity to Decimal128
    const decimalQuantity = mongoose.Types.Decimal128.fromString(quantity.toString());

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Convert existing product quantity to float for math
    const currentQty = parseFloat(product.quantity.toString());
    const adjustmentQty = parseFloat(quantity);

    let newQty;

    if (adjustmentType === 'Gain') {
      newQty = currentQty + adjustmentQty;
    } else if (adjustmentType === 'Loss') {
      newQty = currentQty - adjustmentQty;
      if (newQty < 0) newQty = 0; // Optional: prevent negative stock
    } else {
      return res.status(400).json({ success: false, message: 'Invalid adjustment type' });
    }

    // Update product quantity
    product.quantity = mongoose.Types.Decimal128.fromString(newQty.toString());
    await product.save();

    // Create and save inventory record
    const newInventory = new Inventory({
      productId,
      adjustmentType,
      quantity: decimalQuantity,
      uomId,
      remark
    });

    await newInventory.save();

    console.log("newInventory:", newInventory);

    return res.status(201).json({ success: true, message: 'Inventory added successfully' });

  } catch (error) {
    console.error("Error adding Inventory:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getInventory = async (req, res)=>{
    try{
        const inventory = await Inventory.find();
          const formattedInventorys = inventory.map(p => {
            const quantity = p.quantity && p.quantity.toString ? parseFloat(p.quantity.toString()) : p.quantity;
            
      return {
        ...p.toObject(),
        quantity,       // convert Mongoose doc to plain object
          // overwrite price with plain number
         
      };
    });

        const product = await Product.find();
        const uom = await UOM.find();

        return res.status(200).json({success: true, inventory:formattedInventorys, product, uom, }); 
    }catch (error){
        console.error('Error fetching inventorys: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateInventory = async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const { productId, adjustmentType, quantity, uomId, remark } = req.body;

    // Find the existing inventory record
    const existingInventory = await Inventory.findById(inventoryId);
    if (!existingInventory) {
      return res.status(404).json({ success: false, message: 'Inventory record not found' });
    }

    // Find the related product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Convert quantities
    const oldQty = parseFloat(existingInventory.quantity.toString());
    const newQty = parseFloat(quantity);
    const currentProductQty = parseFloat(product.quantity.toString());

    // Reverse the old adjustment
    let reversedQty = currentProductQty;

    if (existingInventory.adjustmentType === 'Gain') {
      reversedQty -= oldQty;
    } else if (existingInventory.adjustmentType === 'Loss') {
      reversedQty += oldQty;
    }

    // Apply the new adjustment
    let finalQty;
    if (adjustmentType === 'Gain') {
      finalQty = reversedQty + newQty;
    } else if (adjustmentType === 'Loss') {
      finalQty = reversedQty - newQty;
      if (finalQty < 0) finalQty = 0; // Optional safeguard
    } else {
      return res.status(400).json({ success: false, message: 'Invalid adjustment type' });
    }

    // Update product quantity
    product.quantity = mongoose.Types.Decimal128.fromString(finalQty.toString());
    await product.save();

    // Update inventory record
    existingInventory.productId = productId;
    existingInventory.adjustmentType = adjustmentType;
    existingInventory.quantity = mongoose.Types.Decimal128.fromString(newQty.toString());
    existingInventory.uomId = uomId;
    existingInventory.remark = remark;

    await existingInventory.save();

    return res.status(200).json({ success: true, message: 'Inventory updated successfully' });

  } catch (error) {
    console.error('Error updating inventory:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the inventory entry
    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res.status(404).json({ success: false, message: 'Inventory record not found' });
    }

    // Find the related product
    const product = await Product.findById(inventory.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Related product not found' });
    }

    // Reverse the inventory effect
    const inventoryQty = parseFloat(inventory.quantity.toString());
    let currentProductQty = parseFloat(product.quantity.toString());

    if (inventory.adjustmentType === 'Gain') {
      currentProductQty -= inventoryQty;
    } else if (inventory.adjustmentType === 'Loss') {
      currentProductQty += inventoryQty;
    }

    // Optional: prevent negative quantity
    if (currentProductQty < 0) currentProductQty = 0;

    // Save updated product quantity
    product.quantity = mongoose.Types.Decimal128.fromString(currentProductQty.toString());
    await product.save();

    // Delete the inventory record
    await Inventory.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'Inventory deleted successfully' });

  } catch (error) {
    console.error('Error deleting inventory:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
