const express = require('express');
const { getVendor, addVendor, updateVendor, deleteVendor } = require('../controllers/vendorController');

const router = express.Router();

router.get('/',getVendor);
router.post('/add',addVendor);
router.put('/:id',updateVendor);
router.delete('/:id', deleteVendor);

module.exports = router;