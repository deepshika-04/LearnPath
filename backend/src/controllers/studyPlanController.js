const axios = require("axios");
const StudyPlan = require("../models/StudyPlan");
const LearningPath = require("../models/LearningPath");
const User = require("../models/User");

// Generate study plan
exports.generateStudyPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get learning path
    let learningPath = await LearningPath.findOne({ userId }).sort({
      generatedAt: -1,
    });
    
    if (!learningPath) {
      return res.status(404).json({ 
        message: "Learning path not found. Please generate a learning path first."
      });
    }

    // Request study plan from ML service
    let weeklySchedule = [];
    let dailyTasks = [];

    try {
      const planResponse = await axios.post(
        `${process.env.ML_SERVICE_URL}/generate-study-plan`,
        {
          learningPath: learningPath.topics,
          studyHoursPerDay: user.studyHoursPerDay,
          startDate: new Date(),
        },
        { timeout: 5000 }
      );

      weeklySchedule = planResponse.data.weeklySchedule || [];
      dailyTasks = planResponse.data.dailyTasks || [];
    } catch (mlError) {
      console.warn("ML service unavailable, generating default study plan:", mlError.message);
      
      // Fallback: Generate default study plan based on learning path
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      weeklySchedule = learningPath.topics.slice(0, 7).map((topic, idx) => ({
        day: days[idx % 7],
        topics: [topic.topicName],
        estimatedHours: user.studyHoursPerDay || 2,
        priority: topic.priority || "Medium",
      }));

      // Generate 14 days of daily tasks
      const startDate = new Date();
      dailyTasks = [];
      for (let i = 0; i < 14; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        const topicIndex = i % learningPath.topics.length;
        const topic = learningPath.topics[topicIndex];
        
        dailyTasks.push({
          date,
          tasks: [
            {
              topic: topic.topicName,
              subtopic: `${topic.topicName} Study`,
              hours: user.studyHoursPerDay || 2,
              completed: false,
            },
          ],
        });
      }
    }

    // Save study plan
    const plan = new StudyPlan({
      userId,
      weeklySchedule,
      dailyTasks,
    });

    await plan.save();
    console.log(`[StudyPlan] Study plan generated for user ${userId}`);

    res.json({
      message: "Study plan generated",
      planId: plan._id,
      weeklySchedule,
      dailyTasks,
    });
  } catch (error) {
    console.error("[StudyPlan] Error generating study plan:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get study plan
exports.getStudyPlan = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(`[StudyPlan] Querying for user: ${userId}`);
    
    const plan = await StudyPlan.findOne({ userId }).sort({ generatedAt: -1 });

    console.log(`[StudyPlan] Plan found:`, !!plan);
    if (plan) {
      console.log(`[StudyPlan] Full plan object:`, JSON.stringify(plan, null, 2));
    } else {
      console.log(`[StudyPlan] No study plan found for user ${userId}`);
      // Try to find any study plans to debug
      const allPlans = await StudyPlan.find().limit(5);
      console.log(`[StudyPlan] Total study plans in DB: ${allPlans.length}`);
      if (allPlans.length > 0) {
        console.log(`[StudyPlan] Sample user IDs in DB:`, allPlans.map(p => p.userId.toString()).slice(0, 3));
      }
    }

    if (!plan) {
      return res.status(404).json({ message: "Study plan not found" });
    }

    res.json(plan);
  } catch (error) {
    console.error("[StudyPlan] Error:", error);
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
      return res.status(404).json({ message: "Study plan not found" });
    }

    // Find and update task
    for (let dayTasks of plan.dailyTasks) {
      const task = dayTasks.tasks.find((t) => t._id.toString() === taskId);
      if (task) {
        task.completed = completed;
        plan.updatedAt = new Date();
        await plan.save();
        return res.json({ message: "Task updated", plan });
      }
    }

    res.status(404).json({ message: "Task not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
