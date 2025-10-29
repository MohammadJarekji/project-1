const UOM = require('../models/uomModel');
const Product = require('../models/productsModel');
const DieselOrder = require('../models/dieselModel');
const Asset = require('../models/assestModel');
const mongoose = require('mongoose');

exports.addDiesel = async (req, res) =>{
    try{
        const {productId , asset, uomId, machineCounter, averageCost} = req.body;

    // Convert machine counter
    const decimalmachineCounter =
                        machineCounter !== undefined && machineCounter !== null && machineCounter !== ''
                          ? mongoose.Types.Decimal128.fromString(machineCounter.toString())
                          : null;

    // Convert average cost
    const decimalaverageCost =
                        averageCost !== undefined && averageCost !== null && averageCost !== ''
                          ? mongoose.Types.Decimal128.fromString(averageCost.toString())
                          : null;

    // Convert each asset item's hours
    const processedAsset = asset.map(item => ({
      assetId: item.assetId,
      quantity: item.quantity !== undefined && item.quantity !== null && item.quantity !== ''
                                ? mongoose.Types.Decimal128.fromString(item.quantity.toString())
                                : null,
    }));

        // Create a new dieselOrder
        const newDieselOrder = new DieselOrder({
            productId, 
            asset: processedAsset,
            uomId,
            machineCounter:decimalmachineCounter,
            averageCost:decimalmachineCounter,
        });

        await newDieselOrder.save();

        console.log("newDieselOrder: ",newDieselOrder)

        return res.status(201).json({success: true, message:'DieselOrder added successfully'})
    } catch (error){
        console.error("Error adding DieselOrder: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getDiesel = async (req, res)=>{
    try {
    const dieselOrders = await DieselOrder.find().lean();
          console.log(dieselOrders)
    // If you want to convert Decimal128 fields back to numbers for client convenience:
    const formattedOrders = dieselOrders.map(order => ({
      ...order,
       machineCounter: order.machineCounter ? parseFloat(order.machineCounter.toString()) : order.machineCounter,
        // hours: item.hours != null ? parseFloat(item.hours.toString()) : null,
    averageCost: order.averageCost ? parseFloat(order.averageCost.toString()) : order.averageCost,
       asset: order.asset.map(item => ({
        ...item,
       quantity: item.quantity ? parseFloat(item.quantity.toString()) : 0,
   
      })),
    }));

    const product = await Product.find();
    const asset = await Asset.find();
    const uom = await UOM.find();

    return res.status(200).json({ success: true, diesel: formattedOrders, product, asset, uom });
  } catch (error) {
    console.error("Error fetching DieselOrders:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

exports.updateDiesel = async (req, res) => {
  try {
    const { id } = req.params; // The ID of the existing DieselOrder document to update
     const {productId , asset, uomId, machineCounter, averageCost} = req.body;

     // Convert machine counter
    const decimalmachineCounter =
                        machineCounter !== undefined && machineCounter !== null && machineCounter !== ''
                          ? mongoose.Types.Decimal128.fromString(machineCounter.toString())
                          : null;

    // Convert average cost
    const decimalaverageCost =
                        averageCost !== undefined && averageCost !== null && averageCost !== ''
                          ? mongoose.Types.Decimal128.fromString(averageCost.toString())
                          : null;

    // Basic validation
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing project details ID' });
    }

    // Convert asset hours to Decimal128
    const processedAsset = asset.map(item => ({
      assetId: item.assetId,
      quantity: item.quantity !== undefined && item.quantity !== null && item.quantity !== ''
                                ? mongoose.Types.Decimal128.fromString(item.quantity.toString())
                                : null,
      
    }));

    // Find document and update
    const updatedDiesel = await DieselOrder.findByIdAndUpdate(
      id,
      {
        productId,
        asset: processedAsset,
        uomId,
        machineCounter: decimalmachineCounter,
        averageCost: decimalaverageCost,

      },
      { new: true, runValidators: true } // Return updated doc and run validation
    );

    if (!updatedDiesel) {
      return res.status(404).json({ success: false, message: 'DieselOrder not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'DieselOrder updated successfully',
      data: updatedDiesel,
    });
  } catch (error) {
    console.error('Error updating DieselOrder:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteDiesel = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await DieselOrder.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'DieselOrder not found' });
    }

    return res.status(200).json({ success: true, message: 'DieselOrder deleted successfully' });
  } catch (error) {
    console.error('Error deleting DieselOrder:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
