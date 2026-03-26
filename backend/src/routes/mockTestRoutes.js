const express = require('express');
const router = express.Router();
const mockTestController = require('../controllers/mockTestController');
const { authenticate } = require('../middleware/auth');

// Get mock test
router.get('/', mockTestController.getMockTest);

// Submit mock test
router.post('/submit', authenticate, mockTestController.submitMockTest);

// Get mock test feedback
router.get('/feedback/:mockTestId', authenticate, mockTestController.getMockTestFeedback);

module.exports = router;
