const Currency = require('../models/currencyModel');
const Vendor = require('../models/vendorModel');
const RECCounter = require('../models/RECCounterModel');
const ReceiptOrder = require('../models/receiptOrderModel');
const mongoose = require('mongoose');
const Customer = require('../models/customerModel');

async function generateRECNumber() {
  const year = new Date().getFullYear();

  let counter = await RECCounter.findOne({ year });

  if (!counter) {
    counter = await RECCounter.create({ year, lastSerial: 0 });
  }

  counter.lastSerial += 1;
  await counter.save();

  const baseSerial = 2500;
  const serialNumber = baseSerial + counter.lastSerial;

  // PO number without year prefix, e.g. PO2501, PO2502
  return `REC${serialNumber}`;
}

exports.addReceiptOrder = async (req, res) =>{
    try{
        const {customerId, amount, currencyId, date, remark } = req.body;

        // Convert decimal quantity
        const decimalAmount =
                            amount !== undefined && amount !== null && amount !== ''
                              ? mongoose.Types.Decimal128.fromString(amount.toString())
                              : null;

         const recNumber = await generateRECNumber();

        // Create a new receiptOrder
        const newReceiptOrder = new ReceiptOrder({
            recNumber:recNumber, 
            customerId,
            amount:decimalAmount,  
            currencyId,
            date,
            remark 
        });

        await newReceiptOrder.save();

        console.log("newReceiptOrder: ",newReceiptOrder)

        return res.status(201).json({success: true, message:'ReceiptOrder added successfully'})
    } catch (error){
        console.error("Error adding ReceiptOrder: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getReceiptOrder = async (req, res)=>{
    try{
        const receiptOrder = await ReceiptOrder.find();
          const formattedReceiptOrders = receiptOrder.map(p => {
            const amount = p.amount && p.amount.toString ? parseFloat(p.amount.toString()) : p.amount;

      return {
        ...p.toObject(),
        amount,       // convert Mongoose doc to plain object
          // overwrite price with plain number
         
      };
    });

        const customer = await Customer.find();
        const currency = await Currency.find();
        
        return res.status(200).json({success: true, receiptOrder:formattedReceiptOrders, customer, currency }); 
       
    }catch (error){
        console.error('Error fetching receiptOrders: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateReceiptOrder = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {recNumber, customerId, amount, currencyId, date, remark } = req.body;
      
        // Convert decimal price
        const decimalAmount =
                            amount !== undefined && amount !== null && amount !== ''
                              ? mongoose.Types.Decimal128.fromString(amount.toString())
                              : null;

        // update the receiptOrder
        const updatedReceiptOrder = await ReceiptOrder.findByIdAndUpdate(id, {
            recNumber:recNumber, 
            customerId,
            amount:decimalAmount,  
            currencyId,
            date,
            remark 
        },{new:true});

        if(!updatedReceiptOrder) {
            return res.status(400).json({success: false, message:"ReceiptOrder not found"});
        }
        return res.status(200).json({success: true,  message:'ReceiptOrder updated successfully', receiptOrder: updatedReceiptOrder})
    } catch (error) {
        console.log('Error updating ReceiptOrder: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deleteReceiptOrder = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedReceiptOrder = await ReceiptOrder.findByIdAndDelete(id);
        if(!deletedReceiptOrder){
            return res.status(400).json({success: false, message:'ReceiptOrder not found'})
        }
        return res.status(200).json({ success: true, message: 'ReceiptOrder deleted successfully' });
    } catch (error) {
    console.error('Error deleting receiptOrder:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
