const PurchaseOrder = require('../models/purchaseOrderModel');
const ReceiptOrder = require('../models/receiptOrderModel');
const SalesOrder = require('../models/salesOrderModel');
const Customer = require('../models/customerModel');
const Vendor = require('../models/vendorModel');
const PaymentOrder = require('../models/paymentOrderModel');
const Currency = require('../models/currencyModel');


exports.getAllCustomerReports = async (req, res) => {
  try {
    // 1️⃣ Aggregate total sales per customer (convert to USD first)
    const salesAgg = await SalesOrder.aggregate([
      {
        $lookup: {
          from: 'currencies',
          localField: 'currencyId',
          foreignField: '_id',
          as: 'currency',
        },
      },
      { $unwind: { path: '$currency', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          totalAmountInUSD: {
            $multiply: [
              { $toDouble: '$price' },                                // price
              { $toDouble: { $ifNull: ['$currency.convertCurrency', 1] } } // conversion to USD
            ],
          },
        },
      },
      {
        $group: {
          _id: '$customerId',
          totalSales: { $sum: '$totalAmountInUSD' },
        },
      },
    ]);

    // 2️⃣ Aggregate total receipts per customer (convert to USD first)
    const receiptAgg = await ReceiptOrder.aggregate([
      {
        $lookup: {
          from: 'currencies',
          localField: 'currencyId',
          foreignField: '_id',
          as: 'currency',
        },
      },
      { $unwind: { path: '$currency', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          totalAmountInUSD: {
            $multiply: [
              { $toDouble: '$amount' },                               // amount
              { $toDouble: { $ifNull: ['$currency.convertCurrency', 1] } } // conversion to USD
            ],
          },
        },
      },
      {
        $group: {
          _id: '$customerId',
          totalReceipts: { $sum: '$totalAmountInUSD' },
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

exports.getAllVendorReports = async (req, res) => {
  try {
    // 1️⃣ Aggregate total purchase per vendor (convert to USD)
    const purchaseAgg = await PurchaseOrder.aggregate([
      {
        $lookup: {
          from: 'currencies',
          localField: 'currencyId',
          foreignField: '_id',
          as: 'currency',
        },
      },
      { $unwind: { path: '$currency', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          totalAmountInUSD: {
            $multiply: [
              { $toDouble: '$price' },
              { $toDouble: { $ifNull: ['$currency.convertCurrency', 1] } }
            ],
          },
        },
      },
      {
        $group: {
          _id: '$vendorId',
          totalPurchase: { $sum: '$totalAmountInUSD' },
        },
      },
    ]);

    // 2️⃣ Aggregate total payments per vendor (convert to USD)
    const paymentAgg = await PaymentOrder.aggregate([
      {
        $lookup: {
          from: 'currencies',
          localField: 'currencyId',
          foreignField: '_id',
          as: 'currency',
        },
      },
      { $unwind: { path: '$currency', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          totalAmountInUSD: {
            $multiply: [
              { $toDouble: '$amount' },
              { $toDouble: { $ifNull: ['$currency.convertCurrency', 1] } }
            ],
          },
        },
      },
      {
        $group: {
          _id: '$vendorId',
          totalPayments: { $sum: '$totalAmountInUSD' },
        },
      },
    ]);

    // 3️⃣ Create maps for quick lookup
    const purchaseMap = new Map(
      purchaseAgg.map((p) => [p._id.toString(), Number(p.totalPurchase)])
    );
    const paymentMap = new Map(
      paymentAgg.map((p) => [p._id.toString(), Number(p.totalPayments)])
    );

    // 4️⃣ Get all vendors
    const vendors = await Vendor.find();

    // 5️⃣ Build the final report
    const report = vendors.map((vendor) => {
      const idStr = vendor._id.toString();
      const totalPurchase = purchaseMap.get(idStr) || 0;
      const totalPayments = paymentMap.get(idStr) || 0;
      const outstanding = totalPurchase - totalPayments;

      return {
        vendorId: vendor._id,
        name: vendor.name,
        contactName: vendor.contactName,
        contactPhoneNumber: vendor.contactPhoneNumber,
        totalPurchase,
        totalPayments,
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
