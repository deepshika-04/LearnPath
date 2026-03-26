const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticate } = require('../middleware/auth');

// Get diagnostic test
router.get('/diagnostic', quizController.getDiagnosticTest);

// Submit quiz
router.post('/submit', authenticate, quizController.submitQuiz);

// Get quiz results
router.get('/results/:quizId', authenticate, quizController.getQuizResults);

// Get quiz history
router.get('/history', authenticate, quizController.getQuizHistory);

module.exports = router;
