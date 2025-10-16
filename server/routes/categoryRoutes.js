const express = require('express');
const { getCategory, addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

const router = express.Router();

router.get('/',getCategory);
router.post('/add',addCategory);
router.put('/:id',updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;