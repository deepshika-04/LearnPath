const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { authenticate } = require('../middleware/auth');

// Get recommendations
router.get('/', authenticate, recommendationController.getRecommendations);

// Get resources by topic
router.get('/topic', recommendationController.getResourcesByTopic);

// Get all resources
router.get('/all', recommendationController.getAllResources);

module.exports = router;
