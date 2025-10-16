const express = require('express');
const { getPurchaseOrder, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } = require('../controllers/purchaseOrderController');

const router = express.Router();

router.get('/',getPurchaseOrder);
router.post('/add',addPurchaseOrder);
router.put('/:id',updatePurchaseOrder);
router.delete('/:id', deletePurchaseOrder);

module.exports = router;