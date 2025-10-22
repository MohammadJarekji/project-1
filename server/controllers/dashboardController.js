const SalesOrder = require('../models/salesOrderModel');
const PurchaseOrder = require('../models/purchaseOrderModel');
const ReceiptOrder = require('../models/receiptOrderModel');
const Product = require('../models/productsModel'); // adjust path as needed

exports.getOrderCounts = async (req, res) => {
  try {
    const salesCount = await SalesOrder.countDocuments();
    const purchaseCount = await PurchaseOrder.countDocuments();
    const receiptCount = await ReceiptOrder.countDocuments();

    res.json({
      salesOrders: salesCount,
      purchaseOrders: purchaseCount,
      receiptOrders: receiptCount,
    });
  } catch (error) {
    console.error('Failed to fetch order counts:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Controller to get total products in stock
exports.getTotalProductsInStock = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $match: {
          quantity: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          totalStock: {
            $sum: {
              $convert: {
                input: "$quantity",
                to: "double",
                onError: 0,
                onNull: 0
              }
            }
          }
        }
      }
    ]);

    const totalStock = result.length > 0 ? result[0].totalStock : 0;
    res.json({ totalStock });
  } catch (error) {
    console.error('Error fetching total products in stock:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getLast12MonthsData = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const aggregateByMonth = async (Model, dateField) => {
      return Model.aggregate([
        {
          $match: {
            [dateField]: { $gte: startDate, $lte: now }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: `$${dateField}` },
              month: { $month: `$${dateField}` }
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            year: '$_id.year',
            month: '$_id.month',
            count: 1
          }
        },
        {
          $sort: { year: 1, month: 1 }
        }
      ]);
    };

    const salesData   = await aggregateByMonth(SalesOrder,   'createdAt');
    const purchaseData= await aggregateByMonth(PurchaseOrder,'createdAt');
    const receiptData = await aggregateByMonth(ReceiptOrder, 'createdAt');

    res.json({ salesData, purchaseData, receiptData });
  }
  catch (error) {
    console.error('Error fetching last 12 months data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await SalesOrder.aggregate([
      {
        $group: {
          _id: "$productId",
          totalSold: { $sum: { $toDouble: "$quantity" } },
        }
      },
      {
        $sort: { totalSold: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: "$product"
      },
      {
        $project: {
          _id: 0,
          productName: "$product.name",
          totalSold: 1
        }
      }
    ]);

    res.json({ topProducts });

  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    res.status(500).json({ message: "Server error" });
  }
};