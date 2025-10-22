const express = require('express');
const { getVendor, addVendor, updateVendor, deleteVendor, getVendorsCount } = require('../controllers/vendorController');

const router = express.Router();

router.get('/',getVendor);
router.post('/add',addVendor);
router.put('/:id',updateVendor);
router.delete('/:id', deleteVendor);
router.get('/count',getVendorsCount);

module.exports = router;