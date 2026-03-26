import React, { useState, useEffect } from "react";
import { apiClient } from "../utils/api";
import { authUtils } from "../utils/auth";
import "../styles/resources.css";

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("DSA");

  const topics = ["DSA", "DBMS", "OS", "CN", "Aptitude"];

  useEffect(() => {
    loadResources();
  }, [selectedTopic]);

  const loadResources = async () => {
    try {
      const token = authUtils.getToken();
      const user = authUtils.getUser();

      const response = await apiClient.getRecommendations(
        selectedTopic,
        user.targetCompany,
        token,
      );

      setResources(response.resources || []);
    } catch (error) {
      console.error("Error loading resources:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resources-container">
      <h2>Learning Resources</h2>

      <div className="topic-filter">
        {topics.map((topic) => (
          <button
            key={topic}
            className={`topic-btn ${selectedTopic === topic ? "active" : ""}`}
            onClick={() => setSelectedTopic(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading resources...</div>
      ) : (
        <div className="resources-grid">
          {resources.length > 0 ? (
            resources.map((resource, idx) => (
              <div key={idx} className="resource-card">
                <div className="resource-header">
                  <h4>{resource.title}</h4>
                  <span className="resource-type">{resource.type}</span>
                </div>
                <p className="resource-description">{resource.description}</p>
                <div className="resource-meta">
                  <span className="difficulty">{resource.difficulty}</span>
                  {resource.companyRelevance && (
                    <span className="company-tag">
                      {resource.companyRelevance[0]}
                    </span>
                  )}
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  Open Resource →
                </a>
              </div>
            ))
          ) : (
            <p>No resources found for this topic.</p>
          )}
        </div>
      )}

      <button
        onClick={() => (window.location.href = "/dashboard")}
        className="back-btn"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default Resources;
