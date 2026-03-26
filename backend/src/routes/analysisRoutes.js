const express = require("express");
const router = express.Router();
const analysisController = require("../controllers/analysisController");
const { authenticate } = require("../middleware/auth");

// Get skill analysis
router.post("/skills", authenticate, analysisController.getSkillAnalysis);

// Get latest analysis
router.get("/latest", authenticate, analysisController.getLatestAnalysis);

// Get skill progression
router.get(
  "/progression",
  authenticate,
  analysisController.getSkillProgression,
);

module.exports = router;
