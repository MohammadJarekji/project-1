const express = require('express');
const { getAsset, addAsset, updateAsset, deleteAsset,checkSerialNumber } = require('../controllers/assetController');

const router = express.Router();

router.get('/',getAsset);
router.post('/add',addAsset);
router.put('/:id',updateAsset);
router.delete('/:id', deleteAsset);
// Route to check if the serial number exists
router.get('/check-serial/:serialNumber', checkSerialNumber);

module.exports = router;