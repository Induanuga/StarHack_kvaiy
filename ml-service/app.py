from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from recommendation_engine import RecommendationEngine
from behavior_analyzer import BehaviorAnalyzer
from predictor import ChallengePredictor

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize ML components
recommender = RecommendationEngine()
analyzer = BehaviorAnalyzer()
predictor = ChallengePredictor()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "ML Service"}), 200

@app.route('/api/ml/analyze-behavior', methods=['POST'])
def analyze_behavior():
    """Analyze user behavior patterns using ML"""
    try:
        data = request.json
        user_id = data.get('userId')
        challenge_history = data.get('challengeHistory', [])
        
        patterns = analyzer.analyze_patterns(user_id, challenge_history)
        
        return jsonify({
            "success": True,
            "patterns": patterns
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ml/recommend-challenges', methods=['POST'])
def recommend_challenges():
    """Get AI-powered challenge recommendations"""
    try:
        data = request.json
        user_id = data.get('userId')
        user_profile = data.get('userProfile', {})
        available_challenges = data.get('availableChallenges', [])
        
        recommendations = recommender.get_recommendations(
            user_id, 
            user_profile, 
            available_challenges
        )
        
        return jsonify({
            "success": True,
            "recommendations": recommendations
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ml/predict-completion', methods=['POST'])
def predict_completion():
    """Predict challenge completion probability"""
    try:
        data = request.json
        user_profile = data.get('userProfile', {})
        challenge = data.get('challenge', {})
        
        prediction = predictor.predict_completion_probability(
            user_profile, 
            challenge
        )
        
        return jsonify({
            "success": True,
            "prediction": prediction
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ml/train-model', methods=['POST'])
def train_model():
    """Train ML models with latest data"""
    try:
        data = request.json
        training_data = data.get('trainingData', [])
        
        recommender.train(training_data)
        predictor.train(training_data)
        
        return jsonify({
            "success": True,
            "message": "Models trained successfully"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('ML_SERVICE_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
