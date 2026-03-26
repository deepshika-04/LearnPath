import React, { useState, useEffect } from "react";
import { apiClient } from "../utils/api";
import { authUtils } from "../utils/auth";
import "../styles/learning-path.css";

function LearningPath() {
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLearningPath();
  }, []);

  const loadLearningPath = async () => {
    try {
      const token = authUtils.getToken();
      const response = await apiClient.getLearningPath(token);

      if (response.topics) {
        setPath(response);
      } else {
        setError(
          "No learning path found. Please take the diagnostic test first.",
        );
      }
    } catch (error) {
      setError("Error loading learning path: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePath = async () => {
    try {
      setLoading(true);
      const token = authUtils.getToken();
      const response = await apiClient.generateLearningPath(token);
      setPath(response);
      setError("");
    } catch (error) {
      setError("Error generating path: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTopicStatus = async (topicName, status) => {
    try {
      const token = authUtils.getToken();
      await apiClient.updateTopicProgress(
        {
          topic: topicName,
          completedPercentage: status === "Completed" ? 100 : 50,
          score: 70,
        },
        token,
      );
      loadLearningPath();
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  };

  if (loading) return <div className="loading">Loading learning path...</div>;

  if (!path) {
    return (
      <div className="learning-path-container">
        <h2>Learning Path Generator</h2>
        <div className="error-message">{error}</div>
        <button onClick={handleGeneratePath} className="generate-btn">
          Generate Your Learning Path
        </button>
      </div>
    );
  }

  return (
    <div className="learning-path-container">
      <h2>Your Personalized Learning Path</h2>
      <p className="target-company">Target: {path.targetCompany}</p>
      <p className="total-days">
        Estimated Duration: {path.totalDaysEstimated} days
      </p>

      <div className="topics-list">
        {path.topics &&
          path.topics.map((topic, idx) => (
            <div
              key={idx}
              className={`topic-card priority-${topic.priority?.toLowerCase()}`}
            >
              <div className="topic-header">
                <h4>{topic.topicName}</h4>
                <span className="priority-badge">{topic.priority}</span>
              </div>
              <p className="topic-days">
                Estimated: {topic.estimatedDays} days
              </p>
              {topic.prerequisites && topic.prerequisites.length > 0 && (
                <p className="prerequisites">
                  Prerequisites: {topic.prerequisites.join(", ")}
                </p>
              )}
              <div className="topic-status">
                <select
                  onChange={(e) =>
                    updateTopicStatus(topic.topicName, e.target.value)
                  }
                  defaultValue="Not Started"
                >
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
          ))}
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

export default LearningPath;
