const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const envPath = path.resolve(__dirname, ".env");
const envExamplePath = path.resolve(__dirname, ".env.example");

dotenv.config({ path: fs.existsSync(envPath) ? envPath : envExamplePath });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/companies", require("./src/routes/companyRoutes"));
app.use("/api/quiz", require("./src/routes/quizRoutes"));
app.use("/api/analysis", require("./src/routes/analysisRoutes"));
app.use("/api/learning-path", require("./src/routes/learningPathRoutes"));
app.use("/api/recommendations", require("./src/routes/recommendationRoutes"));
app.use("/api/progress", require("./src/routes/progressRoutes"));
app.use("/api/study-plan", require("./src/routes/studyPlanRoutes"));
app.use("/api/mock-test", require("./src/routes/mockTestRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
