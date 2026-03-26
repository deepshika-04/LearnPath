import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import pickle
import os

class SkillAnalyzer:
    def __init__(self):
        self.decision_tree = None
        self.random_forest = None
        self.scaler = StandardScaler()
        self.model_path = os.path.join(os.path.dirname(__file__), '../models')
        
    def train_models(self):
        """Train Decision Tree and Random Forest models"""
        # Sample training data (in production, use real data)
        X_train = np.array([
            [70, 60, 50, 40, 30],  # DSA, DBMS, OS, CN, Aptitude
            [80, 75, 60, 55, 50],
            [50, 55, 60, 65, 70],
            [90, 85, 75, 70, 60],
            [40, 45, 50, 55, 60],
            [85, 80, 70, 65, 55],
            [60, 65, 70, 75, 80]
        ])
        
        # Target: 0=Beginner, 1=Intermediate, 2=Advanced
        y_train = np.array([1, 2, 0, 2, 0, 2, 1])
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X_train)
        
        # Train Decision Tree
        self.decision_tree = DecisionTreeClassifier(max_depth=5, random_state=42)
        self.decision_tree.fit(X_scaled, y_train)
        
        # Train Random Forest
        self.random_forest = RandomForestClassifier(n_estimators=10, random_state=42)
        self.random_forest.fit(X_scaled, y_train)
        
        # Save models
        self.save_models()
    
    def load_models(self):
        """Load pre-trained models"""
        try:
            with open(os.path.join(self.model_path, 'decision_tree.pkl'), 'rb') as f:
                self.decision_tree = pickle.load(f)
            with open(os.path.join(self.model_path, 'random_forest.pkl'), 'rb') as f:
                self.random_forest = pickle.load(f)
            with open(os.path.join(self.model_path, 'scaler.pkl'), 'rb') as f:
                self.scaler = pickle.load(f)
        except:
            self.train_models()
    
    def save_models(self):
        """Save trained models"""
        os.makedirs(self.model_path, exist_ok=True)
        with open(os.path.join(self.model_path, 'decision_tree.pkl'), 'wb') as f:
            pickle.dump(self.decision_tree, f)
        with open(os.path.join(self.model_path, 'random_forest.pkl'), 'wb') as f:
            pickle.dump(self.random_forest, f)
        with open(os.path.join(self.model_path, 'scaler.pkl'), 'wb') as f:
            pickle.dump(self.scaler, f)
    
    def analyze_skills(self, quiz_results, overall_score):
        """
        Analyze user skills using ML models
        
        Args:
            quiz_results: dict with topic scores
            overall_score: overall percentage
            
        Returns:
            dict with skill level, weak/strong topics
        """
        # Prepare features
        features = np.array([[
            quiz_results.get('DSA', 0),
            quiz_results.get('DBMS', 0),
            quiz_results.get('OS', 0),
            quiz_results.get('CN', 0),
            quiz_results.get('Aptitude', 0)
        ]])
        
        # Scale features
        X_scaled = self.scaler.transform(features)
        
        # Predict using both models
        dt_prediction = self.decision_tree.predict(X_scaled)[0]
        rf_prediction = self.random_forest.predict(X_scaled)[0]
        
        # Ensemble prediction (majority vote)
        predictions = [dt_prediction, rf_prediction]
        skill_level_idx = max(set(predictions), key=predictions.count)
        
        skill_levels = ['Beginner', 'Intermediate', 'Advanced']
        skill_level = skill_levels[skill_level_idx]
        
        # Identify weak and strong topics
        threshold_weak = 50
        threshold_strong = 75
        
        weak_topics = [topic for topic, score in quiz_results.items() if score < threshold_weak]
        strong_topics = [topic for topic, score in quiz_results.items() if score >= threshold_strong]
        
        return {
            'skillLevel': skill_level,
            'weakTopics': weak_topics,
            'strongTopics': strong_topics,
            'confidence': float(max(self.random_forest.predict_proba(X_scaled)[0]))
        }

# Initialize analyzer
skill_analyzer = SkillAnalyzer()
skill_analyzer.load_models()
