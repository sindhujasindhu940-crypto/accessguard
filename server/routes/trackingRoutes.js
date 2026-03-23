const express = require('express');
const router = express.Router();
const { scanPass, checkIn, checkOut, getActiveVisitors } = require('../controllers/trackingController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/scan/:passId', protect, authorizeRoles('Security', 'Admin'), scanPass);
router.post('/checkin', protect, authorizeRoles('Security', 'Admin'), checkIn);
router.put('/checkout/:logId', protect, authorizeRoles('Security', 'Admin'), checkOut);
router.get('/active', protect, authorizeRoles('Security', 'Admin'), getActiveVisitors);

module.exports = router;
