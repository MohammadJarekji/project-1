const express = require('express');
const { getProjectDetails, addProjectDetails, updateProjectDetails, deleteProjectDetails } = require('../controllers/projectDetailsController');

const router = express.Router();

router.get('/',getProjectDetails);
router.post('/add',addProjectDetails);
router.put('/:id',updateProjectDetails);
router.delete('/:id', deleteProjectDetails);

module.exports = router;