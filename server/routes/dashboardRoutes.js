const express = require('express');
const router = express.Router();
const { getOrderCounts, getTotalProductsInStock, getLast12MonthsData, getTopSellingProducts } = require('../controllers/dashboardController');

router.get('/order-counts', getOrderCounts);
router.get('/products/total-stock', getTotalProductsInStock);
router.get('/last-12-months', getLast12MonthsData);
router.get('/top-selling-products', getTopSellingProducts);

module.exports = router;