const express = require('express');
const { getUOM, addUOM, updateUOM, deleteUOM } = require('../controllers/uomController');

const router = express.Router();

router.get('/',getUOM);
router.post('/add',addUOM);
router.put('/:id',updateUOM);
router.delete('/:id', deleteUOM);

module.exports = router;