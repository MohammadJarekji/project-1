const express = require('express');
const { getReceiptOrder, addReceiptOrder, updateReceiptOrder, deleteReceiptOrder } = require('../controllers/receiptOrderController');

const router = express.Router();

router.get('/',getReceiptOrder);
router.post('/add',addReceiptOrder);
router.put('/:id',updateReceiptOrder);
router.delete('/:id', deleteReceiptOrder);

module.exports = router;