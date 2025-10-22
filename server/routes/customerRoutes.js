const express = require('express');
const { getCustomer, addCustomer, updateCustomer, deleteCustomer, getCustomerCount } = require('../controllers/customerController');

const router = express.Router();

router.get('/',getCustomer);
router.post('/add',addCustomer);
router.put('/:id',updateCustomer);
router.delete('/:id', deleteCustomer);
router.get('/count',getCustomerCount);

module.exports = router;