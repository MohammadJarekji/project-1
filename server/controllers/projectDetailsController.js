const UOM = require('../models/uomModel');
const Project = require('../models/projectModel');
const ProjectDetailsOrder = require('../models/projectDetailsModel');
const Staff = require('../models/staffModel');
const Asset = require('../models/assestModel');
const mongoose = require('mongoose');

exports.addProjectDetails = async (req, res) =>{
    try{
        const {projectId , staff , asset} = req.body;

         // Convert each staff item's hours
    const processedStaff = staff?.map(item => ({
      staffId: item.staffId,
      hours: item.hours !== undefined && item.hours !== null && item.hours !== ''
                                ? mongoose.Types.Decimal128.fromString(item.hours.toString())
                                : null,
    }));

    // Convert each asset item's hours
    const processedAsset = asset?.map(item => ({
      assetId: item.assetId,
      hours: item.hours !== undefined && item.hours !== null && item.hours !== ''
                                ? mongoose.Types.Decimal128.fromString(item.hours.toString())
                                : null,
    }));

        // Create a new projectDetailsOrder
        const newProjectDetailsOrder = new ProjectDetailsOrder({
            projectId, 
            staff: processedStaff,
            asset: processedAsset,

        });

        await newProjectDetailsOrder.save();

        console.log("newProjectDetailsOrder: ",newProjectDetailsOrder)

        return res.status(201).json({success: true, message:'ProjectDetailsOrder added successfully'})
    } catch (error){
        console.error("Error adding ProjectDetailsOrder: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getProjectDetails = async (req, res)=>{
    try {
    const projectDetailsOrders = await ProjectDetailsOrder.find().lean();

    // If you want to convert Decimal128 fields back to numbers for client convenience:
    const formattedOrders = projectDetailsOrders.map(order => ({
      ...order,
      staff: order.staff.map(item => ({
        ...item,
        hours: item.hours != null ? parseFloat(item.hours.toString()) : null,
      })),
       asset: order.asset.map(item => ({
        ...item,
        hours: item.hours != null ? parseFloat(item.hours.toString()) : null,
      })),
    }));

    const project = await Project.find();
    const staff = await Staff.find();
     const asset = await Asset.find();

    return res.status(200).json({ success: true, projectDetails: formattedOrders, project, staff, asset });
  } catch (error) {
    console.error("Error fetching ProjectDetailsOrders:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

exports.updateProjectDetails = async (req, res) => {
  try {
    const { id } = req.params; // The ID of the existing ProjectDetailsOrder document to update
    const { projectId, staff, asset } = req.body;

    // Basic validation
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing project details ID' });
    }
    if (!projectId || !Array.isArray(staff) || !Array.isArray(asset)) {
      return res.status(400).json({ success: false, message: 'Missing or invalid projectId, staff, or asset' });
    }

    // Convert staff hours to Decimal128
    const processedStaff = staff.map(item => ({
      staffId: item.staffId,
      hours: item.hours !== undefined && item.hours !== null && item.hours !== ''
                                ? mongoose.Types.Decimal128.fromString(item.hours.toString())
                                : null,
    }));

    // Convert asset hours to Decimal128
    const processedAsset = asset.map(item => ({
      assetId: item.assetId,
      hours: item.hours !== undefined && item.hours !== null && item.hours !== ''
                                ? mongoose.Types.Decimal128.fromString(item.hours.toString())
                                : null,
    }));

    // Find document and update
    const updatedProjectDetails = await ProjectDetailsOrder.findByIdAndUpdate(
      id,
      {
        projectId,
        staff: processedStaff,
        asset: processedAsset,
      },
      { new: true, runValidators: true } // Return updated doc and run validation
    );

    if (!updatedProjectDetails) {
      return res.status(404).json({ success: false, message: 'ProjectDetailsOrder not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'ProjectDetailsOrder updated successfully',
      data: updatedProjectDetails,
    });
  } catch (error) {
    console.error('Error updating ProjectDetailsOrder:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await ProjectDetailsOrder.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'ProjectDetailsOrder not found' });
    }

    return res.status(200).json({ success: true, message: 'ProjectDetailsOrder deleted successfully' });
  } catch (error) {
    console.error('Error deleting ProjectDetailsOrder:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
