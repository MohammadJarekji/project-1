const express = require('express');
const { getCustomer, addCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');

const router = express.Router();

router.get('/',getCustomer);
router.post('/add',addCustomer);
router.put('/:id',updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;