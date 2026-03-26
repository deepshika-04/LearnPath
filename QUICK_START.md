# QUICK START GUIDE

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v14+
- Python 3.8+
- MongoDB (local or cloud)
- Git

---

## Step 1: Clone & Navigate

```bash
cd d:\clg\learnpath\LearnPath
```

---

## Step 2: Start Backend

```bash
cd backend
npm install
npm run seed      # Populate sample data
npm run dev       # Start on http://localhost:5000
```

**Open new terminal:**

---

## Step 3: Start ML Service

```bash
cd ml-service
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
python app.py               # Runs on http://localhost:5001
```

**Open new terminal:**

---

## Step 4: Start Frontend

```bash
cd frontend
npm install
npm start                   # Opens http://localhost:3000
```

---

## 🎯 Test the Application

### 1. Register
- Go to http://localhost:3000/register
- Fill form with:
  - Name: Test User
  - Email: test@example.com
  - Password: password123
  - Company: Amazon
  - Study Hours: 2
- Click Register → Redirects to Dashboard

### 2. Dashboard Overview
- See readiness score: 0%
- See action cards for all features
- Topics in progress: 0

### 3. Take Diagnostic Test
- Click "Start Test" button
- Answer 25 questions (5 per topic)
- View results page
- See topic-wise scores

### 4. Generate Learning Path
- Click "View Path"
- System generates personalized roadmap
- See topics with priorities and estimated days

### 5. View Resources
- Click "Explore Resources"
- Select topic (DSA, DBMS, OS, CN, Aptitude)
- See recommended materials

### 6. Check Progress
- Click "View Progress"
- See readiness gauge
- View topic progress bars

### 7. Get Study Plan
- Click "Get Schedule"
- See weekly schedule
- View daily tasks

### 8. Take Mock Test
- Click "Take Test"
- Complete final assessment
- Get readiness feedback

---

## 📊 Sample Credentials

```
Email: test@example.com
Password: password123
Company: Amazon
Study Hours: 2
```

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change port in .env or kill process using port |
| MongoDB connection error | Ensure MongoDB is running: `mongod` |
| Module not found | Delete node_modules, run `npm install` again |
| Python venv error | Delete venv folder, recreate: `python -m venv venv` |
| CORS errors | Backend CORS already configured |
| API 404 errors | Ensure all 3 services running on correct ports |

---

## 📁 Project Structure Quick Reference

```
backend/          → Node.js + Express API
├── src/
│   ├── models/   → MongoDB schemas
│   ├── controllers/ → Business logic
│   ├── routes/   → API endpoints
│   └── middleware/ → JWT auth
└── server.js

ml-service/       → Python Flask ML API
├── src/
│   ├── skill_analyzer.py
│   ├── learning_path_generator.py
│   └── resource_recommender.py
└── app.py

frontend/         → React.js UI
├── src/
│   ├── pages/    → Page components
│   ├── utils/    → API client
│   ├── styles/   → CSS files
│   └── App.js
└── package.json
```

---

## 🔑 Key Features Demo

### Feature 1: Skill Assessment
- Complete diagnostic test
- ML models analyze results
- Get skill level (Beginner/Intermediate/Advanced)

### Feature 2: Learning Path
- Topological sorting for prerequisites
- Company-specific priorities
- Estimated study duration

### Feature 3: Recommendations
- Cosine similarity algorithm
- Personalized resources
- Company-relevant filtering

### Feature 4: Progress Tracking
- Topic completion percentage
- Readiness gauge
- Improvement trends

### Feature 5: Study Schedule
- Daily tasks generation
- Weekly schedule planning
- Adaptive timing based on study hours

### Feature 6: Mock Test
- Full-length practice test
- Performance analysis
- Readiness feedback

---

## 📚 Documentation Files

1. **README.md** - Full project documentation
2. **SETUP.md** - Detailed setup instructions
3. **API.md** - Complete API reference
4. **ARCHITECTURE.md** - System design & flow
5. **QUICK_START.md** (this file) - Quick reference

---

## 🌐 Endpoints Reference

### Most Used
```
POST   /api/auth/login              → Login
POST   /api/auth/register           → Register
GET    /api/quiz/diagnostic         → Get test
POST   /api/quiz/submit             → Submit answers
POST   /api/analysis/skills         → ML analysis
POST   /api/learning-path/generate  → Generate path
GET    /api/learning-path           → Get path
GET    /api/recommendations         → Get resources
GET    /api/progress                → Get progress
POST   /api/study-plan/generate     → Generate schedule
GET    /api/mock-test               → Get mock test
POST   /api/mock-test/submit        → Submit mock
```

---

## 💡 Pro Tips

1. **Data Persistence** - Browser local storage keeps you logged in
2. **Quiz History** - All quiz attempts are saved and tracked
3. **Progressive Learning** - Difficulty adjusts based on performance
4. **Company Focus** - Each company has unique topic weightages
5. **Mobile Friendly** - Responsive design works on all devices

---

## 🔒 Security Notes

- Passwords hashed with bcrypt
- JWT tokens expire after 7 days
- Protected API routes require authentication
- CORS enabled for localhost
- Input validation on all endpoints

---

## 📈 Next Steps

### After Quick Start
1. Customize company data
2. Add more questions to database
3. Configure ML model hyperparameters
4. Deploy to production
5. Add more learning resources

### Production Deployment
```bash
# Frontend
npm run build
# Deploy to Vercel/Netlify

# Backend
git push heroku main
# Set environment variables

# ML Service
git push render main
```

---

## 🆘 Need Help?

### Check Logs
```bash
# Backend logs
npm run dev

# ML Service logs
python app.py

# Frontend console
F12 → Console tab
```

### Common Commands
```bash
# Backend
npm install         # Install dependencies
npm run seed        # Populate database
npm run dev         # Start server

# ML Service
pip install -r requirements.txt  # Install packages
python app.py                    # Start server

# Frontend
npm install         # Install dependencies
npm start           # Start dev server
npm run build       # Create production build
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] ML Service running on port 5001
- [ ] Frontend running on port 3000
- [ ] MongoDB connected successfully
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can view dashboard
- [ ] Can take diagnostic test
- [ ] Can view learning path
- [ ] Can see resources

---

## 🎓 Learning Outcomes

After using LearnPath, students will:
- Understand their skill level objectively
- Know exactly which topics to focus on
- Have a personalized study roadmap
- Track their improvement over time
- Prepare company-specifically
- Build confidence for interviews

---

**Happy Learning! 🚀**

For detailed information, refer to README.md, SETUP.md, or API.md

Last Updated: March 26, 2026
