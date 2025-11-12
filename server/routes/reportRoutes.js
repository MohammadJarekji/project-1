const express = require('express');
const router = express.Router();
const { getAllCustomerReports } = require('../controllers/reportsController');

router.get('/customers', getAllCustomerReports);


module.exports = router;