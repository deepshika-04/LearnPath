import React, { useState, useEffect } from "react";
import { apiClient } from "../utils/api";
import { authUtils } from "../utils/auth";
import "../styles/quiz.css";

function DiagnosticTest() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

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
    try {
      const token = authUtils.getToken();
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

      setResult(response);
      setSubmitted(true);

      // Get skill analysis
      const analysis = await apiClient.getSkillAnalysis(response.quizId, token);
      console.log("Skill analysis:", analysis);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (loading) return <div className="loading">Loading diagnostic test...</div>;

  if (submitted) {
    return (
      <div className="quiz-result">
        <h2>Test Results</h2>
        <div className="result-score">
          <h3>Your Score: {result.percentageScore.toFixed(2)}%</h3>
          <p>
            Correct Answers: {result.overallScore} / {result.totalQuestions}
          </p>
        </div>
        <div className="result-topics">
          <h4>Topic-wise Performance:</h4>
          <ul>
            {Object.entries(result.topicScores).map(([topic, score]) => (
              <li key={topic}>
                {topic}: {score.toFixed(2)}%
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
