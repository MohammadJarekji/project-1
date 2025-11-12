const PurchaseOrder = require('../models/purchaseOrderModel');
const ReceiptOrder = require('../models/receiptOrderModel');
const SalesOrder = require('../models/salesOrderModel');
const Customer = require('../models/customerModel');
const Vendor = require('../models/vendorModel');


exports.getAllCustomerReports = async (req, res) => {
  try {
    // 1️⃣ Aggregate total sales per customer (sum of quantity * price)
    const salesAgg = await SalesOrder.aggregate([
      {
        $group: {
          _id: '$customerId',
          totalSales: { $sum: '$price' },
        },
      },
    ]);

    // 2️⃣ Aggregate total receipts per customer (sum of amount)
    const receiptAgg = await ReceiptOrder.aggregate([
      {
        $group: {
          _id: '$customerId',
          totalReceipts: { $sum: '$amount' },
        },
      },
    ]);

    // 3️⃣ Create maps for quick lookup
    const salesMap = new Map(
      salesAgg.map((s) => [s._id.toString(), Number(s.totalSales)])
    );
    const receiptMap = new Map(
      receiptAgg.map((r) => [r._id.toString(), Number(r.totalReceipts)])
    );

    // 4️⃣ Get all customers
    const customers = await Customer.find();

    // 5️⃣ Build the final report
    const report = customers.map((cust) => {
      const idStr = cust._id.toString();
      const totalSales = salesMap.get(idStr) || 0;
      const totalReceipts = receiptMap.get(idStr) || 0;
      const outstanding = totalSales - totalReceipts;

      return {
        customerId: cust._id,
        name: cust.name,
        contactName: cust.contactName,
        contactPhoneNumber: cust.contactPhoneNumber,
        totalSales,
        totalReceipts,
        outstanding,
      };
    });

    // 6️⃣ Return the result
    res.status(200).json({
      success: true,
      count: report.length,
      data: report,
    });

   
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
