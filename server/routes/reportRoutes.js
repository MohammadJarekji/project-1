const express = require('express');
const router = express.Router();
const { getAllCustomerReports, getAllVendorReports } = require('../controllers/reportsController');

router.get('/customers', getAllCustomerReports);
router.get('/vendors', getAllVendorReports);


module.exports = router;