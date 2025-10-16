const express = require('express');
const { getDiesel, addDiesel, updateDiesel, deleteDiesel } = require('../controllers/dieselController');

const router = express.Router();

router.get('/',getDiesel);
router.post('/add',addDiesel);
router.put('/:id',updateDiesel);
router.delete('/:id', deleteDiesel);

module.exports = router;