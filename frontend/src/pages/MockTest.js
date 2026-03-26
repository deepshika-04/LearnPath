import React, { useState } from "react";
import { apiClient } from "../utils/api";
import { authUtils } from "../utils/auth";
import "../styles/mock-test.css";

function MockTest() {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const user = authUtils.getUser();

  const loadMockTest = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMockTest(user.targetCompany);
      setTest(response);
    } catch (error) {
      console.error("Error loading mock test:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMockTest = async () => {
    try {
      setLoading(true);
      const token = authUtils.getToken();

      // Simulate answers (in real app, user would select answers)
      const answers = test.questions.map((q, idx) => ({
        questionId: q.id,
        selectedAnswer: Math.floor(Math.random() * 4),
      }));

      const response = await apiClient.submitMockTest(
        {
          targetCompany: user.targetCompany,
          answers,
        },
        token,
      );

      setResult(response);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting mock test:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!test && !submitted) {
    return (
      <div className="mock-test-container">
        <h2>Full-Length Mock Test</h2>
        <p>Company: {user?.targetCompany}</p>
        <p>
          Simulate the actual interview-level test for {user?.targetCompany}
        </p>

        {loading ? (
          <div className="loading">Loading mock test...</div>
        ) : (
          <button onClick={loadMockTest} className="start-btn">
            Start Mock Test
          </button>
        )}
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div className="mock-test-result">
        <h2>Mock Test Results</h2>

        <div className="result-score">
          <h3>Performance Score: {result.percentageScore?.toFixed(2)}%</h3>
          <p>
            {result.overallScore} / {result.totalQuestions} Correct
          </p>
        </div>

        <div className="performance-analysis">
          <h4>Performance Analysis</h4>
          <p>
            <strong>Strength:</strong> {result.performanceAnalysis?.strength}
          </p>
          <div className="weak-areas">
            <h5>Areas to Improve:</h5>
            <ul>
              {result.performanceAnalysis?.areasToImprove?.map((area, idx) => (
                <li key={idx}>{area}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="feedback-card">
          <h4>Readiness Feedback</h4>
          <p className="feedback-text">{result.readinessFeedback}</p>
          <p className="note">
            Note: This feedback is based on your current performance and helps
            you prepare effectively for {user?.targetCompany}.
          </p>
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

  return (
    <div className="mock-test-container">
      <h2>Mock Test in Progress</h2>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <button onClick={handleSubmitMockTest} className="submit-btn">
          Complete Mock Test
        </button>
      )}
    </div>
  );
}

export default MockTest;
