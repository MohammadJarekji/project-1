const express = require('express');
const { getAsset, addAsset, updateAsset, deleteAsset } = require('../controllers/assetController');

const router = express.Router();

router.get('/',getAsset);
router.post('/add',addAsset);
router.put('/:id',updateAsset);
router.delete('/:id', deleteAsset);

module.exports = router;