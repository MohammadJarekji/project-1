const express = require('express');
const { getTransfer, addTransfer, updateTransfer, deleteTransfer } = require('../controllers/transferController');

const router = express.Router();

router.get('/',getTransfer);
router.post('/add',addTransfer);
router.put('/:id',updateTransfer);
router.delete('/:id', deleteTransfer);

module.exports = router;