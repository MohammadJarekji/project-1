const User = require('../models/userModel');
const UOM = require('../models/uomModel');
const Currency = require('../models/currencyModel');
const Vendor = require('../models/vendorModel');
const Customer = require('../models/customerModel');
const Product = require('../models/productsModel');
const Payment = require('../models/paymentModel');
const PAYCounter = require('../models/PAYCounterModel');
const PaymentOrder = require('../models/paymentOrderModel');
const mongoose = require('mongoose');

async function generatePAYNumber() {
  const year = new Date().getFullYear();

  let counter = await PAYCounter.findOne({ year });

  if (!counter) {
    counter = await PAYCounter.create({ year, lastSerial: 0 });
  }

  counter.lastSerial += 1;
  await counter.save();

  const baseSerial = 2500;
  const serialNumber = baseSerial + counter.lastSerial;

  // PO number without year prefix, e.g. PO2501, PO2502
  return `PAY${serialNumber}`;
}

exports.addPaymentOrder = async (req, res) =>{
    try{
        const {vendorId, amount, currencyId, remark } = req.body;

            console.log("req: ",req.body)
        // Convert decimal quantity
        const decimalAmount = mongoose.Types.Decimal128.fromString(amount.toString());

         const payNumber = await generatePAYNumber();

        // Create a new paymentOrder
        const newPaymentOrder = new PaymentOrder({
            payNumber:payNumber, 
            vendorId,
            amount:decimalAmount,  
            currencyId,
            remark 
        });

        await newPaymentOrder.save();

        console.log("newPaymentOrder: ",newPaymentOrder)

        return res.status(201).json({success: true, message:'PaymentOrder added successfully'})
    } catch (error){
        console.error("Error adding PaymentOrder: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getPaymentOrder = async (req, res)=>{
    try{
        const paymentOrder = await PaymentOrder.find();
          const formattedPaymentOrders = paymentOrder.map(p => {
            const amount = p.amount && p.amount.toString ? parseFloat(p.amount.toString()) : p.amount;

      return {
        ...p.toObject(),
        amount,       // convert Mongoose doc to plain object
          // overwrite price with plain number
         
      };
    });

        const vendor = await Vendor.find();
        const currency = await Currency.find();
        
        return res.status(200).json({success: true, paymentOrder:formattedPaymentOrders, vendor, currency }); 
       
    }catch (error){
        console.error('Error fetching paymentOrders: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updatePaymentOrder = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {payNumber, vendorId, amount, currencyId, remark} = req.body;
      
        // Convert decimal price
        const decimalAmount = mongoose.Types.Decimal128.fromString(amount.toString());

        // update the paymentOrder
        const updatedPaymentOrder = await PaymentOrder.findByIdAndUpdate(id, {
            payNumber:payNumber, 
            vendorId,
            amount:decimalAmount,  
            currencyId,
            remark 
        },{new:true});

        if(!updatedPaymentOrder) {
            return res.status(400).json({success: false, message:"PaymentOrder not found"});
        }
        return res.status(200).json({success: true,  message:'PaymentOrder updated successfully', paymentOrder: updatedPaymentOrder})
    } catch (error) {
        console.log('Error updating PaymentOrder: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deletePaymentOrder = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedPaymentOrder = await PaymentOrder.findByIdAndDelete(id);
        if(!deletedPaymentOrder){
            return res.status(400).json({success: false, message:'PaymentOrder not found'})
        }
        return res.status(200).json({ success: true, message: 'PaymentOrder deleted successfully' });
    } catch (error) {
    console.error('Error deleting paymentOrder:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
