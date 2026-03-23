const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUsers,
  getFaculty
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/faculty', getFaculty);

// Protected routes
router.get('/', protect, authorizeRoles('Admin'), getUsers);

module.exports = router;