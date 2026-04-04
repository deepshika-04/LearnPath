import React, { useState, useEffect } from "react";
import { apiClient } from "../utils/api";
import { authUtils } from "../utils/auth";
import "../styles/study-plan.css";

function StudyPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudyPlan();
  }, []);

  const loadStudyPlan = async () => {
    try {
      const token = authUtils.getToken();
      const response = await apiClient.getStudyPlan(token);
      console.log("Study Plan Response:", response);
      
      if (response && response.weeklySchedule) {
        setPlan(response);
        setError("");
      } else if (response && Object.keys(response).length > 0) {
        // Response exists but might not have the expected fields
        console.warn("Study plan structure:", response);
        setPlan(response);
        setError("");
      } else {
        setError("No study plan data found. Please generate one.");
        setPlan(null);
      }
    } catch (error) {
      console.error("Error loading study plan:", error);
      setError("Error loading study plan. Please generate one first.");
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    try {
      setLoading(true);
      const token = authUtils.getToken();
      const response = await apiClient.generateStudyPlan(token);
      setPlan(response);
      setError("");
    } catch (error) {
      setError("Error generating plan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading study plan...</div>;

  if (!plan) {
    return (
      <div className="study-plan-container">
        <h2>Study Plan Generator</h2>
        <div className="error-message">{error}</div>
        <button onClick={handleGeneratePlan} className="generate-btn">
          Generate Study Plan
        </button>
      </div>
    );
  }

  return (
    <div className="study-plan-container">
      <h2>Your Personalized Study Plan</h2>

      <div className="weekly-schedule">
        <h3>Weekly Schedule</h3>
        {plan.weeklySchedule && plan.weeklySchedule.length > 0 ? (
          <div className="schedule-grid">
            {plan.weeklySchedule.map((day, idx) => (
              <div key={idx} className="day-card">
                <h4>{day.day}</h4>
                <p className="topics">Topics: {day.topics?.join(", ") || "N/A"}</p>
                <p className="hours">Study Hours: {day.estimatedHours || 0}h</p>
                <span className={`priority ${day.priority?.toLowerCase()}`}>
                  {day.priority || "Medium"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">No weekly schedule available</p>
        )}
      </div>

      <div className="daily-tasks">
        <h3>Daily Tasks (Next 14 Days)</h3>
        {plan.dailyTasks && plan.dailyTasks.length > 0 ? (
          <div className="tasks-list">
            {plan.dailyTasks.map((dayTasks, idx) => (
              <div key={idx} className="day-tasks">
                <h4>{new Date(dayTasks.date).toLocaleDateString()}</h4>
                {dayTasks.tasks && dayTasks.tasks.length > 0 ? (
                  dayTasks.tasks.map((task, tidx) => (
                    <div key={tidx} className="task-item">
                      <input type="checkbox" defaultChecked={task.completed} />
                      <span>
                        {task.topic} - {task.subtopic}
                      </span>
                      <span className="duration">{task.hours}h</span>
                    </div>
                  ))
                ) : (
                  <p className="no-tasks">No tasks for this day</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">No daily tasks available</p>
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

export default StudyPlan;
