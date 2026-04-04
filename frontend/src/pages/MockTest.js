import React, { useState } from "react";
import { apiClient } from "../utils/api";
import { authUtils } from "../utils/auth";
import "../styles/mock-test.css";

function MockTest() {
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const user = authUtils.getUser();

  const formatPercent = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  };

  const loadMockTest = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMockTest(user.targetCompany);
      setTest(response);
      setAnswers(new Array(response.questions.length).fill(null));
      setCurrentQuestion(0);
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

      const unansweredCount = answers.filter((answer) => answer === null).length;
      if (unansweredCount > 0) {
        alert(`Please answer all questions before submitting. ${unansweredCount} question(s) are still unanswered.`);
        return;
      }

      const formattedAnswers = test.questions.map((question, idx) => ({
        questionId: question.id,
        selectedAnswer: answers[idx],
      }));

      const response = await apiClient.submitMockTest(
        {
          targetCompany: user.targetCompany,
          answers: formattedAnswers,
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
          <h3>Performance Score: {formatPercent(result.percentageScore)}%</h3>
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
      ) : test ? (
        <div className="quiz-content">
          <h3>{test.questions[currentQuestion].question}</h3>
          <div className="topic-tag">{test.questions[currentQuestion].topic}</div>

          <div className="options">
            {test.questions[currentQuestion].options.map((option, idx) => (
              <label key={idx} className="option">
                <input
                  type="radio"
                  name={`mock-answer-${currentQuestion}`}
                  checked={answers[currentQuestion] === idx}
                  onChange={() => {
                    const nextAnswers = [...answers];
                    nextAnswers[currentQuestion] = idx;
                    setAnswers(nextAnswers);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          <div className="quiz-navigation">
            <button
              className="nav-btn"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((value) => value - 1)}
            >
              Previous
            </button>
            {currentQuestion === test.questions.length - 1 ? (
              <button onClick={handleSubmitMockTest} className="submit-btn">
                Submit Mock Test
              </button>
            ) : (
              <button
                className="nav-btn"
                onClick={() => setCurrentQuestion((value) => value + 1)}
              >
                Next
              </button>
            )}
          </div>

          <div className="quiz-status">
            <p>
              Answered: {answers.filter((answer) => answer !== null).length} / {test.questions.length}
            </p>
          </div>
        </div>
      ) : (
        <button onClick={loadMockTest} className="start-btn">
          Start Mock Test
        </button>
      )}
    </div>
  );
}

export default MockTest;
