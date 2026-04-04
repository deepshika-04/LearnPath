import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../utils/api";
import { authUtils } from "../utils/auth";
import "../styles/quiz.css";

function DiagnosticTest() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadTest();
  }, []);

  const loadTest = async () => {
    try {
      const data = await apiClient.getDiagnosticTest();
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(null));
    } catch (error) {
      console.error("Error loading test:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage("");

    const unansweredCount = answers.filter((ans) => ans === null).length;
    if (unansweredCount > 0) {
      setErrorMessage(
        `Please answer all questions before submitting. ${unansweredCount} question(s) are still unanswered.`,
      );
      return;
    }

    try {
      const token = authUtils.getToken();
      if (!token) {
        setErrorMessage("Please login again to submit your test.");
        return;
      }

      const formattedAnswers = answers.map((ans, idx) => ({
        questionId: questions[idx].id,
        selectedAnswer: ans,
      }));

      const response = await apiClient.submitQuiz(
        {
          quizType: "Diagnostic",
          answers: formattedAnswers,
        },
        token,
      );

      if (!response?.quizId) {
        throw new Error(response?.message || "Quiz submission failed");
      }

      setResult(response);
      setSubmitted(true);

      // Get skill analysis
      const analysis = await apiClient.getSkillAnalysis(response.quizId, token);
      console.log("Skill analysis:", analysis);

      // Generate learning path immediately after diagnostic completion
      await apiClient.generateLearningPath(token);

      // Move user to the learning path page so the next step is visible
      navigate("/learning-path");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      const errorText = String(error?.message || "");
      if (errorText.toLowerCase().includes("invalid or expired token")) {
        authUtils.logout();
        window.location.href = "/login";
        return;
      }

      setErrorMessage(
        error?.message || "Unable to submit quiz. Please try again.",
      );
    }
  };

  if (loading) return <div className="loading">Loading diagnostic test...</div>;

  const formatPercent = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  };

  if (submitted) {
    return (
      <div className="quiz-result">
        <h2>Test Results</h2>
        <div className="result-score">
          <h3>Your Score: {formatPercent(result?.percentageScore)}%</h3>
          <p>
            Correct Answers: {result?.overallScore ?? 0} / {result?.totalQuestions ?? 0}
          </p>
        </div>
        <div className="result-topics">
          <h4>Topic-wise Performance:</h4>
          <ul>
            {Object.entries(result?.topicScores || {}).map(([topic, score]) => (
              <li key={topic}>
                {topic}: {formatPercent(score)}%
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => (window.location.href = "/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Diagnostic Test</h2>
        <p>
          Question {currentQuestion + 1} of {questions.length}
        </p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {question && (
        <div className="quiz-content">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <h3>{question.question}</h3>
          <div className="topic-tag">
            {question.topic} - {question.difficulty}
          </div>

          <div className="options">
            {question.options.map((option, idx) => (
              <label key={idx} className="option">
                <input
                  type="radio"
                  name="answer"
                  checked={answers[currentQuestion] === idx}
                  onChange={() => handleAnswerSelect(idx)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          <div className="quiz-navigation">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="nav-btn"
            >
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button onClick={handleSubmit} className="submit-btn">
                Submit Test
              </button>
            ) : (
              <button onClick={handleNext} className="nav-btn">
                Next
              </button>
            )}
          </div>

          <div className="quiz-status">
            <p>
              Answered: {answers.filter((a) => a !== null).length} /{" "}
              {questions.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiagnosticTest;
