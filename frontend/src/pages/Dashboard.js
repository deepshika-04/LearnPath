import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/api';
import { authUtils } from '../utils/auth';
import '../styles/dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    readiness: 0,
    quizzesTaken: 0,
    topicsCompleted: 0
  });

  useEffect(() => {
    const currentUser = authUtils.getUser();
    setUser(currentUser);
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const token = authUtils.getToken();
      const progress = await apiClient.getProgress(token);
      const readiness = await apiClient.calculateReadiness(token);
      
      setStats({
        readiness: readiness.readinessPercentage || 0,
        topicsCompleted: progress.topicProgress?.length || 0,
        quizzesTaken: 0
      });
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authUtils.logout();
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>LearnPath Dashboard</h1>
          <p>Welcome, {user?.name}!</p>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="company-banner">
        <h2>Preparing for {user?.targetCompany}</h2>
        <p>Study Hours per Day: {user?.studyHoursPerDay} hours</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Readiness Score</h3>
          <div className="stat-value">{Math.round(stats.readiness)}%</div>
          <p>Preparation for target company</p>
        </div>
        <div className="stat-card">
          <h3>Topics in Progress</h3>
          <div className="stat-value">{stats.topicsCompleted}</div>
          <p>Topics you're learning</p>
        </div>
        <div className="stat-card">
          <h3>Quizzes Taken</h3>
          <div className="stat-value">{stats.quizzesTaken}</div>
          <p>Assessment attempts</p>
        </div>
      </div>

      <div className="action-grid">
        <div className="action-card">
          <h3>Diagnostic Test</h3>
          <p>Assess your current skills across all topics</p>
          <button onClick={() => navigate('/diagnostic-test')}>Start Test</button>
        </div>
        
        <div className="action-card">
          <h3>Learning Path</h3>
          <p>View your personalized preparation roadmap</p>
          <button onClick={() => navigate('/learning-path')}>View Path</button>
        </div>

        <div className="action-card">
          <h3>Resources</h3>
          <p>Recommended videos, articles, and problems</p>
          <button onClick={() => navigate('/resources')}>Explore</button>
        </div>

        <div className="action-card">
          <h3>Progress Tracking</h3>
          <p>Monitor your improvement and trends</p>
          <button onClick={() => navigate('/progress')}>View Progress</button>
        </div>

        <div className="action-card">
          <h3>Study Plan</h3>
          <p>Daily and weekly study schedule</p>
          <button onClick={() => navigate('/study-plan')}>Get Schedule</button>
        </div>

        <div className="action-card">
          <h3>Mock Test</h3>
          <p>Full-length company-level mock test</p>
          <button onClick={() => navigate('/mock-test')}>Take Test</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
