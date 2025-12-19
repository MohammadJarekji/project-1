const UOM = require('../models/uomModel');
const Product = require('../models/productsModel');
const ProductionOrder = require('../models/productionModel');
const Staff = require('../models/staffModel');
const Asset = require('../models/assestModel');
const mongoose = require('mongoose');

exports.addProduction = async (req, res) => {
  try {
    const { productId, assembledProduct } = req.body; // productId = assembled product
    if (!productId) return res.status(400).json({ success: false, message: "Assembled product is required" });

    // 1️⃣ Process component quantities in assembly (if the assembled product is part of an assembly)
    const assemblyOrder = await AssemblyOrder.findOne({ "lines.productId": productId });
    
    if (assemblyOrder) {
      // If the product exists in the Assembly Order lines, subtract the quantities of the assembly components
      for (const line of assemblyOrder.lines) {
        const componentProduct = await Product.findById(line.productId);
        if (componentProduct) {
          const currentQty = parseFloat(componentProduct.quantity?.toString() || '0');
          const subtractQty = parseFloat(line.quantity?.toString() || '0');
          componentProduct.quantity = mongoose.Types.Decimal128.fromString(
            (currentQty - subtractQty < 0 ? 0 : currentQty - subtractQty).toString()
          );
          await componentProduct.save();
        }
      }
    }

    // 2️⃣ Process the assembled product itself (add to the main product quantity)
    const assembledProductRecord = await Product.findById(productId);
    if (assembledProductRecord) {
      const currentQty = parseFloat(assembledProductRecord.quantity?.toString() || '0');
      // Sum of all produced quantity, here assuming 1 production = 1 unit of product
      const producedQty = 1;
      assembledProductRecord.quantity = mongoose.Types.Decimal128.fromString(
        (currentQty + producedQty).toString()
      );
      await assembledProductRecord.save();
    }

    // 3️⃣ Save the production order
    const processedProduct = assembledProduct.map(item => ({
      productId: item.productId,
      quantity: item.quantity !== undefined && item.quantity !== null ? mongoose.Types.Decimal128.fromString(item.quantity.toString()) : null
    }));

    const newProductionOrder = new ProductionOrder({
      productId, // assembled product
      assembledProduct: processedProduct
    });

    await newProductionOrder.save();

    return res.status(201).json({ success: true, message: 'Production added successfully' });
  } catch (error) {
    console.error("Error adding ProductionOrder:", error);
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
    const { id } = req.params;
    const { assembledProduct, productId } = req.body;

    // 1. Find the existing production order
    const existingOrder = await ProductionOrder.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ success: false, message: 'ProductionOrder not found' });
    }

    // 2. Revert old assembled product quantities (add back)
    for (const oldItem of existingOrder.assembledProduct) {
      const product = await Product.findById(oldItem.productId);
      if (product) {
        const currentQty = parseFloat(product.quantity.toString());
        const oldQty = parseFloat(oldItem.quantity.toString());
        product.quantity = mongoose.Types.Decimal128.fromString((currentQty + oldQty).toString());
        await product.save();
      }
    }

    // 3. Subtract new assembled product quantities
    for (const newItem of assembledProduct) {
      const product = await Product.findById(newItem.productId);
      if (product) {
        const currentQty = parseFloat(product.quantity.toString());
        const newQty = parseFloat(newItem.quantity.toString());
        product.quantity = mongoose.Types.Decimal128.fromString(
          (currentQty - newQty < 0 ? 0 : currentQty - newQty).toString()
        );
        await product.save();
      }
    }

    // 4. Adjust main product quantity ONLY if productId changed
    if (existingOrder.productId.toString() !== productId) {
      // Subtract 1 from old main product
      const oldMainProduct = await Product.findById(existingOrder.productId);
      if (oldMainProduct) {
        const currentQty = parseFloat(oldMainProduct.quantity.toString());
        oldMainProduct.quantity = mongoose.Types.Decimal128.fromString(
          (currentQty - 1 < 0 ? 0 : currentQty - 1).toString()
        );
        await oldMainProduct.save();
      }

      // Add 1 to new main product
      const newMainProduct = await Product.findById(productId);
      if (newMainProduct) {
        const currentQty = parseFloat(newMainProduct.quantity.toString());
        newMainProduct.quantity = mongoose.Types.Decimal128.fromString(
          (currentQty + 1).toString()
        );
        await newMainProduct.save();
      }
    }

    // 5. Update the ProductionOrder document
    existingOrder.productId = productId;
    existingOrder.assembledProduct = assembledProduct.map(item => ({
      productId: item.productId,
      quantity: mongoose.Types.Decimal128.fromString(item.quantity.toString()),
    }));
    await existingOrder.save();

    return res.status(200).json({
      success: true,
      message: 'ProductionOrder updated successfully'
    });

  } catch (error) {
    console.error("Error updating ProductionOrder:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteProduction = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find the production order
    const productionOrder = await ProductionOrder.findById(id);
    if (!productionOrder) {
      return res.status(404).json({ success: false, message: 'ProductionOrder not found' });
    }

    // 2️⃣ Revert quantities for assembled products
    for (const item of productionOrder.assembledProduct) {
      const product = await Product.findById(item.productId);
      if (product) {
        const currentQty = parseFloat(product.quantity.toString());
        const revertQty = parseFloat(item.quantity.toString());
        product.quantity = mongoose.Types.Decimal128.fromString((currentQty + revertQty).toString()); // add back
        await product.save();
      }
    }

    // 3️⃣ Subtract 1 from the main product (productId in production)
    const mainProduct = await Product.findById(productionOrder.productId);
    if (mainProduct) {
      const currentQty = parseFloat(mainProduct.quantity.toString());
      const updatedQty = currentQty - 1;
      mainProduct.quantity = mongoose.Types.Decimal128.fromString((updatedQty < 0 ? 0 : updatedQty).toString());
      await mainProduct.save();
    }

    // 4️⃣ Delete the production order
    await ProductionOrder.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'ProductionOrder deleted successfully and quantities reverted' });

  } catch (error) {
    console.error('Error deleting ProductionOrder:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
