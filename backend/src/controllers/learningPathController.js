const axios = require("axios");
const LearningPath = require("../models/LearningPath");
const SkillAnalysis = require("../models/SkillAnalysis");
const User = require("../models/User");

// Generate learning path
exports.generateLearningPath = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    // Get latest skill analysis
    const skillAnalysis = await SkillAnalysis.findOne({ userId }).sort({
      analysisDate: -1,
    });
    if (!skillAnalysis) {
      return res
        .status(404)
        .json({ message: "Please complete diagnostic test first" });
    }

    // Request learning path from ML service
    const pathResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/generate-learning-path`,
      {
        weakTopics: skillAnalysis.weakTopics,
        strongTopics: skillAnalysis.strongTopics,
        targetCompany: user.targetCompany,
        skillLevel: skillAnalysis.skillLevel,
        studyHoursPerDay: user.studyHoursPerDay,
      },
    );

    const { learningPath, totalDaysEstimated } = pathResponse.data;

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
