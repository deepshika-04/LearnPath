# LearnPath Setup Guide

## Quick Start

### 1. Clone Repository
```bash
git clone <repo-url>
cd LearnPath
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learnpath
JWT_SECRET=your_secure_jwt_secret_key
ML_SERVICE_URL=http://localhost:5001
NODE_ENV=development
```

#### Start MongoDB
```bash
# Windows - if installed as service, it runs automatically
# Or run: mongod

# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### Seed Database
```bash
npm run seed
```

#### Start Backend Server
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. ML Service Setup

#### Create Virtual Environment
```bash
cd ml-service
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5001
FLASK_ENV=development
```

#### Start ML Service
```bash
python app.py
# Service runs on http://localhost:5001
```

### 4. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start Development Server
```bash
npm start
# App runs on http://localhost:3000
```

## Testing the Application

### 1. Registration
- Navigate to `http://localhost:3000/register`
- Fill form:
  - Name: "John Doe"
  - Email: "john@example.com"
  - Password: "password123"
  - Target Company: "Amazon"
  - Study Hours: "2"
- Click Register

### 2. Take Diagnostic Test
- Dashboard → "Start Test"
- Answer 25 questions (5 per topic)
- View results

### 3. View Skill Analysis
- Results page shows skill level
- Weak and strong topics identified

### 4. Generate Learning Path
- Dashboard → "View Path"
- System generates personalized roadmap
- Topics ordered by prerequisites and priority

### 5. Explore Resources
- Dashboard → "Explore Resources"
- Filter by topic
- View recommendations

### 6. Check Progress
- Dashboard → "View Progress"
- See readiness percentage
- Track topic completion

### 7. Generate Study Plan
- Dashboard → "Get Schedule"
- View weekly and daily tasks

### 8. Take Mock Test
- Dashboard → "Take Test"
- Full-length company-level assessment
- Get feedback and readiness assessment

## API Testing with cURL

### Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "targetCompany": "Amazon",
    "studyHoursPerDay": 2
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Diagnostic Test
```bash
curl http://localhost:5000/api/quiz/diagnostic
```

### Get Companies
```bash
curl http://localhost:5000/api/companies/all
```

## Database Seeding

Default seed data includes:
- **Companies**: Amazon, Google, Microsoft, Meta, TCS, Infosys
- **Questions**: 6 sample questions (1 per topic)
- **Resources**: 4 sample learning resources

To add more data, modify `backend/scripts/seedData.js`

## Troubleshooting

### Backend Won't Start
- Check if MongoDB is running: `mongod --version`
- Check port 5000 is not in use
- Verify .env file configuration

### ML Service Error
- Ensure Python 3.8+ is installed
- Virtual environment activated
- All packages installed: `pip list`

### Frontend Connection Issues
- Backend must be running (port 5000)
- ML Service must be running (port 5001)
- Check API_BASE_URL in `frontend/src/utils/api.js`

### Database Connection
- Check MongoDB URI in .env
- MongoDB must be running
- Check connection string format

## File Structure for Development

```
project/
├── backend/
│   ├── src/
│   │   ├── models/      ← Database schemas
│   │   ├── controllers/ ← Route handlers
│   │   ├── routes/      ← API routes
│   │   └── middleware/  ← Auth
│   ├── scripts/
│   ├── server.js        ← Main entry
│   └── package.json
├── ml-service/
│   ├── src/             ← ML algorithms
│   ├── app.py           ← Flask entry
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/       ← Page components
    │   ├── utils/       ← API client
    │   ├── styles/      ← CSS
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Development Workflow

### 1. Start All Services
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - ML Service
cd ml-service && source venv/bin/activate && python app.py

# Terminal 3 - Frontend
cd frontend && npm start
```

### 2. Make Changes
- Edit files in respective folders
- Frontend hot-reloads automatically
- Backend requires restart
- ML service requires restart

### 3. Test Changes
- Test in browser at `http://localhost:3000`
- Check browser console for errors
- Check backend logs for API errors
- Check ML service logs for ML errors

## Performance Optimization

### Frontend
- Images optimization
- Code splitting with React.lazy()
- API call caching
- Local storage for tokens

### Backend
- Database indexing
- Query optimization
- Response compression
- Rate limiting

### ML Service
- Model caching
- Batch predictions
- Feature preprocessing optimization

## Security Checklist

- [ ] Change JWT_SECRET to secure value
- [ ] Use HTTPS in production
- [ ] Enable CORS for specific origins only
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Hash passwords with bcrypt
- [ ] Use environment variables for secrets
- [ ] Implement CSRF protection
- [ ] Add helmet for security headers

## Production Deployment

### Environment Variables
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/learnpath
JWT_SECRET=very-long-secure-random-string
ML_SERVICE_URL=https://ml-service-domain.com
CORS_ORIGIN=https://frontend-domain.com
```

### Build Frontend
```bash
cd frontend
npm run build
# Deploy build/ folder to Vercel/Netlify
```

### Deploy Backend
```bash
# Push to Heroku/Railway
git push heroku main
# Set environment variables on platform
```

### Deploy ML Service
```bash
# Push to Render/Heroku
git push render main
```

## Monitoring

- Backend: Check logs in deployment console
- ML Service: Monitor response times
- Frontend: Monitor user interactions
- Database: Check query performance

## Support & Documentation

- Check logs for errors
- Verify all services running
- Test API endpoints with cURL
- Review README.md for features

---

**Happy Learning! 🎓**
