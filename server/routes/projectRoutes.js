const express = require('express');
const { getProject, addProject, updateProject, deleteProject } = require('../controllers/projectController');

const router = express.Router();

router.get('/',getProject);
router.post('/add',addProject);
router.put('/:id',updateProject);
router.delete('/:id', deleteProject);

module.exports = router;