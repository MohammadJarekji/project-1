const Staff = require('../models/staffModel');
const User = require('../models/userModel');

exports.addStaff = async (req, res) =>{
    try{
        const {name, role, dob, phoneNumber, joinedDate, hireDate} = req.body;

        // Create a new staff
        const newStaff = new Staff({
            name,
            role, 
            dob, 
            phoneNumber, 
            joinedDate, 
            hireDate
        });

        await newStaff.save();
        return res.status(201).json({success: true, message:'Staff added successfully'})
    } catch (error){
        console.error("Error adding Staff: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getStaff = async (req, res)=>{
    try{
        const staff = await Staff.find();
        return res.status(200).json({success: true, staff}); 
    }catch (error){
        console.error('Error fetching staff: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateStaff = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {name, role, dob, phoneNumber, joinedDate, hireDate} = req.body;

        // update the staff
        const updatedStaff = await Staff.findByIdAndUpdate(id, {
            name,
            role, 
            dob, 
            phoneNumber, 
            joinedDate, 
            hireDate
        },{new:true});

        if(!updatedStaff) {
            return res.status(400).json({success: false, message:"Staff not found"});
        }
        return res.status(200).json({success: true,  message:'Staff updated successfully', staff: updatedStaff})
    } catch (error) {
        console.log('Error updating Staff: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deleteStaff = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedStaff = await Staff.findByIdAndDelete(id);
        if(!deletedStaff){
            return res.status(400).json({success: false, message:'Staff not found'})
        }
        return res.status(200).json({ success: true, message: 'Staff deleted successfully' });
    } catch (error) {
    console.error('Error deleting staff:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
