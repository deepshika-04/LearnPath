const axios = require('axios');
const StudyPlan = require('../models/StudyPlan');
const LearningPath = require('../models/LearningPath');
const User = require('../models/User');

// Generate study plan
exports.generateStudyPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    // Get learning path
    const learningPath = await LearningPath.findOne({ userId }).sort({ generatedAt: -1 });
    if (!learningPath) {
      return res.status(404).json({ message: 'Learning path not found' });
    }

    // Request study plan from ML service
    const planResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/generate-study-plan`,
      {
        learningPath: learningPath.topics,
        studyHoursPerDay: user.studyHoursPerDay,
        startDate: new Date()
      }
    );

    const { weeklySchedule, dailyTasks } = planResponse.data;

    // Save study plan
    const plan = new StudyPlan({
      userId,
      weeklySchedule,
      dailyTasks
    });

    await plan.save();

    res.json({
      message: 'Study plan generated',
      planId: plan._id,
      weeklySchedule,
      dailyTasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get study plan
exports.getStudyPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const plan = await StudyPlan.findOne({ userId }).sort({ generatedAt: -1 });

    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task completion
exports.updateTaskCompletion = async (req, res) => {
  try {
    const userId = req.userId;
    const { taskId, completed } = req.body;

    const plan = await StudyPlan.findOne({ userId });
    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    // Find and update task
    for (let dayTasks of plan.dailyTasks) {
      const task = dayTasks.tasks.find(t => t._id.toString() === taskId);
      if (task) {
        task.completed = completed;
        plan.updatedAt = new Date();
        await plan.save();
        return res.json({ message: 'Task updated', plan });
      }
    }

    res.status(404).json({ message: 'Task not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
