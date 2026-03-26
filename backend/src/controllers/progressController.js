const Progress = require("../models/Progress");
const Quiz = require("../models/Quiz");

// Get user progress
exports.getProgress = async (req, res) => {
  try {
    const userId = req.userId;
    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = new Progress({ userId });
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update topic progress
exports.updateTopicProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { topic, completedPercentage, score } = req.body;

    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = new Progress({ userId });
    }

    // Find or create topic progress
    let topicProgress = progress.topicProgress.find((t) => t.topic === topic);
    if (!topicProgress) {
      topicProgress = {
        topic,
        completedPercentage: 0,
        quizzesTaken: 0,
        averageScore: 0,
      };
      progress.topicProgress.push(topicProgress);
    }

    topicProgress.completedPercentage = completedPercentage;
    topicProgress.quizzesTaken = (topicProgress.quizzesTaken || 0) + 1;
    topicProgress.averageScore = score;
    topicProgress.lastUpdated = new Date();

    // Update improvement trends
    progress.improvementTrends.push({
      date: new Date(),
      score: score,
    });

    // Calculate overall progress
    const totalPercentage = progress.topicProgress.reduce(
      (sum, t) => sum + (t.completedPercentage || 0),
      0,
    );
    progress.overallProgress =
      totalPercentage / Math.max(progress.topicProgress.length, 1);

    progress.lastUpdated = new Date();
    await progress.save();

    res.json({ message: "Progress updated", progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate readiness
exports.calculateReadiness = async (req, res) => {
  try {
    const userId = req.userId;
    const progress = await Progress.findOne({ userId });

    if (!progress) {
      return res.json({ readinessPercentage: 0 });
    }

    // Calculate based on all topics
    const readiness =
      progress.overallProgress * 0.7 +
      (progress.improvementTrends.length > 0
        ? Math.min(
            progress.improvementTrends[progress.improvementTrends.length - 1]
              .score || 0,
            100,
          ) * 0.3
        : 0);

    progress.readinessPercentage = readiness;
    await progress.save();

    res.json({
      readinessPercentage: readiness.toFixed(2),
      overallProgress: progress.overallProgress.toFixed(2),
      topicProgress: progress.topicProgress,
      improvementTrends: progress.improvementTrends,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get improvement analysis
exports.getImprovementAnalysis = async (req, res) => {
  try {
    const userId = req.userId;
    const progress = await Progress.findOne({ userId });

    if (!progress || progress.improvementTrends.length === 0) {
      return res.json({ trends: [] });
    }

    // Calculate improvement over time
    const trends = progress.improvementTrends.slice(-10); // Last 10 attempts
    const improvement =
      trends.length > 1
        ? (
            ((trends[trends.length - 1].score - trends[0].score) /
              trends[0].score) *
            100
          ).toFixed(2)
        : 0;

    res.json({
      improvement: improvement + "%",
      currentScore: trends[trends.length - 1].score,
      previousScore: trends[0].score,
      trends: trends,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
