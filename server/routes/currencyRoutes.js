const express = require('express');
const { getCurrency, addCurrency, updateCurrency, deleteCurrency } = require('../controllers/currencyController');

const router = express.Router();

router.get('/',getCurrency);
router.post('/add',addCurrency);
router.put('/:id',updateCurrency);
router.delete('/:id', deleteCurrency);

module.exports = router;