const Customer = require('../models/customerModel');
const User = require('../models/userModel');
const Payment = require('../models/paymentModel')
const mongoose = require('mongoose');

exports.addCustomer = async (req, res) =>{
    try{
        const {name, address, contactName, contactPhoneNumber, vatnum, creditLimit, paymentId, salesRegion, remark} = req.body;

        // Convert decimal credit limit
        const decimalCreditLimit = mongoose.Types.Decimal128.fromString(creditLimit.toString());

        // Convert decimal VAT Number
        const decimalVatNum = mongoose.Types.Decimal128.fromString(vatnum.toString());

        // Create a new customer
        const newCustomer = new Customer({
            name, 
            address, 
            contactName, 
            contactPhoneNumber,
            vatnum:decimalVatNum,
            creditLimit:decimalCreditLimit, 
            paymentId,
            salesRegion,
            remark 
        });

        await newCustomer.save();
        return res.status(201).json({success: true, message:'Customer added successfully'})
    } catch (error){
        console.error("Error adding Customer: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getCustomer = async (req, res)=>{
    try{
        const customer = await Customer.find();
        const payment = await Payment.find();
        const formattedCustomer = customer.map(v => {
      const creditLimit = v.creditLimit && v.creditLimit.toString ? parseFloat(v.creditLimit.toString()) : v.creditLimit;
      const vatnum = v.vatnum && v.vatnum.toString ? parseFloat(v.vatnum.toString()) : v.vatnum;

      return {
        ...v.toObject(),   // convert Mongoose doc to plain object
        creditLimit,       // overwrite price with plain number
        vatnum,            // overwrite price with plain number
      };
        });
        return res.status(200).json({success: true, customer:formattedCustomer, payment}); 
    }catch (error){
        console.error('Error fetching customer: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateCustomer = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {name, address, contactName, contactPhoneNumber, vatnum, creditLimit, paymentId, salesRegion, remark} = req.body;

        // Convert decimal credit limit
        const decimalCreditLimit = mongoose.Types.Decimal128.fromString(creditLimit.toString());

        // Convert decimal VAT Number
        const decimalVatNum = mongoose.Types.Decimal128.fromString(vatnum.toString());

        // update the customer
        const updatedCustomer = await Customer.findByIdAndUpdate(id, {
            name, 
            address, 
            contactName, 
            contactPhoneNumber,
            vatnum:decimalVatNum,
            creditLimit:decimalCreditLimit, 
            paymentId,
            salesRegion,
            remark 
        },{new:true});

        if(!updatedCustomer) {
            return res.status(400).json({success: false, message:"Customer not found"});
        }
        return res.status(200).json({success: true,  message:'Customer updated successfully', customer: updatedCustomer})
    } catch (error) {
        console.log('Error updating Customer: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deleteCustomer = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedCustomer = await Customer.findByIdAndDelete(id);
        if(!deletedCustomer){
            return res.status(400).json({success: false, message:'Customer not found'})
        }
        return res.status(200).json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
    console.error('Error deleting customer:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

exports.getCustomerCount = async (req, res) => {
  try {
    const count = await Customer.countDocuments(); // Count all customers
    res.json({ count });
  } catch (error) {
    console.error('Error fetching customer count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
