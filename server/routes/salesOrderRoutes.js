const express = require('express');
const { getSalesOrder, addSalesOrder, updateSalesOrder, deleteSalesOrder } = require('../controllers/salesOrderController');

const router = express.Router();

router.get('/',getSalesOrder);
router.post('/add',addSalesOrder);
router.put('/:id',updateSalesOrder);
router.delete('/:id', deleteSalesOrder);

module.exports = router;