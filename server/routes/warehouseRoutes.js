const express = require('express');
const { getWarehouse, addWarehouse, updateWarehouse, deleteWarehouse } = require('../controllers/warehouseController');

const router = express.Router();

router.get('/',getWarehouse);
router.post('/add',addWarehouse);
router.put('/:id',updateWarehouse);
router.delete('/:id', deleteWarehouse);

module.exports = router;