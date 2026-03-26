const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = {
  // Auth APIs
  register: (userData) => 
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(res => res.json()),

  login: (credentials) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then(res => res.json()),

  getProfile: (token) =>
    fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

  // Company APIs
  getAllCompanies: () =>
    fetch(`${API_BASE_URL}/companies/all`).then(res => res.json()),

  getCompanyRequirements: (company) =>
    fetch(`${API_BASE_URL}/companies/requirements?targetCompany=${company}`)
      .then(res => res.json()),

  // Quiz APIs
  getDiagnosticTest: () =>
    fetch(`${API_BASE_URL}/quiz/diagnostic`).then(res => res.json()),

  submitQuiz: (answers, token) =>
    fetch(`${API_BASE_URL}/quiz/submit`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(answers)
    }).then(res => res.json()),

  getQuizHistory: (token) =>
    fetch(`${API_BASE_URL}/quiz/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

  // Analysis APIs
  getSkillAnalysis: (quizId, token) =>
    fetch(`${API_BASE_URL}/analysis/skills`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quizId })
    }).then(res => res.json()),

  getLatestAnalysis: (token) =>
    fetch(`${API_BASE_URL}/analysis/latest`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

  // Learning Path APIs
  generateLearningPath: (token) =>
    fetch(`${API_BASE_URL}/learning-path/generate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

  getLearningPath: (token) =>
    fetch(`${API_BASE_URL}/learning-path`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

  // Recommendations APIs
  getRecommendations: (topics, company, token) =>
    fetch(`${API_BASE_URL}/recommendations?topics=${topics}&targetCompany=${company}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

  // Progress APIs
  getProgress: (token) =>
    fetch(`${API_BASE_URL}/progress`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

  updateTopicProgress: (topicData, token) =>
    fetch(`${API_BASE_URL}/progress/update-topic`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(topicData)
    }).then(res => res.json()),

  calculateReadiness: (token) =>
    fetch(`${API_BASE_URL}/progress/readiness`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

  // Study Plan APIs
  generateStudyPlan: (token) =>
    fetch(`${API_BASE_URL}/study-plan/generate`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

  getStudyPlan: (token) =>
    fetch(`${API_BASE_URL}/study-plan`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

  // Mock Test APIs
  getMockTest: (company) =>
    fetch(`${API_BASE_URL}/mock-test?targetCompany=${company}`)
      .then(res => res.json()),

  submitMockTest: (testData, token) =>
    fetch(`${API_BASE_URL}/mock-test/submit`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testData)
    }).then(res => res.json())
};
