const UOM = require('../models/uomModel');
const Product = require('../models/productsModel');
const ProductionOrder = require('../models/productionModel');
const Staff = require('../models/staffModel');
const Asset = require('../models/assestModel');
const mongoose = require('mongoose');

exports.addProduction = async (req, res) => {
  try {
    const { assembledProduct, productId } = req.body;

    // Save production order
    const processedProduct = assembledProduct.map(item => ({
      productId: item.productId,
      quantity: item.quantity !== undefined && item.quantity !== null && item.quantity !== ''
                  ? mongoose.Types.Decimal128.fromString(item.quantity.toString())
                  : null,
    }));

    const newProductionOrder = new ProductionOrder({
      productId,
      assembledProduct: processedProduct,
    });

    await newProductionOrder.save();

    for (const item of assembledProduct) {
      // 1️⃣ Subtract component (lines) quantities from their respective products
      const assembly = await AssemblyOrder.findOne({ productId: item.productId }).lean();
      if (assembly) {
        for (const line of assembly.lines) {
          const componentProduct = await Product.findById(line.productId);
          if (componentProduct) {
            const currentQty = parseFloat(componentProduct.quantity.toString());
            const subtractQty = parseFloat(line.quantity.toString()) * parseFloat(item.quantity.toString());
            const updatedQty = currentQty - subtractQty;
            componentProduct.quantity = mongoose.Types.Decimal128.fromString(
              (updatedQty < 0 ? 0 : updatedQty).toString() // prevent negative quantities
            );
            await componentProduct.save();
          }
        }
      }

      // 2️⃣ Add assembled product quantity to its product record
      const assembledProductRecord = await Product.findById(item.productId);
      if (assembledProductRecord) {
        const currentQty = parseFloat(assembledProductRecord.quantity.toString());
        const updatedQty = currentQty + parseFloat(item.quantity.toString());
        assembledProductRecord.quantity = mongoose.Types.Decimal128.fromString(updatedQty.toString());
        await assembledProductRecord.save();
      }
    }

    return res.status(201).json({
      success: true,
      message: 'ProductionOrder added successfully with component subtraction and assembled product addition'
    });

  } catch (error) {
    console.error("Error adding ProductionOrder:", error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
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
    const { assembledProduct, name } = req.body;

    // 1. Find the existing production order
    const existingOrder = await ProductionOrder.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ success: false, message: 'ProductionOrder not found' });
    }

    // 2. Revert the old product quantities
    for (const item of existingOrder.assembledProduct) {
      const product = await Product.findById(item.productId);
      if (product) {
        const oldQty = parseFloat(product.quantity.toString());
        const productionQty = parseFloat(item.quantity.toString());
        product.quantity = 
          oldQty !== undefined && oldQty !== null && oldQty !== '' && productionQty !== undefined && productionQty !== null && productionQty !== ''
            ? mongoose.Types.Decimal128.fromString((oldQty - productionQty).toString())
            : null;
        await product.save();
      }
    }

    // 3. Prepare the new assembledProduct array
    const processedProduct = assembledProduct.map(item => ({
      productId: item.productId,
      quantity: item.quantity !== undefined && item.quantity !== null && item.quantity !== ''
                          ? mongoose.Types.Decimal128.fromString(item.quantity.toString())
                          : null,
    }));

    // 4. Apply the new quantities to products
    for (const item of assembledProduct) {
      const product = await Product.findById(item.productId);
      if (product) {
        const oldQty = parseFloat(product.quantity.toString());
        const addedQty = parseFloat(item.quantity);
        product.quantity = oldQty !== undefined && oldQty !== null && oldQty !== '' && productionQty !== undefined && productionQty !== null && productionQty !== ''
            ? mongoose.Types.Decimal128.fromString((oldQty + productionQty).toString())
            : null;
        await product.save();
      }
    }

    // 5. Update the production order
    existingOrder.name = name;
    existingOrder.assembledProduct = processedProduct;

    await existingOrder.save();

    return res.status(200).json({
      success: true,
      message: 'ProductionOrder updated successfully'
    });

  } catch (error) {
    console.error("Error updating ProductionOrder:", error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.deleteProduction = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the production order
    const productionOrder = await ProductionOrder.findById(id);
    if (!productionOrder) {
      return res.status(404).json({ success: false, message: 'ProductionOrder not found' });
    }

    // 2. Revert the quantity for each assembled product
    for (const item of productionOrder.assembledProduct) {
      const product = await Product.findById(item.productId);
      if (product) {
        const currentQty = parseFloat(product.quantity.toString());
        const revertQty = item.quantity && !isNaN(item.quantity) 
                          ? parseFloat(item.quantity.toString()) 
                          : 0;
        const updatedQty = currentQty - revertQty;

        product.quantity = mongoose.Types.Decimal128.fromString(
          (updatedQty < 0 ? 0 : updatedQty).toString()
        );
        await product.save();
      }
    }

    // 3. Delete the production order
    await ProductionOrder.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'ProductionOrder deleted successfully' });

  } catch (error) {
    console.error('Error deleting ProductionOrder:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
