const User = require('../models/userModel');
const UOM = require('../models/uomModel');
const Product = require('../models/productsModel');
const ASCounter = require('../models/ASCounterModel');
const AssemblyOrder = require('../models/assemblyOrderModel');
const Asset = require('../models/assestModel');
const mongoose = require('mongoose');

async function generateASNumber() {
  const year = new Date().getFullYear();

  let counter = await ASCounter.findOne({ year });

  if (!counter) {
    counter = await ASCounter.create({ year, lastSerial: 0 });
  }

  counter.lastSerial += 1;
  await counter.save();

  const baseSerial = 2500;
  const serialNumber = baseSerial + counter.lastSerial;

  // PO number without year prefix, e.g. PO2501, PO2502
  return `AS${serialNumber}`;
}

exports.addAssembly = async (req, res) =>{
    try{
        const {productId, startDate, endDate, laborHours, status, lines , assetId, hours} = req.body;

            console.log("req: ",req.body)

        // Convert labor Hours
        const decimalLaborHours = mongoose.Types.Decimal128.fromString(laborHours.toString());

        // Convert decimal quantity
        const decimalHours= mongoose.Types.Decimal128.fromString(hours.toString());

         const asNumber = await generateASNumber();

         // Convert each lines item's quantity
    const processedLines = lines.map(item => ({
      productId: item.productId,
      quantity: mongoose.Types.Decimal128.fromString(item.quantity.toString()),
      uomId: item.uomId,
    }));

        // Create a new assemblyOrder
        const newAssemblyOrder = new AssemblyOrder({
            asNumber:asNumber,
            productId,
            startDate,
            endDate,
            laborHours: decimalLaborHours,
            status, 
            lines: processedLines,
            assetId,
            hours: decimalHours,
        });

        await newAssemblyOrder.save();

        console.log("newAssemblyOrder: ",newAssemblyOrder)

        return res.status(201).json({success: true, message:'AssemblyOrder added successfully'})
    } catch (error){
        console.error("Error adding AssemblyOrder: ",error);
        return res.status(500).json({success: false, message:'Server error'});
    }
}

exports.getAssembly = async (req, res)=>{
    try {
    const assemblyOrders = await AssemblyOrder.find().lean();

    // If you want to convert Decimal128 fields back to numbers for client convenience:
    const formattedOrders = assemblyOrders.map(order => ({
      ...order,
      laborHours: parseFloat(order.laborHours.toString()),
      hours: parseFloat(order.hours.toString()),
      lines: order.lines.map(item => ({
        ...item,
        quantity: parseFloat(item.quantity.toString()),
      })),
    }));

    const product = await Product.find();
    const uom = await UOM.find();
    const asset = await Asset.find();

    return res.status(200).json({ success: true, assembly: formattedOrders, product, uom, asset });
  } catch (error) {
    console.error("Error fetching AssemblyOrders:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

exports.updateAssembly = async (req, res) => {
  try {
    const { id } = req.params; // AssemblyOrder ID to update
    const {
      productId,
      startDate,
      endDate,
      laborHours,
      status,
      assetId,
      hours,
      lines
    } = req.body;

    // Convert to Decimal128
    const decimalLaborHours = mongoose.Types.Decimal128.fromString(laborHours.toString());
    const decimalHours = mongoose.Types.Decimal128.fromString(hours.toString());

    // Convert each lines item's quantity
    const processedLines = lines.map(item => ({
      productId: item.productId,
      quantity: mongoose.Types.Decimal128.fromString(item.quantity.toString()),
      uomId: item.uomId,
    }));

    // Find and update
    const updatedOrder = await AssemblyOrder.findByIdAndUpdate(
      id,
      {
        productId,
        startDate,
        endDate,
        laborHours: decimalLaborHours,
        status,
        assetId,
        hours: decimalHours,
        lines: processedLines,
      },
      { new: true } // return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "AssemblyOrder not found" });
    }

    return res.status(200).json({ success: true, message: "AssemblyOrder updated successfully", data: updatedOrder });

  } catch (error) {
    console.error("Error updating AssemblyOrder:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteAssembly = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await AssemblyOrder.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'AssemblyOrder not found' });
    }

    return res.status(200).json({ success: true, message: 'AssemblyOrder deleted successfully' });
  } catch (error) {
    console.error('Error deleting AssemblyOrder:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
