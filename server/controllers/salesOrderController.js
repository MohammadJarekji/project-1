const User = require('../models/userModel');
const UOM = require('../models/uomModel');
const Currency = require('../models/currencyModel');
const Vendor = require('../models/vendorModel');
const Customer = require('../models/customerModel');
const Product = require('../models/productsModel');
const Payment = require('../models/paymentModel');
const SOCounter = require('../models/SOCounterModel');
const SalesOrder = require('../models/salesOrderModel');
const mongoose = require('mongoose');

async function generatePONumber() {
  const year = new Date().getFullYear();

  let counter = await SOCounter.findOne({ year });

  if (!counter) {
    counter = await SOCounter.create({ year, lastSerial: 0 });
  }

  counter.lastSerial += 1;
  await counter.save();

  const baseSerial = 2500;
  const serialNumber = baseSerial + counter.lastSerial;

  // PO number without year prefix, e.g. PO2501, PO2502
  return `SO${serialNumber}`;
}

exports.addSalesOrder = async (req, res) =>{
    try{
        const {customerId, productId, quantity, uomId, price, currencyId, deliveryDate, paymentId, remark } = req.body;

            console.log("req: ",req.body)
        // Convert decimal quantity
        const decimalQuantity = mongoose.Types.Decimal128.fromString(quantity.toString());
        
        // Convert decimal price
        const decimalPrice = mongoose.Types.Decimal128.fromString(price.toString());

         const soNumber = await generatePONumber();

        // Create a new salesOrder
        const newSalesOrder = new SalesOrder({
            soNumber:soNumber, 
            customerId,
            productId, 
            quantity:decimalQuantity, 
            uomId, 
            price:decimalPrice, 
            currencyId,
            deliveryDate, 
            paymentId,
            remark 
        });

        await newSalesOrder.save();

        console.log("newSalesOrder: ",newSalesOrder)

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Cast to Number to avoid string concatenation
    product.quantity = Number(product.quantity) - Number(quantity);
    await product.save();

        return res.status(201).json({success: true, message:'SalesOrder added successfully'})
    } catch (error){
        console.error("Error adding SalesOrder: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getSalesOrder = async (req, res)=>{
    try{
        const salesOrder = await SalesOrder.find();
          const formattedSalesOrders = salesOrder.map(p => {
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
        const customer = await Customer.find();
        
        return res.status(200).json({success: true, salesOrder:formattedSalesOrders, vendor, product, uom, currency, payment,user, customer}); 
    }catch (error){
        console.error('Error fetching salesOrders: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateSalesOrder = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {soNumber, customerId, productId, quantity:newQuantityRaw, uomId, price, currencyId, deliveryDate, paymentId, remark} = req.body;

                const newQuantity = Number(newQuantityRaw);

    if (isNaN(newQuantity) || newQuantity < 0) {
      return res.status(400).json({ error: 'Quantity must be a non-negative number' });
    }
            // 1. Get existing sales order
    const existingOrder = await SalesOrder.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: 'Sales order not found' });
    }

    // 2. Get the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

        const oldQuantity = Number(existingOrder.quantity);

        // 3. Adjust product quantity based on the difference
        const quantityDiff = newQuantity - oldQuantity;
        product.quantity = Number(product.quantity) - quantityDiff;

        // Make sure quantity doesn't go below zero
        if (product.quantity < 0) {
              return res.status(400).json({ error: 'Not enough stock to update the sale' });
            }

        await product.save();

        // Convert decimal quantity
        const decimalQuantity = mongoose.Types.Decimal128.fromString(newQuantity.toString());
        
        // Convert decimal price
        const decimalPrice = mongoose.Types.Decimal128.fromString(price.toString());

        // update the salesOrder
        const updatedSalesOrder = await SalesOrder.findByIdAndUpdate(id, {
            soNumber:soNumber, 
            customerId,
            productId, 
            quantity:decimalQuantity, 
            uomId, 
            price:decimalPrice, 
            currencyId,
            deliveryDate, 
            paymentId,
            remark 
        },{new:true});

        if(!updatedSalesOrder) {
            return res.status(400).json({success: false, message:"SalesOrder not found"});
        }
        return res.status(200).json({success: true,  message:'SalesOrder updated successfully', salesOrder: updatedSalesOrder})
    } catch (error) {
        console.log('Error updating SalesOrder: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deleteSalesOrder = async (req, res)=>{
    try{
        const {id} = req.params;

    // 1. Find the sales order
    const order = await SalesOrder.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Sales order not found' });
    }

    // 2. Find the product
    const product = await Product.findById(order.productId);
    if (!product) {
      return res.status(404).json({ error: 'Related product not found' });
    }

    // 3. Convert quantities to numbers and add back to the quantity
    product.quantity = Number(product.quantity) + Number(order.quantity);

    await product.save();

    // 4. Delete the sales order
    await order.remove();

        return res.status(200).json({ success: true, message: 'SalesOrder deleted successfully' });
    } catch (error) {
    console.error('Error deleting salesOrder:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
