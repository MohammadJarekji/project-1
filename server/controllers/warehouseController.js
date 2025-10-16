const Warehouse = require('../models/warehouseModel');
const User = require('../models/userModel');

exports.addWarehouse = async (req, res) =>{
    try{
        const {name, code, location} = req.body;

        // Create a new warehouse
        const newWarehouse = new Warehouse({
            name,
            code,
            location
        });

        await newWarehouse.save();
        return res.status(201).json({success: true, message:'Warehouse added successfully'})
    } catch (error){
        console.error("Error adding Warehouse: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getWarehouse = async (req, res)=>{
    try{
        const warehouse = await Warehouse.find();
        return res.status(200).json({success: true, warehouse}); 
    }catch (error){
        console.error('Error fetching warehouse: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateWarehouse = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {name, code, location} = req.body;

        // update the warehouse
        const updatedWarehouse = await Warehouse.findByIdAndUpdate(id, {
            name,
            code,
            location,
        },{new:true});

        if(!updatedWarehouse) {
            return res.status(400).json({success: false, message:"Warehouse not found"});
        }
        return res.status(200).json({success: true,  message:'Warehouse updated successfully', warehouse: updatedWarehouse})
    } catch (error) {
        console.log('Error updating Warehouse: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deleteWarehouse = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedWarehouse = await Warehouse.findByIdAndDelete(id);
        if(!deletedWarehouse){
            return res.status(400).json({success: false, message:'Warehouse not found'})
        }
        return res.status(200).json({ success: true, message: 'Warehouse deleted successfully' });
    } catch (error) {
    console.error('Error deleting warehouse:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
