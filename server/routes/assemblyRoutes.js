const express = require('express');
const { getAssembly, addAssembly, updateAssembly, deleteAssembly } = require('../controllers/assemblyController');

const router = express.Router();

router.get('/',getAssembly);
router.post('/add',addAssembly);
router.put('/:id',updateAssembly);
router.delete('/:id', deleteAssembly);

module.exports = router;