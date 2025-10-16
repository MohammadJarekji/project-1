const Asset = require('../models/assestModel');
const Vendor = require('../models/vendorModel');
const Staff = require('../models/staffModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

exports.addAsset = async (req, res) =>{
    try{
        const {serialNumber, name, assetType, acquisitionCost, vendorId, location, 
            staffId, depreciationMethod, warrantyExpiry, maintenanceDate, maintenanceHour, insurance, status, attachment, remark} = req.body;

        // Convert decimal acquisition cost
        const decimalAcquisitionCost = mongoose.Types.Decimal128.fromString(acquisitionCost.toString());

        // Create a new asset
        const newAsset = new Asset({
            serialNumber,
            name,
            assetType,
            acquisitionCost:decimalAcquisitionCost,
            vendorId,
            location,
            staffId,
            depreciationMethod,
            warrantyExpiry,
            maintenanceDate,
            maintenanceHour,
            insurance,
            status,
            attachment,
            remark
        });

        await newAsset.save();
        return res.status(201).json({success: true, message:'Asset added successfully'})
    } catch (error){
        console.error("Error adding Asset: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getAsset = async (req, res)=>{
    try{
        const asset = await Asset.find();
        const vendor = await Vendor.find();
        const staff = await Staff.find();
        const formattedAsset = asset.map(v => {
      const acquisitionCost = v.acquisitionCost && v.acquisitionCost.toString ? parseFloat(v.acquisitionCost.toString()) : v.acquisitionCost;

      return {
        ...v.toObject(),   // convert Mongoose doc to plain object
        acquisitionCost,       // overwrite price with plain number
      };
        });
        return res.status(200).json({success: true, asset:formattedAsset, vendor, staff}); 
    }catch (error){
        console.error('Error fetching asset: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateAsset = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {serialNumber, name, assetType, acquisitionCost, vendorId, location, 
            staffId, depreciationMethod, warrantyExpiry, maintenanceDate, maintenanceHour, insurance, status, attachment, remark} = req.body;

        // Convert decimal acquisition cost
        const decimalAcquisitionCost = mongoose.Types.Decimal128.fromString(acquisitionCost.toString());

        // update the asset
        const updatedAsset = await Asset.findByIdAndUpdate(id, {            
            serialNumber,
            name,
            assetType,
            acquisitionCost:decimalAcquisitionCost,
            vendorId,
            location,
            staffId,
            depreciationMethod,
            warrantyExpiry,
            maintenanceDate,
            maintenanceHour,
            insurance,
            status,
            attachment,
            remark
        },{new:true});

        if(!updatedAsset) {
            return res.status(400).json({success: false, message:"Asset not found"});
        }
        return res.status(200).json({success: true,  message:'Asset updated successfully', asset: updatedAsset})
    } catch (error) {
        console.log('Error updating Asset: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deleteAsset = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedAsset = await Asset.findByIdAndDelete(id);
        if(!deletedAsset){
            return res.status(400).json({success: false, message:'Asset not found'})
        }
        return res.status(200).json({ success: true, message: 'Asset deleted successfully' });
    } catch (error) {
    console.error('Error deleting asset:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
