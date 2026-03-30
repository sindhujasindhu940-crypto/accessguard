const express = require('express');
const router = express.Router();

const {
  getFacultyRequests,
  updateVisitorStatus,
  createVisitorRequest,
  getMyRequests
} = require('../controllers/visitorController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public: Create a visitor request
router.post('/request', createVisitorRequest);

// Visitor: get all their requests
router.get('/my-requests', protect, authorizeRoles('Visitor'), getMyRequests);

// Faculty: get all requests assigned to logged-in faculty
router.get('/host', protect, authorizeRoles('Faculty'), getFacultyRequests);

// Faculty: approve or reject a visitor request
router.put('/:id/status', protect, authorizeRoles('Faculty'), updateVisitorStatus);

module.exports = router;