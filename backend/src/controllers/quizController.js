const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// Get diagnostic test questions
exports.getDiagnosticTest = async (req, res) => {
  try {
    const { targetCompany } = req.query;
    
    // Get 5 questions per topic (25 total)
    const topics = ['DSA', 'DBMS', 'OS', 'CN', 'Aptitude'];
    let questions = [];

    for (let topic of topics) {
      const topicQuestions = await Question.find({ topic }).limit(5);
      questions = [...questions, ...topicQuestions];
    }

    res.json({
      quizType: 'Diagnostic',
      totalQuestions: questions.length,
      questions: questions.map(q => ({
        id: q._id,
        topic: q.topic,
        difficulty: q.difficulty,
        question: q.question,
        options: q.options
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit quiz answers
exports.submitQuiz = async (req, res) => {
  try {
    const { quizType, answers } = req.body;
    const userId = req.userId;

    // Calculate scores
    let topicScores = { DSA: 0, DBMS: 0, OS: 0, CN: 0, Aptitude: 0 };
    let topicCounts = { DSA: 0, DBMS: 0, OS: 0, CN: 0, Aptitude: 0 };
    let correctCount = 0;

    for (let answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === answer.selectedAnswer;
        answer.isCorrect = isCorrect;

        if (isCorrect) {
          correctCount++;
          topicScores[question.topic]++;
        }
        topicCounts[question.topic]++;
      }
    }

    // Calculate percentages
    const percentageScore = (correctCount / answers.length) * 100;
    const topicPercentages = {};
    for (let topic of Object.keys(topicScores)) {
      topicPercentages[topic] = topicCounts[topic] > 0 
        ? (topicScores[topic] / topicCounts[topic]) * 100 
        : 0;
    }

    // Save quiz result
    const quiz = new Quiz({
      userId,
      quizType,
      totalQuestions: answers.length,
      answers,
      topicScores: topicPercentages,
      overallScore: correctCount,
      percentageScore
    });

    await quiz.save();

    res.json({
      message: 'Quiz submitted successfully',
      quizId: quiz._id,
      overallScore: correctCount,
      percentageScore: percentageScore.toFixed(2),
      topicScores: topicPercentages,
      totalQuestions: answers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get quiz results
exports.getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).populate({
      path: 'answers.questionId',
      select: 'topic question correctAnswer explanation'
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's quiz history
exports.getQuizHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const quizzes = await Quiz.find({ userId }).sort({ completedAt: -1 });

    res.json({
      totalQuizzesTaken: quizzes.length,
      quizzes: quizzes.map(q => ({
        id: q._id,
        type: q.quizType,
        score: q.overallScore,
        percentageScore: q.percentageScore,
        completedAt: q.completedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
