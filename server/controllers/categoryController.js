const Category = require('../models/categoryModel');
const User = require('../models/userModel');

exports.addCategory = async (req, res) =>{
    try{
        const {name, code} = req.body;

        // Create a new category
        const newCategory = new Category({
            name,
            code,
        });

        await newCategory.save();
        return res.status(201).json({success: true, message:'Category added successfully'})
    } catch (error){
        console.error("Error adding Category: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getCategory = async (req, res)=>{
    try{
        const category = await Category.find();
        return res.status(200).json({success: true, category}); 
    }catch (error){
        console.error('Error fetching category: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updateCategory = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {name, code} = req.body;

        // update the category
        const updatedCategory = await Category.findByIdAndUpdate(id, {
            name,
            code,
        },{new:true});

        if(!updatedCategory) {
            return res.status(400).json({success: false, message:"Category not found"});
        }
        return res.status(200).json({success: true,  message:'Category updated successfully', category: updatedCategory})
    } catch (error) {
        console.log('Error updating Category: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deleteCategory = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedCategory = await Category.findByIdAndDelete(id);
        if(!deletedCategory){
            return res.status(400).json({success: false, message:'Category not found'})
        }
        return res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
