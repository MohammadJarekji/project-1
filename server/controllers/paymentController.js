const Payment = require('../models/paymentModel');
const User = require('../models/userModel');

exports.addPayment = async (req, res) =>{
    try{
        const {name, code} = req.body;

        // Create a new payment
        const newPayment = new Payment({
            name,
            code,
        });

        await newPayment.save();
        return res.status(201).json({success: true, message:'Payment added successfully'})
    } catch (error){
        console.error("Error adding Payment: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getPayment = async (req, res)=>{
    try{
        const payment = await Payment.find();
        return res.status(200).json({success: true, payment}); 
    }catch (error){
        console.error('Error fetching payment: ', error);
        return res.status(500).json({success: false, message:'Server error'})
    }
}

exports.updatePayment = async (req, res)=>{
    try{
        const{ id } = req.params;
        const {name, code} = req.body;

        // update the payment
        const updatedPayment = await Payment.findByIdAndUpdate(id, {
            name,
            code,
        },{new:true});

        if(!updatedPayment) {
            return res.status(400).json({success: false, message:"Payment not found"});
        }
        return res.status(200).json({success: true,  message:'Payment updated successfully', payment: updatedPayment})
    } catch (error) {
        console.log('Error updating Payment: ',error);
        return res.status(500).json({success:false, message:"Server error"});
    }
}

exports.deletePayment = async (req, res)=>{
    try{
        const {id} = req.params;

         const deletedPayment = await Payment.findByIdAndDelete(id);
        if(!deletedPayment){
            return res.status(400).json({success: false, message:'Payment not found'})
        }
        return res.status(200).json({ success: true, message: 'Payment deleted successfully' });
    } catch (error) {
    console.error('Error deleting payment:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
