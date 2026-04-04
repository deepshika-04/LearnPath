const axios = require("axios");
const LearningPath = require("../models/LearningPath");
const SkillAnalysis = require("../models/SkillAnalysis");
const User = require("../models/User");

// Generate learning path
exports.generateLearningPath = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        message: "User not found",
        hint: "Please log in again"
      });
    }

    // Get latest skill analysis
    let skillAnalysis = await SkillAnalysis.findOne({ userId }).sort({
      analysisDate: -1,
    });
    
    // If no skill analysis, try to create one from latest quiz
    if (!skillAnalysis) {
      const Quiz = require("../models/Quiz");
      const latestQuiz = await Quiz.findOne({ userId }).sort({ createdAt: -1 });
      
      if (!latestQuiz) {
        return res.status(404).json({ 
          message: "Please complete diagnostic test first",
          hint: "You need to take the diagnostic test to generate a learning path"
        });
      }

      // Create default skill analysis from quiz
      const overallPercentage = latestQuiz.percentageScore;
      let defaultSkillLevel = "Intermediate";
      
      if (overallPercentage >= 70) {
        defaultSkillLevel = "Advanced";
      } else if (overallPercentage >= 50) {
        defaultSkillLevel = "Intermediate";
      } else {
        defaultSkillLevel = "Beginner";
      }

      const topicScoresArray = Object.entries(latestQuiz.topicScores || {}).map(([topic, score]) => ({
        topic,
        score,
      }));
      topicScoresArray.sort((a, b) => a.score - b.score);

      const defaultWeakTopics = topicScoresArray.slice(0, 2).map((t) => t.topic);
      const defaultStrongTopics = topicScoresArray.slice(-2).map((t) => t.topic);

      skillAnalysis = new SkillAnalysis({
        userId,
        skillLevel: defaultSkillLevel,
        weakTopics: defaultWeakTopics,
        strongTopics: defaultStrongTopics,
        topicScores: latestQuiz.topicScores,
        quizResultId: latestQuiz._id,
      });
      
      await skillAnalysis.save();
      console.log("[LearningPath] Created default skill analysis from quiz");
    }

    // Request learning path from ML service
    let learningPath = [];
    let totalDaysEstimated = 0;

    try {
      const pathResponse = await axios.post(
        `${process.env.ML_SERVICE_URL}/generate-learning-path`,
        {
          weakTopics: skillAnalysis.weakTopics,
          strongTopics: skillAnalysis.strongTopics,
          targetCompany: user.targetCompany,
          skillLevel: skillAnalysis.skillLevel,
          studyHoursPerDay: user.studyHoursPerDay,
        },
        { timeout: 5000 }
      );

      learningPath = pathResponse.data.learningPath || [];
      totalDaysEstimated = pathResponse.data.totalDaysEstimated || 0;
    } catch (mlError) {
      console.warn("ML service unavailable, generating default learning path:", mlError.message);
      
      // Fallback: Generate default learning path based on skill analysis
      const topics = ["DSA", "DBMS", "OS", "CN", "Aptitude"];
      learningPath = topics.map((topic) => ({
        topicName: topic,
        priority: skillAnalysis.weakTopics.includes(topic) ? "High" : skillAnalysis.strongTopics.includes(topic) ? "Low" : "Medium",
        prerequisites: topic === "OS" ? ["DSA"] : topic === "CN" ? ["OS"] : [],
        estimatedDays: skillAnalysis.weakTopics.includes(topic) ? 30 : skillAnalysis.strongTopics.includes(topic) ? 15 : 20,
        status: "Not Started",
      }));
      totalDaysEstimated = learningPath.reduce((sum, t) => sum + t.estimatedDays, 0);
    }

    // Save to database
    const path = new LearningPath({
      userId,
      targetCompany: user.targetCompany,
      topics: learningPath,
      totalDaysEstimated,
    });

    await path.save();

    res.json({
      message: "Learning path generated successfully",
      pathId: path._id,
      learningPath,
      topics: learningPath,
      totalDaysEstimated,
      targetCompany: user.targetCompany,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get learning path
exports.getLearningPath = async (req, res) => {
  try {
    const userId = req.userId;
    const path = await LearningPath.findOne({ userId }).sort({
      generatedAt: -1,
    });

    if (!path) {
      return res.status(404).json({ message: "Learning path not found" });
    }

    res.json(path);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update topic status
exports.updateTopicStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { topicName, status } = req.body;

    const path = await LearningPath.findOne({ userId });
    if (!path) {
      return res.status(404).json({ message: "Learning path not found" });
    }

    const topic = path.topics.find((t) => t.topicName === topicName);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    topic.status = status;
    if (status === "Completed") {
      topic.completedAt = new Date();
    }
    path.updatedAt = new Date();

    await path.save();

    res.json({ message: "Topic status updated", path });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
