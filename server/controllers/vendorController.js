const Vendor = require('../models/vendorModel');
const User = require('../models/userModel');
const Payment = require('../models/paymentModel')
const mongoose = require('mongoose');

exports.addVendor = async (req, res) =>{
    try{
        const {name, address, contactName, contactPhoneNumber, paymentId, creditLimit, remark} = req.body;

        // Convert decimal credit limit
        const decimalCreditLimit = mongoose.Types.Decimal128.fromString(creditLimit.toString());

        // Create a new vendor
        const newVendor = new Vendor({
            name, 
            address, 
            contactName, 
            contactPhoneNumber, 
            paymentId,
            creditLimit:decimalCreditLimit,
            remark 
        });

        await newVendor.save();
        return res.status(201).json({success: true, message:'Vendor added successfully'})
    } catch (error){
        console.error("Error adding Vendor: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getVendor = async (req, res)=>{
    try{
        const vendor = await Vendor.find();
        const payment = await Payment.find();
        const formattedVendor = vendor.map(v => {
      const creditLimit = v.creditLimit && v.creditLimit.toString ? parseFloat(v.creditLimit.toString()) : v.creditLimit;

      return {
        ...v.toObject(),  // convert Mongoose doc to plain object
        creditLimit,            // overwrite price with plain number
      };
        });
        return res.status(200).json({success: true, vendor:formattedVendor, payment}); 
    }catch (error){
        console.error('Error fetching vendor: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateVendor = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {name, address, contactName, contactPhoneNumber, paymentId, creditLimit, remark} = req.body;

        // Convert decimal credit limit
        const decimalCreditLimit = mongoose.Types.Decimal128.fromString(creditLimit.toString());

        // update the vendor
        const updatedVendor = await Vendor.findByIdAndUpdate(id, {
            name, 
            address, 
            contactName, 
            contactPhoneNumber, 
            paymentId,
            creditLimit:decimalCreditLimit,
            remark 
        },{new:true});

        if(!updatedVendor) {
            return res.status(400).json({success: false, message:"Vendor not found"});
        }
        return res.status(200).json({success: true,  message:'Vendor updated successfully', vendor: updatedVendor})
    } catch (error) {
        console.log('Error updating Vendor: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deleteVendor = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedVendor = await Vendor.findByIdAndDelete(id);
        if(!deletedVendor){
            return res.status(400).json({success: false, message:'Vendor not found'})
        }
        return res.status(200).json({ success: true, message: 'Vendor deleted successfully' });
    } catch (error) {
    console.error('Error deleting vendor:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
