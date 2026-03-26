# API Documentation

## Base URL

`http://localhost:5000/api`

## Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User

```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "targetCompany": "Amazon",
  "studyHoursPerDay": 2
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "targetCompany": "Amazon"
  }
}
```

### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {...}
}
```

### Get Profile

```
GET /auth/profile
Authorization: Bearer <token>

Response:
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "targetCompany": "Amazon",
  "studyHoursPerDay": 2
}
```

### Update Profile

```
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "targetCompany": "Google",
  "studyHoursPerDay": 3
}
```

---

## Company Endpoints

### Get All Companies

```
GET /companies/all

Response:
[
  {
    "id": "company_id",
    "name": "Amazon",
    "topicWeightage": {
      "DSA": 40,
      "DBMS": 20,
      "OS": 15,
      "CN": 15,
      "Aptitude": 10
    },
    "difficultyLevel": "Hard",
    "frequentlyAskedTopics": [...]
  },
  ...
]
```

### Get Company by Name

```
GET /companies/:name
Example: /companies/Amazon
```

### Get Company Requirements

```
GET /companies/requirements?targetCompany=Amazon

Response:
{
  "company": "Amazon",
  "topicWeightage": {...},
  "frequentlyAskedTopics": [...],
  "focusAreas": [...],
  "difficulty": "Hard"
}
```

---

## Quiz Endpoints

### Get Diagnostic Test

```
GET /quiz/diagnostic

Response:
{
  "quizType": "Diagnostic",
  "totalQuestions": 25,
  "questions": [
    {
      "id": "question_id",
      "topic": "DSA",
      "difficulty": "Easy",
      "question": "What is the time complexity...",
      "options": ["O(n)", "O(log n)", "O(n log n)", "O(n²)"]
    },
    ...
  ]
}
```

### Submit Quiz

```
POST /quiz/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "quizType": "Diagnostic",
  "answers": [
    {
      "questionId": "q_id",
      "selectedAnswer": 1
    },
    ...
  ]
}

Response:
{
  "message": "Quiz submitted successfully",
  "quizId": "quiz_id",
  "overallScore": 18,
  "percentageScore": "72.00",
  "topicScores": {
    "DSA": 80.0,
    "DBMS": 70.0,
    "OS": 60.0,
    "CN": 75.0,
    "Aptitude": 65.0
  },
  "totalQuestions": 25
}
```

### Get Quiz Results

```
GET /quiz/results/:quizId
Authorization: Bearer <token>
```

### Get Quiz History

```
GET /quiz/history
Authorization: Bearer <token>

Response:
{
  "totalQuizzesTaken": 3,
  "quizzes": [
    {
      "id": "quiz_id",
      "type": "Diagnostic",
      "score": 18,
      "percentageScore": 72.0,
      "completedAt": "2026-03-26T10:00:00Z"
    }
  ]
}
```

---

## Analysis Endpoints

### Get Skill Analysis

```
POST /analysis/skills
Authorization: Bearer <token>
Content-Type: application/json

{
  "quizId": "quiz_id"
}

Response:
{
  "message": "Skill analysis completed",
  "analysisId": "analysis_id",
  "skillLevel": "Intermediate",
  "weakTopics": ["OS", "CN"],
  "strongTopics": ["DSA", "DBMS"],
  "topicScores": {...},
  "overallPercentage": 72.0
}
```

### Get Latest Analysis

```
GET /analysis/latest
Authorization: Bearer <token>

Response:
{
  "skillLevel": "Intermediate",
  "weakTopics": ["OS", "CN"],
  "strongTopics": ["DSA", "DBMS"],
  "topicScores": {...},
  "analysisDate": "2026-03-26T10:00:00Z"
}
```

### Get Skill Progression

```
GET /analysis/progression
Authorization: Bearer <token>

Response:
{
  "progression": [
    {
      "date": "2026-03-20T...",
      "skillLevel": "Beginner",
      "weakTopics": [...],
      "strongTopics": [...]
    },
    {
      "date": "2026-03-26T...",
      "skillLevel": "Intermediate",
      "weakTopics": [...],
      "strongTopics": [...]
    }
  ]
}
```

---

## Learning Path Endpoints

### Generate Learning Path

```
POST /learning-path/generate
Authorization: Bearer <token>

Response:
{
  "message": "Learning path generated successfully",
  "pathId": "path_id",
  "learningPath": [
    {
      "topicName": "OS",
      "priority": "High",
      "prerequisites": ["Processes"],
      "estimatedDays": 5,
      "status": "Not Started"
    },
    ...
  ],
  "totalDaysEstimated": 30,
  "targetCompany": "Amazon"
}
```

### Get Learning Path

```
GET /learning-path
Authorization: Bearer <token>
```

### Update Topic Status

```
PUT /learning-path/update-topic
Authorization: Bearer <token>
Content-Type: application/json

{
  "topicName": "OS",
  "status": "In Progress"
}

Statuses: "Not Started", "In Progress", "Completed"
```

---

## Recommendation Endpoints

### Get Recommendations

```
GET /recommendations?topics=DSA,OS&targetCompany=Amazon
Authorization: Bearer <token>

Response:
{
  "message": "Recommendations generated",
  "totalResources": 5,
  "resources": [
    {
      "id": "resource_id",
      "title": "LeetCode - Array Problems",
      "type": "Problem",
      "topic": "DSA",
      "url": "https://...",
      "difficulty": "Easy",
      "companyRelevance": ["Amazon", "Google"],
      "description": "Practice array and string..."
    },
    ...
  ]
}
```

### Get Resources by Topic

```
GET /recommendations/topic?topic=DSA&difficulty=Easy
```

### Get All Resources

```
GET /recommendations/all
```

---

## Progress Endpoints

### Get Progress

```
GET /progress
Authorization: Bearer <token>

Response:
{
  "topicProgress": [
    {
      "topic": "DSA",
      "completedPercentage": 60,
      "quizzesTaken": 2,
      "averageScore": 75.0,
      "lastUpdated": "2026-03-26T..."
    }
  ],
  "overallProgress": 65.0,
  "readinessPercentage": 68.5,
  "improvementTrends": [...]
}
```

### Update Topic Progress

```
PUT /progress/update-topic
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "DSA",
  "completedPercentage": 80,
  "score": 85
}
```

### Calculate Readiness

```
GET /progress/readiness
Authorization: Bearer <token>

Response:
{
  "readinessPercentage": "68.50",
  "overallProgress": "65.00",
  "topicProgress": [...],
  "improvementTrends": [...]
}
```

### Get Improvement Analysis

```
GET /progress/improvement
Authorization: Bearer <token>

Response:
{
  "improvement": "15.5%",
  "currentScore": 85.0,
  "previousScore": 73.6,
  "trends": [...]
}
```

---

## Study Plan Endpoints

### Generate Study Plan

```
POST /study-plan/generate
Authorization: Bearer <token>

Response:
{
  "message": "Study plan generated",
  "planId": "plan_id",
  "weeklySchedule": [
    {
      "day": "Monday",
      "topics": ["Arrays"],
      "estimatedHours": 2,
      "priority": "High"
    },
    ...
  ],
  "dailyTasks": [
    {
      "date": "2026-03-26",
      "tasks": [
        {
          "topic": "DSA",
          "subtopic": "Concept 1",
          "hours": 2,
          "completed": false
        }
      ]
    }
  ]
}
```

### Get Study Plan

```
GET /study-plan
Authorization: Bearer <token>
```

### Update Task Completion

```
PUT /study-plan/update-task
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "task_id",
  "completed": true
}
```

---

## Mock Test Endpoints

### Get Mock Test

```
GET /mock-test?targetCompany=Amazon&difficulty=Hard

Response:
{
  "quizType": "Mock",
  "totalQuestions": 50,
  "duration": 120,
  "questions": [
    {
      "id": "q_id",
      "topic": "DSA",
      "question": "...",
      "options": [...]
    },
    ...
  ]
}
```

### Submit Mock Test

```
POST /mock-test/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetCompany": "Amazon",
  "answers": [
    {
      "questionId": "q_id",
      "selectedAnswer": 2
    },
    ...
  ]
}

Response:
{
  "message": "Mock test submitted",
  "quizId": "quiz_id",
  "performanceAnalysis": {
    "score": 85.0,
    "strength": "Problem Solving",
    "areasToImprove": ["OS", "CN"]
  },
  "weakAreas": ["OS", "CN"],
  "readinessFeedback": "Great! You are well-prepared...",
  "percentageScore": 85.0,
  "overallScore": 42
}
```

### Get Mock Test Feedback

```
GET /mock-test/feedback/:mockTestId
Authorization: Bearer <token>

Response:
{
  "percentageScore": 85.0,
  "overallScore": 42,
  "totalQuestions": 50,
  "completedAt": "2026-03-26T..."
}
```

---

## ML Service Endpoints

### Base URL: `http://localhost:5001`

### Analyze Skills

```
POST /analyze-skills
Content-Type: application/json

{
  "quizResults": {
    "DSA": 80.0,
    "DBMS": 70.0,
    "OS": 60.0,
    "CN": 75.0,
    "Aptitude": 65.0
  },
  "overallScore": 72.0,
  "targetCompany": "Amazon"
}

Response:
{
  "success": true,
  "skillLevel": "Intermediate",
  "weakTopics": ["OS"],
  "strongTopics": ["DSA"],
  "confidence": 0.92
}
```

### Generate Learning Path

```
POST /generate-learning-path
{
  "weakTopics": ["OS", "CN"],
  "strongTopics": ["DSA", "DBMS"],
  "targetCompany": "Amazon",
  "skillLevel": "Intermediate",
  "studyHoursPerDay": 2
}

Response:
{
  "success": true,
  "learningPath": [...],
  "totalDaysEstimated": 30
}
```

### Recommend Resources

```
POST /recommend-resources
{
  "userTopics": ["DSA", "OS"],
  "targetCompany": "Amazon",
  "availableResources": [...]
}

Response:
{
  "success": true,
  "recommendations": ["resource_id_1", "resource_id_2", ...]
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "message": "Invalid input parameters"
}
```

### 401 Unauthorized

```json
{
  "message": "Invalid or expired token"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 500 Server Error

```json
{
  "message": "Internal server error"
}
```

---

## Rate Limiting

- 100 requests per hour per IP for public endpoints
- 1000 requests per hour per user for authenticated endpoints

## Pagination

Some endpoints support pagination:

```
GET /endpoint?page=1&limit=10
```

---

**Last Updated: March 2026**
