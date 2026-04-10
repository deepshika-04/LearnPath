# Learning Path Generator - Troubleshooting Guide

## Quick Diagnostic Steps

### 1. Check Backend Health
Open a terminal and run:
```bash
cd backend
npm start
```

Watch for these messages:
- ✅ `MongoDB connected` - Database is working
- ❌ `MongoDB connection error` - Database is down or misconfigured

### 2. Verify Database Status
In another terminal, check MongoDB:
```bash
# On Windows Command Prompt
mongostat

# Or check if service is running
wmic service where name="MongoDB" get state
```

If MongoDB isn't running:
- Windows: Start MongoDB service or run `mongod`
- Linux: `sudo systemctl start mongodb` or `mongod`
- macOS: `brew services start mongodb-community`

### 3. Check API Endpoints
Open your browser and visit:
- **Health Check**: http://localhost:5000/api/health
  - Should show: `{"status":"Backend running"}`
  
- **Diagnostics**: http://localhost:5000/api/diagnostic
  - Shows database connection status, data counts, and configuration

### 4. Check Browser Console
In the app, after taking the diagnostic test:
1. Open Developer Tools: Press `F12`
2. Go to Console tab
3. Look for `[DiagnosticTest]` messages
4. Check for any error messages

### 5. Check Backend Logs
Look for these messages in the backend terminal:
```
[generateLearningPath] Starting for userId: ...
[generateLearningPath] User found: ...
[generateLearningPath] Skill analysis found: ...
[generateLearningPath] Learning path saved successfully: ...
```

If you see error messages, they will indicate the exact problem.

## Common Issues & Solutions

### Issue: "MongoDB connection error"
**Cause**: MongoDB is not running or connection string is wrong

**Solution**:
1. Ensure MongoDB is running (see step 2 above)
2. Check `backend/.env` has correct `MONGODB_URI`:
   ```
   MONGODB_URI=mongodb://localhost:27017/learnpath
   ```
3. If using MongoDB Atlas (cloud), ensure:
   - IP whitelist includes your machine
   - Connection string includes username/password
   - Network connectivity is available

### Issue: "Learning path not found" error
**Cause**: Learning path is not being created when `generateLearningPath` is called

**Action to diagnose**:
1. Check backend console for `[generateLearningPath]` logs
2. Look for these specific log lines:
   - `User found:` - If missing, user ID is not authenticated
   - `Skill analysis found:` - If missing, analysis wasn't created
   - `Learning path saved successfully:` - Should appear if everything works

3. If you see "Learning path saved successfully" but still get the error:
   - There's a timing/caching issue - **Solution**: Reload the page manually
   - The database write race condition is happening - **Solution**: Server-side pagination fix may be needed

### Issue: "Skill analysis not found"
**Cause**: The `getSkillAnalysis` call might have failed

**Check**:
1. Look in backend logs for error messages during skill analysis creation
2. Verify quiz was submitted correctly:
   ```javascript
   // Open browser console and run:
   fetch('/api/quiz/history', {
     headers: { 'Authorization': 'Bearer YOUR_TOKEN_HERE' }
   }).then(r => r.json()).then(console.log)
   ```

### Issue: ML Service errors
**Message**: "ML service unavailable, generating default learning path"

**This is NOT an error** - it's normal! The backend should:
1. Try to call the ML service
2. If it fails, use fallback logic to generate a learning path
3. Learning path should still be created

To test the full flow, you can:
- Leave ML service stopped (fallback will work)
- OR start ML service: `cd ml-service && python app.py`

## Step-by-Step Test Procedure

### Test 1: Verify Database Connectivity
```bash
cd backend
npm start
# Should see: "MongoDB connected"
```

### Test 2: Take a Quiz and Check Logs
1. In browser, login and start diagnostic test
2. Answer all questions and submit
3. **In backend terminal**, watch for logs starting with `[DiagnosticTest]` and `[generateLearningPath]`
4. You should see messages like:
   ```
   [generateLearningPath] Starting for userId: 660a1b2c3d4e5f6g7h8i9j0k
   [generateLearningPath] User found: 660a1b2c3d4e5f6g7h8i9j0k
   [generateLearningPath] Skill analysis found: 660a1b2c3d4e5f6g7h8i9j0k
   [generateLearningPath] Using fallback learning path
   [generateLearningPath] Learning path saved successfully: 660a5e3f7g2h8i1j9k4l5m6n
   ```

### Test 3: Check Frontend Console
1. A
2. Go to Developer Tools (F12) → Console
3. Look for these prefixes: `[DiagnosticTest]`
4. You should see:
   ```
   [DiagnosticTest] Getting skill analysis for quiz: ...
   [DiagnosticTest] Skill analysis created: {...}
   [DiagnosticTest] Generating learning path...
   [DiagnosticTest] Learning path generated successfully: {...}
   ```

## Advanced Debugging

### Check Database Records Directly
If you have MongoDB Compass installed:
1. Connect to `mongodb://localhost:27017`
2. Database: `learnpath`
3. Check collections:
   - `users` - Your user account should be here
   - `quizzess` - Quiz results
   - `skillanalyses` - Skill analysis results  
   - `learningpaths` - Generated learning paths

### Check API Response
Override error handling to see full response:
```javascript
// In browser console:
const token = localStorage.getItem('token'); // or however auth is stored
fetch('http://localhost:5000/api/learning-path', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => {
  console.log('Status:', r.status);
  console.log('Headers:', r.headers);
  return r.json();
}).then(data => console.log('Response:', data));
```

## Data Recovery

If you need to clear all data and start fresh:
```bash
# WARNING: Deletes all data in the learnpath database!
mongo
> use learnpath
> db.dropDatabase()
> exit
```

Then recreate and reseed:
```bash
cd backend
node scripts/seedData.js
```

## Performance Optimization

If there are database performance issues:
1. Restart MongoDB:
   ```bash
   # Windows
   net stop MongoDB
   net start MongoDB
   
   # Linux
   sudo systemctl restart mongodb
   
   # macOS  
   brew services restart mongodb-community
   ```

2. Check disk space - MongoDB needs sufficient disk space
3. Monitor CPU/memory usage during operations

## Getting More Help

If the issue persists:
1. **Collect logs**:
   - Backend console output
   - Browser console (F12)
   - Diagnostic endpoint response (`/api/diagnostic`)
   
2. **Create a test case**:
   - Document exact steps to reproduce
   - Include error messages and timestamps

3. **Check recent changes**:
   - Review Git logs for recent changes
   - Run: `git diff HEAD~1`
