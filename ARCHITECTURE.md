# Architecture & Design Document

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pages: Login, Register, Dashboard, Tests, Progress, etc │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Utils: API Client, Auth Helper, Local Storage Manager   │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Styles: Responsive CSS with gradient themes              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                    (Port: 3000 - React Dev Server)             │
└────────────┬─────────────────────────────────────────────────────┘
             │
             │ HTTP/REST
             │
┌────────────▼─────────────────────────────────────────────────────┐
│               Backend API Gateway (Express)                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Routes:                                                   │   │
│  │  - /api/auth       → Authentication                      │   │
│  │  - /api/companies  → Company Profiles                    │   │
│  │  - /api/quiz       → Diagnostic & Topic Tests            │   │
│  │  - /api/analysis   → ML-based Skill Analysis             │   │
│  │  - /api/learning-path → Learning Path Generation         │   │
│  │  - /api/recommendations → Resource Recommendations       │   │
│  │  - /api/progress   → Progress Tracking                   │   │
│  │  - /api/study-plan → Daily Schedule                      │   │
│  │  - /api/mock-test  → Final Assessment                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Controllers: Business Logic for each module               │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Middleware: JWT Authentication, Error Handling           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                    (Port: 5000 - Node.js)                       │
└────────────┬─────────────┬─────────────────────────────────────┘
             │             │
    ┌────────▼───┐   ┌─────▼──────────┐
    │ MongoDB    │   │ ML Service     │
    │ Database   │   │ (Python Flask) │
    │            │   │ (Port: 5001)   │
    └────────────┘   └────────────────┘
```

## Data Flow Architecture

### 1. User Registration & Authentication
```
User Input → Frontend Form
    ↓
API Client (api.js) → POST /api/auth/register
    ↓
Backend Validation → Check Email Uniqueness
    ↓
Password Hash (bcrypt) → Database Save
    ↓
JWT Generation → Return Token
    ↓
Frontend (authUtils.js) → Store Token & User Data
    ↓
Redirect to Dashboard
```

### 2. Diagnostic Test Flow
```
User Clicks "Start Test" → Dashboard
    ↓
Frontend → GET /api/quiz/diagnostic
    ↓
Backend → Query MongoDB (Question collection)
    ↓
Return 25 Questions (5 per topic)
    ↓
User Answers Questions → Frontend Form
    ↓
Submit Answers → POST /api/quiz/submit
    ↓
Backend Calculates Scores → Save to Database
    ↓
Frontend Receives Results
    ↓
Trigger ML Analysis → POST /api/analysis/skills
    ↓
ML Service (Python) → Decision Tree + Random Forest
    ↓
Return Skill Level & Weak/Strong Topics
    ↓
Save Analysis → MongoDB
    ↓
Update Dashboard with Results
```

### 3. Learning Path Generation
```
User Views Dashboard → Check Skill Analysis
    ↓
Generate Learning Path → POST /api/learning-path/generate
    ↓
Backend Fetches Latest Analysis
    ↓
Send to ML Service → POST /generate-learning-path
    ↓
Python Algorithm:
  ├─ Build Topic DAG
  ├─ Calculate In-Degrees
  ├─ Topological Sort (Kahn's)
  ├─ Priority Assignment
  └─ Estimate Days
    ↓
Return Ordered Topic List
    ↓
Backend Saves to Database
    ↓
Frontend Displays Learning Path
    ├─ High Priority (Red)
    ├─ Medium Priority (Orange)
    └─ Low Priority (Green)
```

### 4. Resource Recommendation Flow
```
User Selects Topics → Resources Page
    ↓
Fetch Resources → GET /recommendations?topics=DSA,OS
    ↓
Backend Gets Available Resources
    ↓
Send to ML Service → POST /recommend-resources
    ↓
Python Algorithm (Cosine Similarity):
  ├─ Create User Profile Vector
  ├─ Create Resource Profile Vectors
  ├─ Calculate Similarity Scores
  ├─ Apply Company Boost
  └─ Rank Results
    ↓
Return Top 10 Resources
    ↓
Frontend Displays Cards
    └─ Videos, Articles, Problems
```

### 5. Progress Tracking
```
User Completes Topic → Study Plan
    ↓
Mark Complete → PUT /progress/update-topic
    ↓
Backend Updates Progress Record
    ↓
Recalculate Metrics:
  ├─ Topic Completion %
  ├─ Overall Progress %
  └─ Readiness Score
    ↓
Store Improvement Trend
    ↓
Frontend Updates Dashboard
    ├─ Progress Bars
    ├─ Readiness Gauge
    └─ Trend Charts
```

## Database Schema Relationships

```
User
  ├─ Has Many: Quiz
  ├─ Has Many: SkillAnalysis
  ├─ Has One: LearningPath
  ├─ Has One: Progress
  ├─ Has One: StudyPlan
  └─ targetCompany → Reference → Company

Company
  ├─ Has Many: Questions
  └─ Has Many: Resources

Question
  ├─ Many To Many: Quiz (through answers)
  └─ topic (DSA, DBMS, OS, CN, Aptitude)

Quiz
  ├─ Belongs To: User
  ├─ Contains: Multiple Answers
  ├─ Links To: SkillAnalysis
  └─ Stores: Topic Scores

SkillAnalysis
  ├─ Belongs To: User
  ├─ References: Quiz
  └─ Used For: Learning Path Generation

LearningPath
  ├─ Belongs To: User
  └─ Tracks: Topic Status

Resource
  ├─ Has Many: Tags
  └─ Belongs To: Company (implicit)

Progress
  ├─ Belongs To: User
  ├─ Topic Progress (Array)
  └─ Improvement Trends (Array)

StudyPlan
  ├─ Belongs To: User
  ├─ Weekly Schedule (Array)
  └─ Daily Tasks (Array)
```

## ML Service Architecture

### Skill Analysis Pipeline
```
┌─────────────────────────────────────┐
│ Input: Quiz Results (topic scores)  │
└────────────┬────────────────────────┘
             │
    ┌────────▼────────┐
    │ Data Scaling    │
    │ (StandardScaler)│
    └────────┬────────┘
             │
    ┌────────▼──────────────────────────┐
    │ Decision Tree Classifier           │
    │ ├─ max_depth: 5                    │
    │ └─ Prediction: Skill Level         │
    └────────┬──────────────────────────┘
             │
    ┌────────▼──────────────────────────┐
    │ Random Forest Classifier           │
    │ ├─ n_estimators: 10                │
    │ └─ Prediction: Skill Level         │
    └────────┬──────────────────────────┘
             │
    ┌────────▼────────────────────┐
    │ Ensemble Voting             │
    │ (Majority Vote)             │
    └────────┬────────────────────┘
             │
    ┌────────▼────────────────────┐
    │ Topic Analysis              │
    │ ├─ Weak Topics (score<50%)  │
    │ ├─ Strong Topics (score≥75%)│
    │ └─ Confidence Score         │
    └────────┬────────────────────┘
             │
┌────────────▼──────────────────────────┐
│ Output: {skillLevel, weakTopics,      │
│          strongTopics, confidence}    │
└──────────────────────────────────────┘
```

### Learning Path Generation Pipeline
```
┌──────────────────────────┐
│ Input: Weak/Strong Topics,
│ Company Weights,         │
│ Skill Level              │
└─────────┬────────────────┘
          │
┌─────────▼───────────────────┐
│ Build Topic DAG             │
│ ├─ Nodes: Topics            │
│ ├─ Edges: Prerequisites     │
│ └─ Example: Trees→Graphs    │
└─────────┬───────────────────┘
          │
┌─────────▼───────────────────┐
│ Calculate In-Degrees        │
│ (Kahn's Algorithm Setup)    │
└─────────┬───────────────────┘
          │
┌─────────▼───────────────────┐
│ Topological Sort            │
│ ├─ Initialize Queue         │
│ ├─ Process Nodes            │
│ └─ Output: Sorted Topics    │
└─────────┬───────────────────┘
          │
┌─────────▼───────────────────┐
│ Priority Assignment         │
│ ├─ High: Weak Topics        │
│ ├─ Medium: Company Priority │
│ └─ Low: Strong Topics       │
└─────────┬───────────────────┘
          │
┌─────────▼───────────────────┐
│ Estimate Duration           │
│ ├─ Per Topic Days           │
│ ├─ Adjusted by Level        │
│ └─ Total Duration           │
└─────────┬───────────────────┘
          │
┌─────────▼─────────────────────┐
│ Output: [{topicName,          │
│          priority,            │
│          prerequisites,       │
│          estimatedDays}]      │
└───────────────────────────────┘
```

### Resource Recommendation Pipeline
```
┌────────────────────────────────┐
│ Input: User Topics,            │
│ Target Company,                │
│ Available Resources            │
└────────┬───────────────────────┘
         │
┌────────▼────────────────────┐
│ Create User Profile Vector  │
│ ├─ Topic Preferences        │
│ └─ Binary Encoding          │
└────────┬────────────────────┘
         │
┌────────▼────────────────────┐
│ Create Resource Profiles    │
│ ├─ Topic Score              │
│ ├─ Difficulty Score         │
│ └─ Type Score               │
└────────┬────────────────────┘
         │
┌────────▼────────────────────┐
│ Calculate Cosine Similarity │
│ For Each Resource           │
│ similarity = dot(u,r)/      │
│            (||u||*||r||)    │
└────────┬────────────────────┘
         │
┌────────▼────────────────────┐
│ Apply Company Boost         │
│ ├─ +0.2 if relevant         │
│ └─ Updated Score            │
└────────┬────────────────────┘
         │
┌────────▼────────────────────┐
│ Rank & Sort Results         │
│ Top 10 Resources            │
└────────┬────────────────────┘
         │
┌────────▼──────────────────────┐
│ Output: [resource_id_1,       │
│          resource_id_2, ...]  │
└───────────────────────────────┘
```

## Component Interaction Diagram

```
Frontend Application Structure:
┌─────────────────────────────────────┐
│ React App (App.js)                  │
├─────────────────────────────────────┤
│                                     │
│  Router Configuration:              │
│  ├─ /login → Login Component        │
│  ├─ /register → Register Component  │
│  ├─ /dashboard → Dashboard          │
│  ├─ /diagnostic-test → DiagTest     │
│  ├─ /learning-path → LearningPath   │
│  ├─ /resources → Resources          │
│  ├─ /progress → Progress            │
│  ├─ /study-plan → StudyPlan         │
│  └─ /mock-test → MockTest           │
│                                     │
│  Protected Routes:                  │
│  └─ Use ProtectedRoute HOC          │
│     (checks authUtils.isAuthenticated)
│                                     │
└─────────────────────────────────────┘

Utilities:
├─ api.js (API Client)
│  └─ All fetch() calls to backend
│
└─ auth.js (Auth Manager)
   ├─ setToken/getToken
   ├─ setUser/getUser
   └─ logout

State Management:
├─ React Hooks (useState, useEffect)
├─ Local Storage (tokens, user data)
└─ Context (optional, for global state)
```

## Authentication Flow

```
┌──────────────────────────────┐
│ User Registration            │
├──────────────────────────────┤
│ 1. Enter Email/Password      │
│ 2. Frontend Validation       │
│ 3. API Call (POST register)  │
│ 4. Backend Validation        │
│ 5. Bcrypt Hash Password      │
│ 6. Save User to MongoDB      │
│ 7. Generate JWT Token        │
│ 8. Return Token + User Data  │
│ 9. Frontend: Store Token     │
│ 10. Redirect to Dashboard    │
└──────────────────────────────┘

┌──────────────────────────────┐
│ User Login                   │
├──────────────────────────────┤
│ 1. Enter Credentials         │
│ 2. API Call (POST login)     │
│ 3. Backend: Find User        │
│ 4. Compare Passwords         │
│ 5. Generate JWT Token        │
│ 6. Return Token + User Data  │
│ 7. Frontend: Store Token     │
│ 8. Redirect to Dashboard     │
└──────────────────────────────┘

┌──────────────────────────────┐
│ Protected Route Access       │
├──────────────────────────────┤
│ 1. Include Token in Header   │
│    Authorization: Bearer X   │
│ 2. Backend Middleware        │
│ 3. Verify JWT Signature      │
│ 4. Extract User ID           │
│ 5. Attach to req.userId      │
│ 6. Next Middleware           │
│ 7. Process Request           │
│ 8. Return Response           │
└──────────────────────────────┘
```

## Error Handling Strategy

```
Frontend Error Handling:
├─ Network Errors
│  └─ Display connection error message
├─ Validation Errors (4xx)
│  ├─ 400: Show error message
│  ├─ 401: Redirect to login
│  └─ 404: Show not found
└─ Server Errors (5xx)
   └─ Show generic error, log to console

Backend Error Handling:
├─ Input Validation
│  └─ Return 400 with error message
├─ Authentication Failures
│  └─ Return 401 Unauthorized
├─ Not Found Errors
│  └─ Return 404 Not Found
├─ Database Errors
│  └─ Return 500 with generic message
└─ ML Service Errors
   └─ Return 503 Service Unavailable

ML Service Error Handling:
├─ Invalid Input Format
│  └─ Return 400 Bad Request
├─ Missing Required Fields
│  └─ Return 400 Bad Request
├─ Model Loading Errors
│  └─ Return 503 Service Unavailable
└─ Computation Errors
   └─ Return 500 Internal Error
```

## Scalability Considerations

### Horizontal Scaling
```
Load Balancer
    ├─ Backend Servers (Multiple instances)
    ├─ ML Services (Multiple instances)
    ├─ MongoDB Replica Set
    └─ Redis Cache (optional)
```

### Database Optimization
```
Indexes:
├─ User: email (unique)
├─ Quiz: userId, createdAt
├─ SkillAnalysis: userId, analysisDate
├─ Progress: userId
└─ LearningPath: userId, generatedAt

Queries:
├─ Pagination support
├─ Lean queries for large result sets
└─ Proper joins/population
```

### Caching Strategy
```
Frontend Cache:
├─ API responses in localStorage
├─ User data in sessionStorage
└─ Quiz questions in memory

Backend Cache:
├─ Redis for company profiles
├─ Cache ML model predictions
└─ Cache resource recommendations

ML Service Cache:
├─ Pre-trained models
└─ Feature preprocessing
```

## Deployment Architecture

```
Production Environment:

┌─────────────────┐
│  Vercel/Netlify │  (Frontend)
│   React App     │
└────────┬────────┘
         │
    ┌────▼──────────┐
    │ CDN            │ (Static assets)
    └────┬──────────┘
         │
    ┌────▼────────────────┐
    │ API Gateway/         │
    │ Load Balancer        │
    └────┬────────────────┘
         │
    ┌────▼──────────────┐
    │ Heroku/Railway     │ (Backend Servers)
    │ (multiple dynos)   │
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │ MongoDB Atlas      │ (Cloud Database)
    │ (Replica Set)      │
    └────────────────────┘
         │
    ┌────▼──────────────┐
    │ Render/Heroku      │ (ML Service)
    │ (Python)           │
    └────────────────────┘
```

---

**End of Architecture Document**
