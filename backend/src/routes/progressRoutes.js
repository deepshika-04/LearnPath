const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticate } = require('../middleware/auth');

// Get progress
router.get('/', authenticate, progressController.getProgress);

// Update topic progress
router.put('/update-topic', authenticate, progressController.updateTopicProgress);

// Calculate readiness
router.get('/readiness', authenticate, progressController.calculateReadiness);

// Get improvement analysis
router.get('/improvement', authenticate, progressController.getImprovementAnalysis);

module.exports = router;
