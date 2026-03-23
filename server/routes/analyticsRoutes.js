const express = require('express');
const router = express.Router();
const { getMetrics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/metrics', protect, authorizeRoles('Admin'), getMetrics);

module.exports = router;
