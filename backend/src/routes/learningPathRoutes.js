const express = require('express');
const router = express.Router();
const learningPathController = require('../controllers/learningPathController');
const { authenticate } = require('../middleware/auth');

// Generate learning path
router.post('/generate', authenticate, learningPathController.generateLearningPath);

// Get learning path
router.get('/', authenticate, learningPathController.getLearningPath);

// Update topic status
router.put('/update-topic', authenticate, learningPathController.updateTopicStatus);

module.exports = router;
