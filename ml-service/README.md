# YouMatter ML Service

Python-based Machine Learning service for YouMatter platform.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the service:
```bash
python app.py
```

The ML service will run on `http://localhost:5001`

## Endpoints

- `GET /health` - Health check
- `POST /api/ml/analyze-behavior` - Analyze user behavior patterns
- `POST /api/ml/recommend-challenges` - Get AI recommendations
- `POST /api/ml/predict-completion` - Predict completion probability
- `POST /api/ml/train-model` - Train ML models

## Features

- **Recommendation Engine**: Uses Random Forest for challenge recommendations
- **Behavior Analyzer**: Analyzes user patterns and preferences
- **Completion Predictor**: Predicts challenge completion probability
- **Continuous Learning**: Models improve as more data is collected
