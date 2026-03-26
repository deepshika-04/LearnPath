from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from src.skill_analyzer import skill_analyzer
from src.learning_path_generator import topo_sorter
from src.resource_recommender import recommender

load_dotenv()

app = Flask(__name__)
CORS(app)

# Company topic weights
company_weights = {
    'Amazon': {'DSA': 40, 'DBMS': 20, 'OS': 15, 'CN': 15, 'Aptitude': 10},
    'Google': {'DSA': 45, 'DBMS': 15, 'OS': 20, 'CN': 10, 'Aptitude': 10},
    'Microsoft': {'DSA': 35, 'DBMS': 20, 'OS': 20, 'CN': 15, 'Aptitude': 10},
    'TCS': {'DSA': 25, 'DBMS': 20, 'OS': 15, 'CN': 15, 'Aptitude': 25},
    'Infosys': {'DSA': 20, 'DBMS': 25, 'OS': 15, 'CN': 15, 'Aptitude': 25},
}

# Skill Analysis Endpoint
@app.route('/analyze-skills', methods=['POST'])
def analyze_skills():
    try:
        data = request.get_json()
        
        quiz_results = data.get('quizResults', {})
        overall_score = data.get('overallScore', 0)
        target_company = data.get('targetCompany', 'Amazon')
        
        # Use ML models for analysis
        analysis = skill_analyzer.analyze_skills(quiz_results, overall_score)
        
        return jsonify({
            'success': True,
            'skillLevel': analysis['skillLevel'],
            'weakTopics': analysis['weakTopics'],
            'strongTopics': analysis['strongTopics'],
            'confidence': analysis['confidence']
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Generate Learning Path Endpoint
@app.route('/generate-learning-path', methods=['POST'])
def generate_learning_path():
    try:
        data = request.get_json()
        
        weak_topics = data.get('weakTopics', [])
        strong_topics = data.get('strongTopics', [])
        target_company = data.get('targetCompany', 'Amazon')
        skill_level = data.get('skillLevel', 'Intermediate')
        study_hours = data.get('studyHoursPerDay', 2)
        
        weights = company_weights.get(target_company, company_weights['Amazon'])
        
        # Generate learning path using topological sort
        learning_path = topo_sorter.generate_learning_path(
            weak_topics, 
            strong_topics, 
            weights, 
            skill_level
        )
        
        # Calculate total days
        total_days = sum(topic.get('estimatedDays', 0) for topic in learning_path)
        
        return jsonify({
            'success': True,
            'learningPath': learning_path,
            'totalDaysEstimated': total_days
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Recommend Resources Endpoint
@app.route('/recommend-resources', methods=['POST'])
def recommend_resources():
    try:
        data = request.get_json()
        
        user_topics = data.get('userTopics', [])
        target_company = data.get('targetCompany', 'Amazon')
        available_resources = data.get('availableResources', [])
        
        # Get recommendations using cosine similarity
        recommendations = recommender.recommend_resources(
            user_topics,
            available_resources,
            target_company
        )
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Generate Study Plan Endpoint
@app.route('/generate-study-plan', methods=['POST'])
def generate_study_plan():
    try:
        data = request.get_json()
        
        learning_path = data.get('learningPath', [])
        study_hours_per_day = data.get('studyHoursPerDay', 2)
        start_date = data.get('startDate', '2026-03-26')
        
        # Generate weekly schedule
        weekly_schedule = []
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        for i, day in enumerate(days):
            if i < len(learning_path):
                topic = learning_path[i].get('topicName', '')
                weekly_schedule.append({
                    'day': day,
                    'topics': [topic],
                    'estimatedHours': study_hours_per_day,
                    'priority': learning_path[i].get('priority', 'Medium')
                })
            else:
                weekly_schedule.append({
                    'day': day,
                    'topics': ['Revision'],
                    'estimatedHours': study_hours_per_day,
                    'priority': 'Low'
                })
        
        # Generate daily tasks (simplified)
        daily_tasks = []
        for i, topic_info in enumerate(learning_path[:14]):  # 2 weeks
            daily_tasks.append({
                'date': f'2026-03-{26+i}',
                'tasks': [
                    {
                        'topic': topic_info.get('topicName'),
                        'subtopic': f'Concept {i+1}',
                        'hours': study_hours_per_day,
                        'completed': False
                    }
                ]
            })
        
        return jsonify({
            'success': True,
            'weeklySchedule': weekly_schedule,
            'dailyTasks': daily_tasks
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Generate Mock Test Endpoint
@app.route('/generate-mock-test', methods=['POST'])
def generate_mock_test():
    try:
        data = request.get_json()
        
        target_company = data.get('targetCompany', 'Amazon')
        difficulty = data.get('difficulty', 'Medium')
        total_questions = data.get('totalQuestions', 50)
        
        # Simulate mock test generation
        questions = [
            {
                '_id': f'q{i}',
                'topic': ['DSA', 'DBMS', 'OS', 'CN', 'Aptitude'][i % 5],
                'question': f'Sample Question {i+1} for {target_company}',
                'options': ['Option A', 'Option B', 'Option C', 'Option D']
            }
            for i in range(total_questions)
        ]
        
        return jsonify({
            'success': True,
            'totalQuestions': total_questions,
            'questions': questions
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Analyze Mock Test Endpoint
@app.route('/analyze-mock-test', methods=['POST'])
def analyze_mock_test():
    try:
        data = request.get_json()
        
        percentage_score = data.get('percentageScore', 0)
        weak_areas = data.get('weakAreas', [])
        target_company = data.get('targetCompany', 'Amazon')
        
        # Generate feedback based on score
        if percentage_score >= 80:
            feedback = f'Great! You are well-prepared for {target_company}. Keep practicing!'
        elif percentage_score >= 60:
            feedback = f'Good progress! Focus on weak areas to improve for {target_company}.'
        else:
            feedback = f'You need more preparation for {target_company}. Review fundamentals.'
        
        return jsonify({
            'success': True,
            'analysis': {
                'score': percentage_score,
                'strength': 'Problem Solving' if percentage_score >= 70 else 'Fundamentals',
                'areasToImprove': weak_areas
            },
            'weakAreas': weak_areas,
            'feedback': feedback
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML Service is running'}), 200

if __name__ == '__main__':
    PORT = os.getenv('PORT', 5001)
    app.run(debug=True, port=int(PORT))
