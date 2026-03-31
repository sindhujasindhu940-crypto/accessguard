const express = require('express');
const router = express.Router();
const { getDepartments } = require('../controllers/departmentController');

// Public routes
router.get('/', getDepartments);

module.exports = router;
