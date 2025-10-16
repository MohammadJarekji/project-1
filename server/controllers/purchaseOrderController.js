const User = require('../models/userModel');
const UOM = require('../models/uomModel');
const Currency = require('../models/currencyModel');
const Vendor = require('../models/vendorModel');
const Product = require('../models/productsModel');
const Payment = require('../models/paymentModel');
const POCounter = require('../models/POCounterModel');
const PurchaseOrder = require('../models/purchaseOrderModel');
const mongoose = require('mongoose');

async function generatePONumber() {
  const year = new Date().getFullYear();

  let counter = await POCounter.findOne({ year });

  if (!counter) {
    counter = await POCounter.create({ year, lastSerial: 0 });
  }

  counter.lastSerial += 1;
  await counter.save();

  const baseSerial = 2500;
  const serialNumber = baseSerial + counter.lastSerial;

  // PO number without year prefix, e.g. PO2501, PO2502
  return `PO${serialNumber}`;
}

exports.addPurchaseOrder = async (req, res) =>{
    try{
        const {vendorId, productId, quantity, uomId, price, currencyId, paymentId, remark } = req.body;

            console.log("req: ",req.body)
        // Convert decimal quantity
        const decimalQuantity = mongoose.Types.Decimal128.fromString(quantity.toString());
        
        // Convert decimal price
        const decimalPrice = mongoose.Types.Decimal128.fromString(price.toString());

         const poNumber = await generatePONumber();

        // Create a new purchaseOrder
        const newPurchaseOrder = new PurchaseOrder({
            poNumber:poNumber, 
            vendorId,
            productId, 
            quantity:decimalQuantity, 
            uomId, 
            price:decimalPrice, 
            currencyId, 
            paymentId,
            remark 
        });

        await newPurchaseOrder.save();

        console.log("newPurchaseOrder: ",newPurchaseOrder)

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Cast to Number to avoid string concatenation
    product.quantity = Number(product.quantity) + Number(quantity);
    await product.save();

        return res.status(201).json({success: true, message:'PurchaseOrder added successfully'})
    } catch (error){
        console.error("Error adding PurchaseOrder: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getPurchaseOrder = async (req, res)=>{
    try{
        const purchaseOrder = await PurchaseOrder.find();
          const formattedPurchaseOrders = purchaseOrder.map(p => {
            const quantity = p.quantity && p.quantity.toString ? parseFloat(p.quantity.toString()) : p.quantity;
            const price = p.price && p.price.toString ? parseFloat(p.price.toString()) : p.price;

      return {
        ...p.toObject(),
        quantity,       // convert Mongoose doc to plain object
        price,          // overwrite price with plain number
         
      };
    });

        const vendor = await Vendor.find();
        const product = await Product.find();
        const uom = await UOM.find();
        const currency = await Currency.find();
        const payment = await Payment.find();
        const user = await User.find();
        
        return res.status(200).json({success: true, purchaseOrder:formattedPurchaseOrders, vendor, product, uom, currency, payment,user, }); 
    }catch (error){
        console.error('Error fetching purchaseOrders: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updatePurchaseOrder = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {poNumber, vendorId, productId, quantity:newQuantityRaw, uomId, price, currencyId, paymentId, remark} = req.body;

                const newQuantity = Number(newQuantityRaw);

    if (isNaN(newQuantity) || newQuantity < 0) {
      return res.status(400).json({ error: 'Quantity must be a non-negative number' });
    }
            // 1. Get existing purchase order
    const existingOrder = await PurchaseOrder.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    // 2. Get the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

        const oldQuantity = Number(existingOrder.quantity);

        // 3. Adjust product quantity based on the difference
        const quantityDiff = newQuantity - oldQuantity;
        product.quantity = Number(product.quantity) + quantityDiff;
        await product.save();

        // Convert decimal quantity
        const decimalQuantity = mongoose.Types.Decimal128.fromString(newQuantity.toString());
        
        // Convert decimal price
        const decimalPrice = mongoose.Types.Decimal128.fromString(price.toString());

        // update the purchaseOrder
        const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(id, {
            poNumber:poNumber, 
            vendorId,
            productId, 
            quantity:decimalQuantity, 
            uomId, 
            price:decimalPrice, 
            currencyId, 
            paymentId,
            remark 
        },{new:true});

        if(!updatedPurchaseOrder) {
            return res.status(400).json({success: false, message:"PurchaseOrder not found"});
        }
        return res.status(200).json({success: true,  message:'PurchaseOrder updated successfully', purchaseOrder: updatedPurchaseOrder})
    } catch (error) {
        console.log('Error updating PurchaseOrder: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deletePurchaseOrder = async (req, res)=>{
    try{
        const {id} = req.params;

    // 1. Find the purchase order
    const order = await PurchaseOrder.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    // 2. Find the product
    const product = await Product.findById(order.productId);
    if (!product) {
      return res.status(404).json({ error: 'Related product not found' });
    }

    // 3. Convert quantities to numbers and subtract
    product.quantity = Number(product.quantity) - Number(order.quantity);

    // Optional: Prevent negative quantity
    if (product.quantity < 0) product.quantity = 0;


    await product.save();

    // 4. Delete the purchase order
    await order.remove();

        return res.status(200).json({ success: true, message: 'PurchaseOrder deleted successfully' });
    } catch (error) {
    console.error('Error deleting purchaseOrder:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
