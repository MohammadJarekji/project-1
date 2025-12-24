const UOM = require('../models/uomModel');
const Product = require('../models/productsModel');
const ProductionOrder = require('../models/productionModel');
const AssemblyOrder = require('../models/assemblyOrderModel');
const Staff = require('../models/staffModel');
const Asset = require('../models/assestModel');
const mongoose = require('mongoose');

exports.addProduction = async (req, res) => {
  try {
    const { productId, assembledProduct } = req.body; // productId = main product name
    if (!productId || !assembledProduct || assembledProduct.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    // Step 1: Update the main product's quantity (add 1)
    const mainProduct = await Product.findById(productId);
    if (!mainProduct) {
      return res.status(404).json({ success: false, message: 'Main product not found' });
    }
    mainProduct.quantity = mongoose.Types.Decimal128.fromString(
      (parseFloat(mainProduct.quantity?.toString() || '0') + 1).toString()
    );
    await mainProduct.save();

    // Step 2: Process each assembled product and its base products
    for (const assembledItem of assembledProduct) {
      const assembledProductRecord = await Product.findById(assembledItem.productId);
      if (!assembledProductRecord) {
        return res.status(404).json({ success: false, message: `Assembled product ${assembledItem.productId} not found` });
      }

      // Subtract the assembled product's quantity
      assembledProductRecord.quantity = mongoose.Types.Decimal128.fromString(
        (parseFloat(assembledProductRecord.quantity?.toString() || '0') - parseFloat(assembledItem.quantity.toString())).toString()
      );
      await assembledProductRecord.save();

      // Step 3: Look at the assembly table and update quantities of base products
      const assembly = await AssemblyOrder.findOne({ productId: assembledItem.productId });
      if (assembly) {
        for (const line of assembly.lines) {
          const baseProduct = await Product.findById(line.productId);
          if (!baseProduct) {
            return res.status(404).json({ success: false, message: `Base product ${line.productId} not found` });
          }

          // Calculate how many units of the base product are needed
          const baseProductQuantity = parseFloat(line.quantity.toString()) * parseFloat(assembledItem.quantity.toString());

          // Subtract the required quantity of the base product from the product table
          baseProduct.quantity = mongoose.Types.Decimal128.fromString(
            (parseFloat(baseProduct.quantity?.toString() || '0') - baseProductQuantity).toString()
          );
          await baseProduct.save();
        }
      }
    }

    // Step 4: Create the production order (assuming assembledProduct and main product info is valid)
    const newProductionOrder = new ProductionOrder({
      productId, // main product
      assembledProduct: assembledProduct.map(item => ({
        productId: item.productId,
        quantity: mongoose.Types.Decimal128.fromString(item.quantity.toString())
      }))
    });

    await newProductionOrder.save();

    return res.status(201).json({ success: true, message: 'Production added successfully' });
  } catch (error) {
    console.error("Error adding Production:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getProduction = async (req, res) => {
  try {
    const productionOrders = await ProductionOrder.find()
      .lean();

    const formattedOrders = productionOrders.map(order => ({
      ...order,
      assembledProduct: (order.assembledProduct || []).map(item => ({
        ...item,
        quantity: parseFloat(item.quantity?.toString() || '0'),
      })),
    }));

    const product = await Product.find();

    return res.status(200).json({
      success: true,
      production: formattedOrders,
      product,
    });
  } catch (error) {
    console.error("Error fetching ProductionOrders:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.updateProduction = async (req, res) => {
  try {
    const { productionOrderId } = req.params;  // The production order ID to update
    const { productId, assembledProduct } = req.body; // New data for editing

    if (!productId || !assembledProduct || assembledProduct.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    // Step 1: Find the existing production order
    const existingOrder = await ProductionOrder.findById(productionOrderId);
    if (!existingOrder) {
      return res.status(404).json({ success: false, message: 'Production order not found' });
    }

    // Step 2: Revert the previous quantities to how they were before the update
    // Revert the main product quantity (subtract 1)
    const mainProduct = await Product.findById(existingOrder.productId);
    if (!mainProduct) {
      return res.status(404).json({ success: false, message: 'Main product not found' });
    }
    mainProduct.quantity = mongoose.Types.Decimal128.fromString(
      (parseFloat(mainProduct.quantity?.toString() || '0') - 1).toString()
    );
    await mainProduct.save();

    // Revert the assembled product quantities
    for (const assembledItem of existingOrder.assembledProduct) {
      const assembledProductRecord = await Product.findById(assembledItem.productId);
      if (!assembledProductRecord) {
        return res.status(404).json({ success: false, message: `Assembled product ${assembledItem.productId} not found` });
      }
      assembledProductRecord.quantity = mongoose.Types.Decimal128.fromString(
        (parseFloat(assembledProductRecord.quantity?.toString() || '0') + parseFloat(assembledItem.quantity.toString())).toString()
      );
      await assembledProductRecord.save();
    }

    // Step 3: Process the updated quantities and subtract from the main product and assembled products
    // Update the main product quantity (add 1)
    const updatedMainProduct = await Product.findById(productId);
    if (!updatedMainProduct) {
      return res.status(404).json({ success: false, message: 'Updated main product not found' });
    }
    updatedMainProduct.quantity = mongoose.Types.Decimal128.fromString(
      (parseFloat(updatedMainProduct.quantity?.toString() || '0') + 1).toString()
    );
    await updatedMainProduct.save();

    // Update the assembled products
    for (const assembledItem of assembledProduct) {
      const updatedAssembledProduct = await Product.findById(assembledItem.productId);
      if (!updatedAssembledProduct) {
        return res.status(404).json({ success: false, message: `Updated assembled product ${assembledItem.productId} not found` });
      }

      updatedAssembledProduct.quantity = mongoose.Types.Decimal128.fromString(
        (parseFloat(updatedAssembledProduct.quantity?.toString() || '0') - parseFloat(assembledItem.quantity.toString())).toString()
      );
      await updatedAssembledProduct.save();
    }

    // Step 4: Update the production order with the new data
    existingOrder.productId = productId;
    existingOrder.assembledProduct = assembledProduct.map(item => ({
      productId: item.productId,
      quantity: mongoose.Types.Decimal128.fromString(item.quantity.toString())
    }));

    await existingOrder.save();

    return res.status(200).json({ success: true, message: 'Production order updated successfully' });
  } catch (error) {
    console.error("Error editing Production:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteProduction = async (req, res) => {
  try {
    const { id } = req.params;  // Extract the production order ID from the URL

    // Step 1: Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid production order ID' });
    }

    // Step 2: Find the production order by ID
    const productionOrder = await ProductionOrder.findById(id);
    if (!productionOrder) {
      return res.status(404).json({ success: false, message: 'ProductionOrder not found' });
    }

    // Step 3: Revert the quantities of assembled products
    for (const assembledItem of productionOrder.assembledProduct) {
      const product = await Product.findById(assembledItem.productId);
      if (product) {
        const currentQty = parseFloat(product.quantity.toString());  // Get current quantity of assembled product
        const revertQty = parseFloat(assembledItem.quantity.toString());  // Get quantity to revert
        product.quantity = mongoose.Types.Decimal128.fromString((currentQty + revertQty).toString());  // Add back the quantity
        await product.save();
      }
    }

    // Step 4: Revert the quantities for base products (from assembly table)
    for (const assembledItem of productionOrder.assembledProduct) {
      const assembly = await AssemblyOrder.findOne({ productId: assembledItem.productId });
      if (assembly) {
        for (const line of assembly.lines) {
          const baseProduct = await Product.findById(line.productId);
          if (baseProduct) {
            // Calculate how many units of the base product were used
            const requiredQty = parseFloat(line.quantity.toString()) * parseFloat(assembledItem.quantity.toString());
            const currentQty = parseFloat(baseProduct.quantity.toString());
            baseProduct.quantity = mongoose.Types.Decimal128.fromString((currentQty + requiredQty).toString());  // Add back the base product quantity
            await baseProduct.save();
          }
        }
      }
    }

    // Step 5: Subtract 1 from the main product (Assembled Chair) quantity
    const mainProduct = await Product.findById(productionOrder.productId);
    if (mainProduct) {
      const currentQty = parseFloat(mainProduct.quantity.toString());  // Get the current quantity of the main product
      const updatedQty = currentQty - 1;  // Subtract 1 for the production we are deleting
      mainProduct.quantity = mongoose.Types.Decimal128.fromString((updatedQty < 0 ? 0 : updatedQty).toString());  // Ensure quantity doesn't go below 0
      await mainProduct.save();
    }

    // Step 6: Delete the production order
    await ProductionOrder.findByIdAndDelete(id);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'ProductionOrder deleted successfully and quantities reverted'
    });
  } catch (error) {
    console.error('Error deleting ProductionOrder:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
