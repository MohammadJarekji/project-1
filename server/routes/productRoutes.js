const express = require('express');
const { getProducts, addProduct, updateProduct, deleteProduct, getLowStockProducts } = require('../controllers/productController');

const router = express.Router();

router.get('/',getProducts);
router.post('/add',addProduct);
router.put('/:id',updateProduct);
router.delete('/:id', deleteProduct);
router.get('/low-stock', getLowStockProducts);

module.exports = router;