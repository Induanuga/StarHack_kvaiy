import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
import pickle
import os

class ChallengePredictor:
    def __init__(self):
        self.model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        self.is_trained = False
        self.load_model()
    
    def load_model(self):
        """Load pre-trained model if exists"""
        try:
            if os.path.exists('models/predictor.pkl'):
                with open('models/predictor.pkl', 'rb') as f:
                    self.model = pickle.load(f)
                self.is_trained = True
                print("Loaded pre-trained predictor model")
        except Exception as e:
            print(f"No pre-trained predictor found: {e}")
    
    def save_model(self):
        """Save trained model"""
        os.makedirs('models', exist_ok=True)
        with open('models/predictor.pkl', 'wb') as f:
            pickle.dump(self.model, f)
    
    def predict_completion_probability(self, user_profile, challenge):
        """Predict probability of user completing the challenge"""
        
        # Extract features
        features = self._extract_prediction_features(user_profile, challenge)
        
        if self.is_trained:
            # Use ML model
            probability = self.model.predict([features])[0]
        else:
            # Use heuristic calculation
            probability = self._heuristic_prediction(user_profile, challenge)
        
        # Ensure probability is between 0 and 1
        probability = max(0, min(1, probability))
        
        return {
            'probability': round(probability * 100, 2),
            'confidence': 'high' if self.is_trained else 'medium',
            'estimatedDays': self._estimate_completion_days(user_profile, challenge),
            'successFactors': self._identify_success_factors(user_profile, challenge)
        }
    
    def _extract_prediction_features(self, user_profile, challenge):
        """Extract features for prediction"""
        return [
            user_profile.get('level', 1),
            user_profile.get('stats', {}).get('completionRate', 0) / 100,
            user_profile.get('streak', {}).get('current', 0),
            1 if challenge.get('category') in user_profile.get('preferredCategories', []) else 0,
            self._encode_difficulty(challenge.get('difficulty', 'easy')),
            challenge.get('target', 100) / 100,
            user_profile.get('avgTimeToComplete', 7) / 30
        ]
    
    def _encode_difficulty(self, difficulty):
        mapping = {'easy': 0.25, 'medium': 0.5, 'hard': 0.75, 'expert': 1.0}
        return mapping.get(difficulty, 0.25)
    
    def _heuristic_prediction(self, user_profile, challenge):
        """Heuristic-based prediction when model not trained"""
        base_probability = 0.5
        
        # Adjust based on completion rate
        completion_rate = user_profile.get('stats', {}).get('completionRate', 0) / 100
        base_probability += (completion_rate - 0.5) * 0.3
        
        # Adjust based on category match
        if challenge.get('category') in user_profile.get('preferredCategories', []):
            base_probability += 0.15
        
        # Adjust based on difficulty vs level
        user_level = user_profile.get('level', 1)
        difficulty = challenge.get('difficulty', 'easy')
        
        if difficulty == 'easy' and user_level >= 5:
            base_probability += 0.1
        elif difficulty == 'medium' and 3 <= user_level <= 7:
            base_probability += 0.1
        elif difficulty == 'hard' and user_level >= 8:
            base_probability += 0.1
        
        return base_probability
    
    def _estimate_completion_days(self, user_profile, challenge):
        """Estimate days to complete"""
        avg_time = user_profile.get('avgTimeToComplete', 7)
        challenge_type = challenge.get('type', 'daily')
        
        if challenge_type == 'daily':
            return round(min(avg_time, 1))
        elif challenge_type == 'weekly':
            return round(min(avg_time, 7))
        else:
            return round(min(avg_time, 30))
    
    def _identify_success_factors(self, user_profile, challenge):
        """Identify factors that increase success probability"""
        factors = []
        
        if challenge.get('category') in user_profile.get('preferredCategories', []):
            factors.append("Matches your interests")
        
        if user_profile.get('stats', {}).get('completionRate', 0) > 70:
            factors.append("High historical success rate")
        
        if user_profile.get('streak', {}).get('current', 0) > 3:
            factors.append("Strong current streak")
        
        if not factors:
            factors.append("Good challenge for your level")
        
        return factors
    
    def train(self, training_data):
        """Train the prediction model"""
        if len(training_data) < 20:
            print("Not enough training data for predictor")
            return
        
        X = []
        y = []
        
        for record in training_data:
            features = self._extract_prediction_features(
                record.get('userProfile', {}),
                record.get('challenge', {})
            )
            X.append(features)
            # Target: 1 if completed, 0 if not
            y.append(1.0 if record.get('completed') else 0.0)
        
        self.model.fit(X, y)
        self.is_trained = True
        self.save_model()
        print("Predictor model trained successfully")
