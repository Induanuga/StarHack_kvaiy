const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/youmatter', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/rewards', require('./routes/rewards'));
app.use('/api/activities', require('./routes/activities'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});