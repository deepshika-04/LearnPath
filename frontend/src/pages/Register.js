import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../utils/api";
import { authUtils } from "../utils/auth";
import "../styles/auth.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    targetCompany: "Amazon",
    studyHoursPerDay: 2,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const companies = [
    "Amazon",
    "Google",
    "Microsoft",
    "Meta",
    "TCS",
    "Infosys",
    "Wipro",
    "Accenture",
    "Cognizant",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "studyHoursPerDay" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await apiClient.register(formData);

      if (result.token) {
        authUtils.setToken(result.token);
        authUtils.setUser(result.user);
        navigate("/dashboard");
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>LearnPath</h1>
        <h2>Register</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            name="targetCompany"
            value={formData.targetCompany}
            onChange={handleChange}
          >
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="studyHoursPerDay"
            placeholder="Study Hours Per Day"
            min="1"
            max="12"
            value={formData.studyHoursPerDay}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
