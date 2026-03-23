const express = require('express');
const router = express.Router();

const {
  getFacultyRequests,
  updateVisitorStatus
} = require('../controllers/visitorController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Faculty: get all requests assigned to logged-in faculty
router.get('/host', protect, authorizeRoles('Faculty'), getFacultyRequests);

// Faculty: approve or reject a visitor request
router.put('/:id/status', protect, authorizeRoles('Faculty'), updateVisitorStatus);

module.exports = router;