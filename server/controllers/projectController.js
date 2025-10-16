const Project = require('../models/projectModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

exports.addProject = async (req, res) =>{
    try{
        const {name, location, type, cost, fromDate, toDate} = req.body;

        // Convert decimal credit limit
        const decimalCost = mongoose.Types.Decimal128.fromString(cost.toString());

        // Create a new project
        const newProject = new Project({
            name,
            location,
            type,
            cost: decimalCost,
            fromDate,
            toDate,
        });

        await newProject.save();
        return res.status(201).json({success: true, message:'Project added successfully'})
    } catch (error){
        console.error("Error adding Project: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getProject = async (req, res)=>{
    try{
        const project = await Project.find();
                const formattedProject = project.map(v => {
      const cost = v.cost && v.cost.toString ? parseFloat(v.cost.toString()) : v.cost;

      return {
        ...v.toObject(),  // convert Mongoose doc to plain object
        cost,            // overwrite price with plain number
      };
        });
        return res.status(200).json({success: true, project: formattedProject}); 
    }catch (error){
        console.error('Error fetching project: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateProject = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {name, location, type, cost, fromDate, toDate} = req.body;

        // Convert decimal credit limit
        const decimalCost = mongoose.Types.Decimal128.fromString(cost.toString());

        // update the project
        const updatedProject = await Project.findByIdAndUpdate(id, {
            name,
            location,
            type,
            cost:decimalCost,
            fromDate,
            toDate,
        },{new:true});

        if(!updatedProject) {
            return res.status(400).json({success: false, message:"Project not found"});
        }
        return res.status(200).json({success: true,  message:'Project updated successfully', project: updatedProject})
    } catch (error) {
        console.log('Error updating Project: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deleteProject = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedProject = await Project.findByIdAndDelete(id);
        if(!deletedProject){
            return res.status(400).json({success: false, message:'Project not found'})
        }
        return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
