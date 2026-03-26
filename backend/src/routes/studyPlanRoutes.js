const express = require("express");
const router = express.Router();
const studyPlanController = require("../controllers/studyPlanController");
const { authenticate } = require("../middleware/auth");

// Generate study plan
router.post("/generate", authenticate, studyPlanController.generateStudyPlan);

// Get study plan
router.get("/", authenticate, studyPlanController.getStudyPlan);

// Update task completion
router.put(
  "/update-task",
  authenticate,
  studyPlanController.updateTaskCompletion,
);

module.exports = router;
