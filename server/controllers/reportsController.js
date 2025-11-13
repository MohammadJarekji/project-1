const PurchaseOrder = require('../models/purchaseOrderModel');
const ReceiptOrder = require('../models/receiptOrderModel');
const SalesOrder = require('../models/salesOrderModel');
const Customer = require('../models/customerModel');
const Vendor = require('../models/vendorModel');
const PaymentOrder = require('../models/paymentOrderModel');
const Currency = require('../models/currencyModel');


exports.getAllCustomerReports = async (req, res) => {
  try {
    // 1️⃣ Get currency conversion rates
    const currencyRates = await Currency.find().lean();
    const currencyMap = new Map(
      currencyRates.map((currency) => [currency._id.toString(), Number(currency.convertCurrency)])
    );

    // 2️⃣ Get all sales orders and convert to USD
    const salesOrders = await SalesOrder.find().lean();
    const salesOrdersUSD = salesOrders.map((so) => {
      const rate = currencyMap.get(so.currencyId?.toString()) || 1;
      return {
        customerId: so.customerId.toString(),
        soNumber: so.soNumber,
        totalUSD: Number(so.price) * rate,
      };
    });

    // 3️⃣ Get all receipt orders and convert to USD
    const receiptOrders = await ReceiptOrder.find().lean();
    const receiptOrdersUSD = receiptOrders.map((ro) => {
      const rate = currencyMap.get(ro.currencyId?.toString()) || 1;
      return {
        customerId: ro.customerId.toString(),
        recNumber: ro.recNumber,
        totalUSD: Number(ro.amount) * rate,
      };
    });

    // 4️⃣ Get all customers
    const customers = await Customer.find().lean();

    // 5️⃣ Build the nested report
    const report = customers.map((cust) => {
      const custId = cust._id.toString();

      const customerSales = salesOrdersUSD.filter((so) => so.customerId === custId);
      const customerReceipts = receiptOrdersUSD.filter((ro) => ro.customerId === custId);

      const totalSales = customerSales.reduce((sum, so) => sum + so.totalUSD, 0);
      const totalReceipts = customerReceipts.reduce((sum, ro) => sum + ro.totalUSD, 0);
      const outstanding = totalSales - totalReceipts;

      return {
        customerId: cust._id,
        customerName: cust.name,
        salesOrders: customerSales,
        receiptOrders: customerReceipts,
        totalSales,
        totalReceipts,
        outstanding,
      };
    });

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
    // 1️⃣ Get currency conversion rates
    const currencyRates = await Currency.find().lean();
    const currencyMap = new Map(
      currencyRates.map((currency) => [currency._id.toString(), Number(currency.convertCurrency)])
    );

    // 2️⃣ Get all purchase orders and convert to USD
    const purchaseOrders = await PurchaseOrder.find().lean();
    const purchaseOrdersUSD = purchaseOrders.map((po) => {
      const rate = currencyMap.get(po.currencyId?.toString()) || 1;
      return {
        vendorId: po.vendorId.toString(),
        poNumber: po.poNumber,
        totalUSD: Number(po.price) * rate,
      };
    });

    // 3️⃣ Get all payment orders and convert to USD
    const paymentOrders = await PaymentOrder.find().lean();
    const paymentOrdersUSD = paymentOrders.map((po) => {
      const rate = currencyMap.get(po.currencyId?.toString()) || 1;
      return {
        vendorId: po.vendorId.toString(),
        payNumber: po.payNumber,
        totalUSD: Number(po.amount) * rate,
      };
    });

    // 4️⃣ Get all vendors
    const vendors = await Vendor.find().lean();

    // 5️⃣ Build the nested report
    const report = vendors.map((vendor) => {
      const vendorId = vendor._id.toString();

      const vendorPurchases = purchaseOrdersUSD.filter((po) => po.vendorId === vendorId);
      const vendorPayments = paymentOrdersUSD.filter((po) => po.vendorId === vendorId);

      const totalPurchases = vendorPurchases.reduce((sum, po) => sum + po.totalUSD, 0);
      const totalPayments = vendorPayments.reduce((sum, po) => sum + po.totalUSD, 0);
      const outstanding = totalPurchases - totalPayments;

      return {
        vendorId: vendor._id,
        vendorName: vendor.name,
        purchaseOrders: vendorPurchases,
        paymentOrders: vendorPayments,
        totalPurchases,
        totalPayments,
        outstanding,
      };
    });

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
