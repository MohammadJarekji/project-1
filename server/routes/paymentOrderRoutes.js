const express = require('express');
const { getPaymentOrder, addPaymentOrder, updatePaymentOrder, deletePaymentOrder } = require('../controllers/paymentOrderController');

const router = express.Router();

router.get('/',getPaymentOrder);
router.post('/add',addPaymentOrder);
router.put('/:id',updatePaymentOrder);
router.delete('/:id', deletePaymentOrder);

module.exports = router;