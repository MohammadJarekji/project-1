const express = require('express');
const { getStaff, addStaff, updateStaff, deleteStaff } = require('../controllers/staffController');

const router = express.Router();

router.get('/',getStaff);
router.post('/add',addStaff);
router.put('/:id',updateStaff);
router.delete('/:id', deleteStaff);

module.exports = router;