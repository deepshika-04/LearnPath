const axios = require("axios");
const Quiz = require("../models/Quiz");
const SkillAnalysis = require("../models/SkillAnalysis");
const User = require("../models/User");

// Get ML Skill Analysis
exports.getSkillAnalysis = async (req, res) => {
  try {
    const userId = req.userId;
    const { quizId } = req.body;

    // Get quiz data
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Get user data
    const user = await User.findById(userId);

    // Send to ML service
    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/analyze-skills`,
      {
        quizResults: quiz.topicScores,
        overallScore: quiz.percentageScore,
        targetCompany: user.targetCompany,
      },
    );

    // Extract ML analysis
    const { skillLevel, weakTopics, strongTopics } = mlResponse.data;

    // Save skill analysis
    const skillAnalysis = new SkillAnalysis({
      userId,
      skillLevel,
      weakTopics,
      strongTopics,
      topicScores: quiz.topicScores,
      quizResultId: quizId,
    });

    await skillAnalysis.save();

    res.json({
      message: "Skill analysis completed",
      analysisId: skillAnalysis._id,
      skillLevel,
      weakTopics,
      strongTopics,
      topicScores: quiz.topicScores,
      overallPercentage: quiz.percentageScore,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's latest skill analysis
exports.getLatestAnalysis = async (req, res) => {
  try {
    const userId = req.userId;
    const analysis = await SkillAnalysis.findOne({ userId }).sort({
      analysisDate: -1,
    });

    if (!analysis) {
      return res.status(404).json({ message: "No analysis found" });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get skill progression
exports.getSkillProgression = async (req, res) => {
  try {
    const userId = req.userId;
    const analyses = await SkillAnalysis.find({ userId }).sort({
      analysisDate: 1,
    });

    const progression = analyses.map((a) => ({
      date: a.analysisDate,
      skillLevel: a.skillLevel,
      weakTopics: a.weakTopics,
      strongTopics: a.strongTopics,
    }));

    res.json({ progression });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
