# LearnPath - Company-Specific Placement Preparation System

A comprehensive full-stack web application designed to help students prepare for their target company interviews through personalized, data-driven learning paths.

## Features

### 1. **Authentication Module** ✅

- User registration with name, email, password
- Login authentication with JWT tokens
- Profile management
- Target company selection
- Study hours configuration

### 2. **Company Dataset Module** ✅

- Pre-configured company profiles (Amazon, Google, Microsoft, TCS, Infosys, etc.)
- Topic weightage for each company
- Difficulty levels
- Frequently asked topics
- Company-specific focus areas

### 3. **Diagnostic Test Module** ✅

- Adaptive diagnostic quiz (25 questions across 5 topics)
- Topics: DSA, DBMS, OS, CN, Aptitude
- Multiple difficulty levels
- Topic-wise scoring
- Detailed performance analysis

### 4. **ML-Based Skill Analysis** ✅

- Decision Tree classifier for skill assessment
- Random Forest ensemble model
- Identifies skill level (Beginner/Intermediate/Advanced)
- Detects weak and strong topics
- Confidence scoring

### 5. **Company-Specific Skill Gap Analysis** ✅

- Compares user skills vs company requirements
- Priority-ranked topic suggestions
- Customized improvement recommendations
- Company-aligned preparation focus

### 6. **Learning Path Generation** ✅

- **Topological Sorting DAG** implementation
- Prerequisite-based topic ordering
- Priority-ranked topics (High/Medium/Low)
- Estimated completion time per topic
- Adaptive difficulty based on skill level

### 7. **Resource Recommendation System** ✅

- **Cosine Similarity** content-based filtering
- Multi-source resources (Videos, Articles, Problems)
- Company relevance tagging
- Difficulty-filtered recommendations
- Curated learning materials database

### 8. **Study Plan Generator** ✅

- Daily and weekly schedules
- Personalized task allocation
- Adapts to user's study hours/day
- Progress tracking per day
- Milestone-based learning

### 9. **Progress Tracking Dashboard** ✅

- Topic-wise progress visualization
- Readiness percentage calculation
- Improvement trends analysis
- Quiz history tracking
- Performance metrics

### 10. **Feedback & Adaptive Learning** ✅

- Mini-tests after each topic
- Dynamic skill level updates
- Learning path re-optimization
- Progressive difficulty increase
- Continuous assessment loop

### 11. **Final Mock Test** ✅

- Full-length company-level mock test
- 50 curated questions (company-specific)
- Real interview simulation
- Performance analysis
- **Readiness feedback** (NOT eligibility prediction)
- Weak areas identification

## Tech Stack

### Frontend

- **React.js** 18.2 - UI library
- **React Router** - Navigation
- **CSS3** - Styling with gradient themes
- **Axios** - API calls

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Mongoose** - ODM

### ML Service

- **Python Flask** - ML API server
- **scikit-learn** - ML algorithms
  - Decision Tree Classifier
  - Random Forest Classifier
- **NumPy/Pandas** - Data processing

## Project Structure

```
LearnPath/
├── frontend/                    # React application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── DiagnosticTest.js
│   │   │   ├── LearningPath.js
│   │   │   ├── Resources.js
│   │   │   ├── Progress.js
│   │   │   ├── StudyPlan.js
│   │   │   └── MockTest.js
│   │   ├── components/         # Reusable components
│   │   ├── utils/              # Utilities
│   │   │   ├── api.js         # API client
│   │   │   └── auth.js        # Auth helpers
│   │   ├── styles/             # CSS files
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/                     # Node.js Express server
│   ├── src/
│   │   ├── models/             # MongoDB schemas
│   │   │   ├── User.js
│   │   │   ├── Company.js
│   │   │   ├── Question.js
│   │   │   ├── Quiz.js
│   │   │   ├── SkillAnalysis.js
│   │   │   ├── LearningPath.js
│   │   │   ├── Resource.js
│   │   │   ├── Progress.js
│   │   │   └── StudyPlan.js
│   │   ├── controllers/        # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── companyController.js
│   │   │   ├── quizController.js
│   │   │   ├── analysisController.js
│   │   │   ├── learningPathController.js
│   │   │   ├── recommendationController.js
│   │   │   ├── progressController.js
│   │   │   ├── studyPlanController.js
│   │   │   └── mockTestController.js
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Authentication
│   │   ├── utils/              # Helper functions
│   │   └── services/           # Business logic
│   ├── scripts/
│   │   └── seedData.js        # Database seeding
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env.example
│
├── ml-service/                 # Python Flask ML API
│   ├── src/
│   │   ├── skill_analyzer.py   # ML models
│   │   ├── learning_path_generator.py  # Topological sort
│   │   └── resource_recommender.py     # Cosine similarity
│   ├── models/                 # Trained models storage
│   ├── app.py                 # Flask app
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Companies

- `GET /api/companies/all` - Get all companies
- `GET /api/companies/:name` - Get company details
- `GET /api/companies/requirements` - Get company requirements

### Quiz

- `GET /api/quiz/diagnostic` - Get diagnostic test
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/results/:quizId` - Get results
- `GET /api/quiz/history` - Get quiz history

### Skill Analysis

- `POST /api/analysis/skills` - Perform ML analysis
- `GET /api/analysis/latest` - Get latest analysis
- `GET /api/analysis/progression` - Get skill progression

### Learning Path

- `POST /api/learning-path/generate` - Generate path
- `GET /api/learning-path` - Get current path
- `PUT /api/learning-path/update-topic` - Update topic status

### Resources

- `GET /api/recommendations` - Get recommendations
- `GET /api/recommendations/topic` - Get by topic
- `GET /api/recommendations/all` - All resources

### Progress

- `GET /api/progress` - Get progress
- `PUT /api/progress/update-topic` - Update progress
- `GET /api/progress/readiness` - Calculate readiness

### Study Plan

- `POST /api/study-plan/generate` - Generate plan
- `GET /api/study-plan` - Get plan
- `PUT /api/study-plan/update-task` - Update task

### Mock Test

- `GET /api/mock-test` - Get mock test
- `POST /api/mock-test/submit` - Submit test
- `GET /api/mock-test/feedback/:mockTestId` - Get feedback

## Installation & Setup

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MongoDB (local or cloud)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run seed  # Seed initial data
npm run dev   # Start backend
```

### ML Service Setup

```bash
cd ml-service
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Database Models

### User

```
{
  name: String,
  email: String (unique),
  password: String (hashed),
  targetCompany: String,
  studyHoursPerDay: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Company

```
{
  name: String,
  topicWeightage: {
    DSA: Number,
    DBMS: Number,
    OS: Number,
    CN: Number,
    Aptitude: Number
  },
  difficultyLevel: String,
  frequentlyAskedTopics: [String],
  focusAreas: [String]
}
```

### Quiz

```
{
  userId: ObjectId,
  quizType: String (Diagnostic/Topic-wise/Mock),
  answers: [{
    questionId: ObjectId,
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  topicScores: {DSA, DBMS, OS, CN, Aptitude},
  overallScore: Number,
  percentageScore: Number,
  completedAt: Date
}
```

## ML Algorithms

### Skill Analysis

1. **Decision Tree Classifier**
   - Max depth: 5
   - Input: Topic-wise scores
   - Output: Skill level

2. **Random Forest Classifier**
   - Estimators: 10
   - Ensemble voting for final prediction

### Learning Path Generation

- **Topological Sorting (Kahn's Algorithm)**
- DAG representation of prerequisites
- Topics sorted based on:
  - Prerequisites satisfaction
  - Weak topic priority
  - Company importance weights
  - Estimated completion time

### Resource Recommendation

- **Cosine Similarity**
- User profile = topic preferences
- Resource profile = topic + difficulty + type
- Company relevance boost: +0.2

## Features Implementation

### 1. Authentication

- JWT-based token authentication
- Bcrypt password hashing
- Protected routes with middleware

### 2. Skill Assessment

- Diagnostic test with adaptive difficulty
- ML-based classification
- Weak/strong topic identification

### 3. Personalized Learning Path

- Topological DAG for prerequisites
- Company-specific priority ranking
- Estimated study duration

### 4. Resource Curation

- Content-based similarity filtering
- Company-relevant tagging
- Multi-source resource database

### 5. Progress Tracking

- Topic-wise completion tracking
- Readiness percentage calculation
- Improvement trend analysis

### 6. Adaptive Learning

- Dynamic difficulty adjustment
- Topic re-prioritization
- Continuous assessment

## User Flow

1. **Registration** → Select target company and study hours
2. **Dashboard** → View stats and access features
3. **Diagnostic Test** → Assess current skills
4. **Skill Analysis** → Get ML-powered insights
5. **Learning Path** → View personalized roadmap
6. **Resource Selection** → Get recommendations
7. **Study Plan** → Follow daily schedule
8. **Progress Tracking** → Monitor improvement
9. **Mock Test** → Final assessment and feedback

## Key Algorithms

### Topological Sorting

```
- Represents topics as nodes in a DAG
- Edges represent prerequisites
- Kahn's algorithm for ordering
- Output: Learning sequence
```

### Cosine Similarity

```
- User profile: binary vector of selected topics
- Resource profile: [topic_score, difficulty, type]
- Similarity = dot product / (||u|| * ||r||)
- Higher similarity = better recommendation
```

### Ensemble Classification

```
- Decision Tree prediction
- Random Forest prediction
- Majority voting for final skill level
- Confidence from RF probability
```

## Security

- JWT tokens for authentication
- Bcrypt password hashing
- CORS enabled for frontend
- Input validation on all routes
- Protected routes with auth middleware

## Future Enhancements

1. **Collaborative Filtering** - User-based recommendations
2. **Interview Video Analytics** - Video solution tracking
3. **Competitive Analysis** - Compare with peer performance
4. **Peer Learning** - Discuss and share doubts
5. **Real-time Notifications** - Reminders and updates
6. **Mobile App** - React Native version
7. **Advanced Analytics** - Detailed performance insights
8. **Interview Prep** - Mock interviews with AI feedback

## Performance Metrics

- **Page Load Time** < 2s
- **API Response Time** < 500ms
- **ML Prediction Time** < 1s
- **Database Query Optimization** with indexes

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# ML model tests
cd ml-service
pytest
```

## Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy build/ folder
```

### Backend (Heroku/Railway)

```bash
git push heroku main
```

### ML Service (Heroku/Render)

```bash
git push render main
```

## Important Notes

✅ **NO eligibility prediction** - System provides preparation guidance only
✅ **Company-specific focus** - Tailored to each company's requirements
✅ **Adaptive learning** - Difficulty adjusts based on performance
✅ **Evidence-based approach** - Uses ML and DAGs for insights
✅ **Comprehensive tracking** - Monitor every aspect of preparation

## License

MIT License

## Support

For issues and feature requests, please create an issue in the repository.

---

**LearnPath: Your Personalized Path to Success** 🚀
