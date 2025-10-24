const Product = require('../models/productsModel');
const User = require('../models/userModel');
const UOM = require('../models/uomModel');
const Warehouse = require('../models/warehouseModel');
const Category = require('../models/categoryModel');
const Currency = require('../models/currencyModel');
const Vendor = require('../models/vendorModel');
const mongoose = require('mongoose');

exports.addProduct = async (req, res) =>{
    try{
        const {name, description, uomId, price, currencyId, categoryId, warehouseId, minStkLevel,
            maxStkLevel, reorderPoint, vendorId, blocked, assembled, remark, userId } = req.body;
    
        // Convert decimal price
        const decimalPrice = mongoose.Types.Decimal128.fromString(price.toString());

        // Convert decimal minStkLevel
        const decimalMinStkLvl =
            minStkLevel !== undefined && minStkLevel !== null && minStkLevel !== ''
              ? mongoose.Types.Decimal128.fromString(minStkLevel.toString())
              : null;

        // Convert decimal maxStkLevel
        const decimalMaxStkLvl =
            maxStkLevel !== undefined && maxStkLevel !== null && maxStkLevel !== ''
              ? mongoose.Types.Decimal128.fromString(maxStkLevel.toString())
              : null;

        // Convert decimal reorderPoint
        const decimalReorderPoint =
            reorderPoint !== undefined && reorderPoint !== null && reorderPoint !== ''
              ? mongoose.Types.Decimal128.fromString(maxStkLevel.toString())
              : null;

        // Create a new product
        const newProduct = new Product({
            name, 
            description,
            quantity:0,  
            uomId, 
            price:decimalPrice, 
            currencyId, 
            categoryId, 
            warehouseId, 
            minStkLevel:decimalMinStkLvl, 
            maxStkLevel:decimalMaxStkLvl, 
            reorderPoint:decimalReorderPoint, 
            vendorId, 
            blocked, 
            assembled, 
            remark, 
            userId
        });

        await newProduct.save();
        return res.status(201).json({success: true, message:'Product added successfully'})
    } catch (error){
        console.error("Error adding Product: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getProducts = async (req, res)=>{
    try{
        const product = await Product.find().populate('userId');
          const formattedProducts = product.map(p => {
            const quantity = p.quantity && p.quantity.toString ? parseFloat(p.quantity.toString()) : p.quantity;
            const price = p.price && p.price.toString ? parseFloat(p.price.toString()) : p.price;
            const minStkLevel = p.minStkLevel && p.minStkLevel.toString ? parseFloat(p.minStkLevel.toString()) : p.minStkLevel;
            const maxStkLevel = p.maxStkLevel && p.maxStkLevel.toString ? parseFloat(p.maxStkLevel.toString()) : p.maxStkLevel;
            const reorderPoint = p.reorderPoint && p.reorderPoint.toString ? parseFloat(p.reorderPoint.toString()) : p.reorderPoint;

      return {
        ...p.toObject(),
        quantity,       // convert Mongoose doc to plain object
        price,          // overwrite price with plain number
        minStkLevel,    // overwrite price with plain number
        maxStkLevel,    // overwrite price with plain number
        reorderPoint    // overwrite price with plain number            
      };
    });
        const user = await User.find();
        const uom = await UOM.find();
        const warehouse = await Warehouse.find();
        const category = await Category.find();
        const currency = await Currency.find();
        const vendor = await Vendor.find();
        return res.status(200).json({success: true, product:formattedProducts, user, uom, warehouse, category, currency, vendor}); 
    }catch (error){
        console.error('Error fetching products: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateProduct = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {name, description, uomId, price, currencyId, categoryId, warehouseId, minStkLevel,
            maxStkLevel, reorderPoint, vendorId, blocked, assembled, remark, userId } = req.body;
        
        // Convert decimal price
        const decimalPrice = mongoose.Types.Decimal128.fromString(price.toString());

        // Convert decimal minStkLevel
        const decimalMinStkLvl = mongoose.Types.Decimal128.fromString(minStkLevel.toString());

        // Convert decimal maxStkLevel
        const decimalMaxStkLvl = mongoose.Types.Decimal128.fromString(maxStkLevel.toString());

        // Convert decimal reorderPoint
        const decimalReorderPoint = mongoose.Types.Decimal128.fromString(reorderPoint.toString());

        // update the product
        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name, 
            description, 
            uomId, 
            price:decimalPrice, 
            currencyId, 
            categoryId, 
            warehouseId, 
            minStkLevel:decimalMinStkLvl, 
            maxStkLevel:decimalMaxStkLvl, 
            reorderPoint:decimalReorderPoint, 
            vendorId, 
            blocked, 
            assembled, 
            remark, 
            userId
        },{new:true});

        if(!updatedProduct) {
            return res.status(400).json({success: false, message:"Product not found"});
        }
        return res.status(200).json({success: true,  message:'Product updated successfully', product: updatedProduct})
    } catch (error) {
        console.log('Error updating Product: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deleteProduct = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deletedProduct){
            return res.status(400).json({success: false, message:'Product not found'})
        }
        return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // Convert Decimal128 to numbers and filter
    const lowStockProducts = products.filter(p => {
      const quantity = parseFloat(p.quantity?.toString() || '0');
      const minStkLevel = parseFloat(p.minStkLevel?.toString() || '0');
      return quantity < minStkLevel;
    });

    res.json({ lowStockProducts });
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // Filter products where quantity < minStkLevel
    const lowStockProducts = products.filter(p => {
      const quantity = p.quantity ? parseFloat(p.quantity.toString()) : 0;
      const minStkLevel = p.minStkLevel ? parseFloat(p.minStkLevel.toString()) : 0;
      return quantity < minStkLevel;
    });

    // Format for clean response (optional)
    const formatted = lowStockProducts.map(p => ({
      _id: p._id,
      name: p.name,
      quantity: p.quantity ? parseFloat(p.quantity.toString()) : 0,
      minStkLevel: p.minStkLevel ? parseFloat(p.minStkLevel.toString()) : 0,
      warehouseId: p.warehouseId,
    }));

    res.status(200).json({ lowStockProducts: formatted });
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
