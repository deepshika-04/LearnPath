const axios = require("axios");
const Quiz = require("../models/Quiz");

// Conduct mock test
exports.getMockTest = async (req, res) => {
  try {
    const { targetCompany, difficulty } = req.query;

    // Request mock test questions from ML service
    const mockResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/generate-mock-test`,
      {
        targetCompany,
        difficulty,
        totalQuestions: 50,
      },
    );

    res.json({
      quizType: "Mock",
      totalQuestions: mockResponse.data.totalQuestions,
      duration: 120, // minutes
      questions: mockResponse.data.questions.map((q) => ({
        id: q._id,
        topic: q.topic,
        question: q.question,
        options: q.options,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit mock test
exports.submitMockTest = async (req, res) => {
  try {
    const userId = req.userId;
    const { targetCompany, answers } = req.body;

    if (!targetCompany || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Target company and answers are required" });
    }

    const generatedMock = await axios.post(
      `${process.env.ML_SERVICE_URL}/generate-mock-test`,
      {
        targetCompany,
        difficulty: req.body.difficulty || "Medium",
        totalQuestions: answers.length,
      },
    );

    const questionKey = new Map(
      generatedMock.data.questions.map((question) => [question._id, question]),
    );

    // Save mock test as quiz
    const mockQuiz = new Quiz({
      userId,
      quizType: "Mock",
      totalQuestions: answers.length,
      answers,
    });

    // Calculate results using generated answer key
    let correctCount = 0;
    const weakAreas = new Set();
    const topicTotals = { DSA: 0, DBMS: 0, OS: 0, CN: 0, Aptitude: 0 };
    const topicCorrect = { DSA: 0, DBMS: 0, OS: 0, CN: 0, Aptitude: 0 };

    for (const answer of answers) {
      const question = questionKey.get(answer.questionId);
      if (!question) continue;

      topicTotals[question.topic] = (topicTotals[question.topic] || 0) + 1;

      const isCorrect = Number(answer.selectedAnswer) === Number(question.correctAnswer);
      if (isCorrect) {
        correctCount += 1;
        topicCorrect[question.topic] = (topicCorrect[question.topic] || 0) + 1;
      } else {
        weakAreas.add(question.topic);
      }
    }

    const percentageScore = (correctCount / answers.length) * 100;
    mockQuiz.percentageScore = percentageScore;
    mockQuiz.overallScore = correctCount;

    await mockQuiz.save();

    // Get analysis from ML service
    const analysisResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/analyze-mock-test`,
      {
        answers,
        targetCompany,
        percentageScore,
        weakAreas: Array.from(weakAreas),
      },
    );

    res.json({
      message: "Mock test submitted",
      quizId: mockQuiz._id,
      performanceAnalysis: analysisResponse.data.analysis,
      weakAreas: analysisResponse.data.weakAreas,
      readinessFeedback: analysisResponse.data.feedback,
      percentageScore,
      overallScore: mockQuiz.overallScore,
      totalQuestions: answers.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get mock test feedback
exports.getMockTestFeedback = async (req, res) => {
  try {
    const { mockTestId } = req.params;
    const quiz = await Quiz.findById(mockTestId);

    if (!quiz || quiz.quizType !== "Mock") {
      return res.status(404).json({ message: "Mock test not found" });
    }

    res.json({
      percentageScore: quiz.percentageScore,
      overallScore: quiz.overallScore,
      totalQuestions: quiz.totalQuestions,
      completedAt: quiz.completedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
