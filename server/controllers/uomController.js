const UOM = require('../models/uomModel');
const User = require('../models/userModel');

exports.addUOM = async (req, res) =>{
    try{
        const {name, code} = req.body;

        // Create a new uom
        const newUOM = new UOM({
            name,
            code,
        });

        await newUOM.save();
        return res.status(201).json({success: true, message:'UOM added successfully'})
    } catch (error){
        console.error("Error adding UOM: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getUOM = async (req, res)=>{
    try{
        const uom = await UOM.find();
        return res.status(200).json({success: true, uom}); 
    }catch (error){
        console.error('Error fetching uom: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateUOM = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {name, code} = req.body;

        // update the uom
        const updatedUOM = await UOM.findByIdAndUpdate(id, {
            name,
            code,
        },{new:true});

        if(!updatedUOM) {
            return res.status(400).json({success: false, message:"UOM not found"});
        }
        return res.status(200).json({success: true,  message:'UOM updated successfully', uom: updatedUOM})
    } catch (error) {
        console.log('Error updating UOM: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deleteUOM = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedUOM = await UOM.findByIdAndDelete(id);
        if(!deletedUOM){
            return res.status(400).json({success: false, message:'UOM not found'})
        }
        return res.status(200).json({ success: true, message: 'UOM deleted successfully' });
    } catch (error) {
    console.error('Error deleting uom:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
