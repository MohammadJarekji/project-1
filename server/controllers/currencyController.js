const Currency = require('../models/currencyModel');
const User = require('../models/userModel');

exports.addCurrency = async (req, res) =>{
    try{
        const {name, code} = req.body;

        // Create a new currency
        const newCurrency = new Currency({
            name,
            code,
        });

        await newCurrency.save();
        return res.status(201).json({success: true, message:'Currency added successfully'})
    } catch (error){
        console.error("Error adding Currency: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getCurrency = async (req, res)=>{
    try{
        const currency = await Currency.find();
        return res.status(200).json({success: true, currency}); 
    }catch (error){
        console.error('Error fetching currency: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateCurrency = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {name, code} = req.body;

        // update the currency
        const updatedCurrency = await Currency.findByIdAndUpdate(id, {
            name,
            code,
        },{new:true});

        if(!updatedCurrency) {
            return res.status(400).json({success: false, message:"Currency not found"});
        }
        return res.status(200).json({success: true,  message:'Currency updated successfully', currency: updatedCurrency})
    } catch (error) {
        console.log('Error updating Currency: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deleteCurrency = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedCurrency = await Currency.findByIdAndDelete(id);
        if(!deletedCurrency){
            return res.status(400).json({success: false, message:'Currency not found'})
        }
        return res.status(200).json({ success: true, message: 'Currency deleted successfully' });
    } catch (error) {
    console.error('Error deleting currency:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
