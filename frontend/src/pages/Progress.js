import React, { useState, useEffect } from "react";
import { apiClient } from "../utils/api";
import { authUtils } from "../utils/auth";
import "../styles/progress.css";

function Progress() {
  const [progress, setProgress] = useState(null);
  const [readiness, setReadiness] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const token = authUtils.getToken();
      const [progressData, readinessData] = await Promise.all([
        apiClient.getProgress(token),
        apiClient.calculateReadiness(token),
      ]);

      setProgress(progressData);
      setReadiness(readinessData.readinessPercentage);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading progress...</div>;

  const getReadinessColor = (percentage) => {
    if (percentage >= 80) return "#4caf50";
    if (percentage >= 60) return "#ff9800";
    return "#f44336";
  };

  const getReadinessStatus = (percentage) => {
    if (percentage >= 80) return "Excellent - Ready for Interview!";
    if (percentage >= 60) return "Good - Needs More Preparation";
    return "Fair - Focus on Weak Areas";
  };

  return (
    <div className="progress-container">
      <h2>Your Progress Tracking</h2>

      <div className="readiness-card">
        <h3>Readiness Score</h3>
        <div className="readiness-gauge">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#ddd"
              strokeWidth="20"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={getReadinessColor(readiness)}
              strokeWidth="20"
              strokeDasharray={`${(readiness / 100) * 565} 565`}
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="gauge-text">
            <div className="percentage">{Math.round(readiness)}%</div>
            <div className="status">{getReadinessStatus(readiness)}</div>
          </div>
        </div>
      </div>

      <div className="topics-progress">
        <h3>Topic-wise Progress</h3>
        {progress?.topicProgress && progress.topicProgress.length > 0 ? (
          progress.topicProgress.map((topic, idx) => (
            <div key={idx} className="topic-progress-bar">
              <div className="topic-name">{topic.topic}</div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${topic.completedPercentage || 0}%` }}
                >
                  {topic.completedPercentage || 0}%
                </div>
              </div>
              <div className="topic-stats">
                Quizzes: {topic.quizzesTaken || 0} | Avg Score:{" "}
                {topic.averageScore || 0}%
              </div>
            </div>
          ))
        ) : (
          <p>No progress yet. Take the diagnostic test to get started!</p>
        )}
      </div>

      <div className="improvement-trends">
        <h3>Improvement Trends</h3>
        {progress?.improvementTrends &&
        progress.improvementTrends.length > 0 ? (
          <div className="trends-chart">
            <p>
              Last 10 Quiz Scores:{" "}
              {progress.improvementTrends
                .slice(-10)
                .map((t) => t.score)
                .join(", ")}
            </p>
          </div>
        ) : (
          <p>Take more quizzes to see improvement trends.</p>
        )}
      </div>

      <button
        onClick={() => (window.location.href = "/dashboard")}
        className="back-btn"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default Progress;
