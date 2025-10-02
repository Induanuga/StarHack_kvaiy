import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle
import os

class RecommendationEngine:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.label_encoders = {}
        self.is_trained = False
        self.load_model()
    
    def load_model(self):
        """Load pre-trained model if exists"""
        try:
            if os.path.exists('models/recommender.pkl'):
                with open('models/recommender.pkl', 'rb') as f:
                    self.model = pickle.load(f)
                self.is_trained = True
                print("Loaded pre-trained recommendation model")
        except Exception as e:
            print(f"No pre-trained model found: {e}")
    
    def save_model(self):
        """Save trained model"""
        os.makedirs('models', exist_ok=True)
        with open('models/recommender.pkl', 'wb') as f:
            pickle.dump(self.model, f)
    
    def extract_features(self, user_profile, challenge):
        """Extract features for ML model"""
        features = {
            'user_level': user_profile.get('level', 1),
            'user_points': user_profile.get('points', 0),
            'completion_rate': user_profile.get('stats', {}).get('completionRate', 0),
            'avg_time_to_complete': user_profile.get('avgTimeToComplete', 7),
            'streak': user_profile.get('streak', {}).get('current', 0),
            'challenge_difficulty': self._encode_difficulty(challenge.get('difficulty', 'easy')),
            'challenge_type': self._encode_type(challenge.get('type', 'daily')),
            'challenge_category': self._encode_category(challenge.get('category', 'health')),
            'challenge_points': challenge.get('points', 50),
            'challenge_target': challenge.get('target', 100)
        }
        return list(features.values())
    
    def _encode_difficulty(self, difficulty):
        mapping = {'easy': 1, 'medium': 2, 'hard': 3, 'expert': 4}
        return mapping.get(difficulty, 1)
    
    def _encode_type(self, challenge_type):
        mapping = {'daily': 1, 'weekly': 2, 'monthly': 3}
        return mapping.get(challenge_type, 1)
    
    def _encode_category(self, category):
        mapping = {
            'health': 1, 'wealth': 2, 'financial': 3, 
            'insurance': 4, 'aktivo': 5, 'social': 6
        }
        return mapping.get(category, 1)
    
    def get_recommendations(self, user_id, user_profile, available_challenges):
        """Get challenge recommendations for user"""
        recommendations = []
        
        for challenge in available_challenges:
            # Extract features
            features = self.extract_features(user_profile, challenge)
            
            # Calculate confidence score
            if self.is_trained:
                # Use ML model prediction
                confidence = self.model.predict_proba([features])[0][1] * 100
            else:
                # Use rule-based scoring
                confidence = self._rule_based_scoring(user_profile, challenge)
            
            # Generate reason
            reason = self._generate_reason(user_profile, challenge, confidence)
            
            if confidence > 50:  # Only recommend if confidence > 50%
                recommendations.append({
                    'challengeId': str(challenge.get('_id', '')),
                    'confidence': round(confidence, 2),
                    'reason': reason,
                    'features': {
                        'userLevel': user_profile.get('level', 1),
                        'challengeDifficulty': challenge.get('difficulty', 'easy'),
                        'category': challenge.get('category', 'health')
                    }
                })
        
        # Sort by confidence
        recommendations.sort(key=lambda x: x['confidence'], reverse=True)
        return recommendations[:10]  # Return top 10
    
    def _rule_based_scoring(self, user_profile, challenge):
        """Rule-based scoring when ML model not trained"""
        score = 50.0  # Base score
        
        # Category preference
        preferred_categories = user_profile.get('preferredCategories', [])
        if challenge.get('category') in preferred_categories:
            score += 25
        
        # Difficulty matching
        user_level = user_profile.get('level', 1)
        difficulty = challenge.get('difficulty', 'easy')
        
        if user_level >= 10 and difficulty == 'hard':
            score += 20
        elif user_level >= 5 and difficulty == 'medium':
            score += 15
        elif user_level < 5 and difficulty == 'easy':
            score += 15
        
        # Completion rate
        completion_rate = user_profile.get('stats', {}).get('completionRate', 0)
        if completion_rate > 80:
            score += 10
        elif completion_rate > 60:
            score += 5
        
        # Challenge type preference
        if challenge.get('type') == 'daily' and completion_rate > 70:
            score += 10
        
        return min(score, 100)
    
    def _generate_reason(self, user_profile, challenge, confidence):
        """Generate human-readable recommendation reason"""
        reasons = []
        
        preferred_categories = user_profile.get('preferredCategories', [])
        if challenge.get('category') in preferred_categories:
            reasons.append(f"Matches your interest in {challenge.get('category')}")
        
        completion_rate = user_profile.get('stats', {}).get('completionRate', 0)
        if completion_rate > 80:
            reasons.append("Based on your high success rate")
        
        if challenge.get('type') == 'daily':
            reasons.append("Great for building daily habits")
        
        if not reasons:
            reasons.append("Recommended based on your profile")
        
        return ". ".join(reasons)
    
    def train(self, training_data):
        """Train the recommendation model"""
        if len(training_data) < 10:
            print("Not enough training data")
            return
        
        X = []
        y = []
        
        for record in training_data:
            features = self.extract_features(
                record.get('userProfile', {}),
                record.get('challenge', {})
            )
            X.append(features)
            y.append(1 if record.get('completed') else 0)
        
        self.model.fit(X, y)
        self.is_trained = True
        self.save_model()
        print("Model trained successfully")
