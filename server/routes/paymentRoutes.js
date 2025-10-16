const express = require('express');
const { getPayment, addPayment, updatePayment, deletePayment } = require('../controllers/paymentController');

const router = express.Router();

router.get('/',getPayment);
router.post('/add',addPayment);
router.put('/:id',updatePayment);
router.delete('/:id', deletePayment);

module.exports = router;