# YouMatter - Gamified Health & Wellness Platform

> **Where Health Meets Play, Lives Change Every Day**

YouMatter is a comprehensive gamified health and wellness platform that transforms boring health activities into engaging challenges with real rewards. We connect individuals, families, employers, healthcare providers, and governments in one unified ecosystem.

---

## Key Features

### Gamification Engine
- **Points & XP System** - Earn rewards for healthy actions
- **20+ Levels** - Progress from beginner to expert
- **Daily Streaks** - Maintain momentum with streak tracking
- **Achievement Badges** - Unlock 9+ badges
- **Global Leaderboards** - Compete with all users

### AI-Powered Personalization
- **Smart Recommendations** - ML-powered challenge suggestions
- **Behavioral Analysis** - Learns your preferences over time
- **Completion Prediction** - Forecasts success probability
- **Adaptive Difficulty** - Adjusts based on your progress

### Social Features
- **Family Groups** - Create wellness teams with invite codes
- **Community Challenges** - Join collective goals with thousands
- **Corporate Competitions** - Company-wide wellness battles
- **Friend Leaderboards** - Compare progress with connections

### Healthcare Integration
- **Doctor Prescriptions** - Gamified treatment plans
- **Compliance Tracking** - Monitor patient progress
- **Health Outcomes** - Measurable improvements
- **Clinical Validation** - Evidence-based interventions

### Rewards Marketplace
- **Gym Memberships** - Discounts and offers
- **Health Products** - Fitness trackers, supplements
- **Cash Rewards** - Real money for points
- **Partner Discounts** - Exclusive deals

### Analytics Dashboard
- **Real-time KPIs** - Track engagement metrics
- **User Insights** - Behavioral patterns
- **ROI Measurement** - Corporate wellness tracking
- **Impact Reports** - Health outcome analysis

---

## Architecture

### Tech Stack

**Frontend:**
- React.js 18.x
- Tailwind CSS
- React Router v6
- Axios for API calls
- Context API for state management

**Backend:**
- Node.js + Express
- MongoDB (Mongoose ODM)
- JWT Authentication
- RESTful API (50+ endpoints)

**Machine Learning:**
- Python 3.x
- Flask microservice
- Scikit-learn
- Pandas & NumPy
- 3 trained ML models

**Infrastructure:**
- Cloud-ready architecture
- Microservices design
- Scalable database
- API-first approach

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- Python 3.8+ (for ML service)
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd StarHack_kvaiy
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Configure environment variables**
Create `.env` file in `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/youmatter
JWT_SECRET=your_jwt_secret_key_here
ML_SERVICE_URL=http://localhost:5001
```

4. **Start MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

5. **Seed the database** (optional, first time only)
```bash
npm run seed
```

6. **Start the server**
```bash
npm start
# or for development with auto-reload
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Install client dependencies**
```bash
cd client
npm install
```

2. **Start the React app**
```bash
npm start
```

Client will run on `http://localhost:3000`

### ML Service Setup (Optional)

1. **Navigate to ML service directory**
```bash
cd ml-service
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure ML service**
Create `.env` file in `ml-service` directory:
```env
ML_SERVICE_PORT=5001
MONGODB_URI=mongodb://localhost:27017/youmatter
```

5. **Start ML service**
```bash
python app.py
```

ML service will run on `http://localhost:5001`

---

## Quick Start

### Option 1: Run All Services

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start

# Terminal 3 - ML Service (optional)
cd ml-service
python app.py
```

### Option 2: Test User Accounts

**Demo Account:**
- Username: `demo@youmatter.com`
- Password: `demo123`

**Or create new account:**
1. Navigate to `http://localhost:3000`
2. Click "Sign Up"
3. Fill in registration form
4. Start exploring!

---

## Usage Guide

### For Individual Users

1. **Sign Up/Login**
   - Create account or login
   - Complete profile setup

2. **Explore Dashboard**
   - View 8 gamification features
   - Check your stats (level, points, streak)
   - Browse family groups

3. **Join Challenges**
   - Browse AI-recommended challenges
   - Join a challenge (e.g., "Morning Walk")
   - Track your progress

4. **Complete & Earn**
   - Log activities (validated)
   - Complete challenges
   - Earn points, XP, and badges
   - Level up!

5. **Redeem Rewards**
   - Browse rewards marketplace
   - Redeem points for prizes
   - Get real discounts

### For Families

1. **Create Family Group**
   - Navigate to Dashboard
   - Click "Create Group"
   - Share invite code with family

2. **Compete Together**
   - View family leaderboard
   - Complete group challenges
   - Support each other

### For Employers

1. **Register Corporate Account**
   - Contact admin or use corporate portal
   - Add employees

2. **Launch Competitions**
   - Create company-wide challenges
   - Track employee engagement
   - Measure ROI

### For Healthcare Providers

1. **Access Healthcare Portal**
   - Verify credentials
   - Browse challenge library

2. **Prescribe Challenges**
   - Select patient
   - Prescribe appropriate challenge
   - Monitor compliance

---

## Project Structure

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user

### Challenges
- `GET /api/challenges` - Get all challenges (AI-sorted)
- `POST /api/challenges/:id/join` - Join a challenge
- `PUT /api/challenges/:id/progress` - Update progress
- `GET /api/challenges/my-challenges` - Get user's challenges
- `DELETE /api/challenges/:id/leave` - Leave challenge

### Leaderboard
- `GET /api/leaderboard/overall` - Global rankings
- `GET /api/leaderboard/health` - Health category
- `GET /api/leaderboard/wealth` - Wealth category
- `GET /api/leaderboard/family` - Family groups

### Rewards
- `GET /api/rewards` - Get all rewards
- `POST /api/rewards/:id/redeem` - Redeem reward
- `GET /api/rewards/my-rewards` - User's rewards

### Family
- `POST /api/family/create` - Create group
- `POST /api/family/join/:code` - Join group
- `GET /api/family/my-groups` - User's groups

### Community
- `GET /api/community/challenges` - Community challenges
- `POST /api/community/challenges/:id/join` - Join
- `PUT /api/community/challenges/:id/contribute` - Contribute

### Healthcare
- `GET /api/healthcare/partners` - Healthcare providers
- `GET /api/healthcare/my-prescriptions` - User prescriptions
- `POST /api/healthcare/prescribe` - Prescribe challenge

### Public Health
- `GET /api/public-health/campaigns` - All campaigns
- `POST /api/public-health/campaigns/:id/join` - Join campaign
- `PUT /api/public-health/campaigns/:id/contribute` - Contribute

### ML/AI
- `POST /api/ml/analyze-behavior` - Analyze user patterns
- `POST /api/ml/recommend-challenges` - Get recommendations
- `POST /api/ml/predict-completion` - Predict success

### Analytics
- `GET /api/analytics/kpis` - Key performance indicators
- `GET /api/analytics/dashboard` - Admin dashboard
- `POST /api/analytics/generate` - Generate daily analytics

---

## Challenge Categories

1. **Health**
   - Steps, workouts, water intake, sleep, meditation

2. **Wealth**
   - Savings, investments, budget logging

3. **Financial**
   - Expense tracking, budget reviews, debt payments

4. **Insurance**
   - Policy reviews, document uploads, claim filing

5. **Aktivo**
   - Health scores, activity completion

6. **Social**
   - Social sharing, family activities, group challenges

---

## Security Features

### Anti-Cheat System
- Activity type validation per category
- Maximum amount limits (e.g., max 20,000 steps)
- Server-side point calculation only
- Time-based validation
- Audit logging for all actions

### Authentication
- JWT token-based authentication
- Password hashing (bcrypt)
- Secure session management
- CORS protection

### Data Privacy
- HIPAA-compliant ready architecture
- User data encryption
- Anonymized analytics
- GDPR compliance ready

---

## Machine Learning Models

### 1. Recommendation Engine
- **Algorithm:** Random Forest Classifier
- **Purpose:** Predicts which challenges user will complete
- **Features:** User level, completion rate, category preference, challenge difficulty
- **Output:** Confidence score (0-100%)

### 2. Behavior Analyzer
- **Algorithm:** Pattern Recognition
- **Purpose:** Identifies user patterns and preferences
- **Output:** Preferred categories, engagement level, recommended difficulty

### 3. Completion Predictor
- **Algorithm:** Gradient Boosting Regressor
- **Purpose:** Predicts probability of challenge completion
- **Output:** Success probability, estimated days, success factors

---

## Database Models

### Core Models
- **User** - Authentication, profile, stats, streak
- **Challenge** - Challenge details, rewards, participants
- **UserProgress** - Progress tracking, completion status
- **Achievement** - Badge definitions, requirements
- **Reward** - Marketplace items, costs
- **Activity** - User activity feed
- **FamilyGroup** - Family teams, invite codes
- **CommunityChallenge** - Collective goals
- **HealthcarePartner** - Doctors, prescriptions
- **Corporate** - Companies, competitions
- **PublicHealthCampaign** - Government initiatives
- **Analytics** - KPIs, metrics
- **UserBehavior** - ML data, patterns

---


### Manual Testing Checklist
- [ ] User registration and login
- [ ] Challenge join and completion
- [ ] Points and XP calculation
- [ ] Leaderboard rankings
- [ ] Family group creation
- [ ] Reward redemption
- [ ] ML recommendations
- [ ] Healthcare prescriptions
- [ ] Community challenges
- [ ] Analytics dashboard


**YouMatter** - Because Your Health Matters

Built with ❤️ for [StarHack Hackathon]
