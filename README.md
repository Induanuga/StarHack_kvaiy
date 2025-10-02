# YouMatter Wellness Platform

A comprehensive mobile wellness platform that empowers users to take control of their Health, Wealth, and Financial Wellness through integrated digital solutions.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

### Environment Setup
1. Create a `.env` file in the server directory:
```
MONGODB_URI=mongodb://localhost:27017/youmatter
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Backend Setup
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on http://localhost:5000

### Frontend Setup
1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at http://localhost:3000

## Running Both Frontend and Backend
1. Open two terminal windows
2. In the first terminal:
```bash
cd server
npm run dev
```
3. In the second terminal:
```bash
cd client
npm start
```

Now you can access the full application at http://localhost:3000 with the backend API running at http://localhost:5000.