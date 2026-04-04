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
    let skillLevel = "Intermediate";
    let weakTopics = [];
    let strongTopics = [];

    try {
      const mlResponse = await axios.post(
        `${process.env.ML_SERVICE_URL}/analyze-skills`,
        {
          quizResults: quiz.topicScores,
          overallScore: quiz.percentageScore,
          targetCompany: user.targetCompany,
        },
        { timeout: 5000 }
      );

      skillLevel = mlResponse.data.skillLevel || "Intermediate";
      weakTopics = mlResponse.data.weakTopics || [];
      strongTopics = mlResponse.data.strongTopics || [];
    } catch (mlError) {
      console.warn("ML service unavailable, generating default skill analysis:", mlError.message);
      
      // Fallback: Generate skill analysis based on quiz scores
      const overallPercentage = quiz.percentageScore;
      
      if (overallPercentage >= 70) {
        skillLevel = "Advanced";
      } else if (overallPercentage >= 50) {
        skillLevel = "Intermediate";
      } else {
        skillLevel = "Beginner";
      }

      // Identify weak and strong topics from quiz scores
      const topicScoresArray = Object.entries(quiz.topicScores).map(([topic, score]) => ({
        topic,
        score,
      }));
      topicScoresArray.sort((a, b) => a.score - b.score);

      weakTopics = topicScoresArray.slice(0, 2).map((t) => t.topic); // Lowest 2 topics
      strongTopics = topicScoresArray.slice(-2).map((t) => t.topic); // Highest 2 topics
    }

    // Extract ML analysis (or use fallback)

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
