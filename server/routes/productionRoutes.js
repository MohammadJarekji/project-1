const express = require('express');
const { getProduction, addProduction, updateProduction, deleteProduction } = require('../controllers/productionController');

const router = express.Router();

router.get('/',getProduction);
router.post('/add',addProduction);
router.put('/:id',updateProduction);
router.delete('/:id', deleteProduction);

module.exports = router;