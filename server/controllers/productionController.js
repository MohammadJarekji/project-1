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
