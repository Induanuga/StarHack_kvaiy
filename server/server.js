const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { seedDatabase } = require("./utils/seedData");

const app = express();
dotenv.config();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/youmatter", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Seed database with default challenges (only run once or when needed)
    // Uncomment the line below to seed the database
    // await seedDatabase();
  });

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/challenges", require("./routes/challenges"));
app.use("/api/rewards", require("./routes/rewards"));
app.use("/api/activities", require("./routes/activities"));
app.use("/api/achievements", require("./routes/achievements"));
app.use("/api/leaderboard", require("./routes/leaderboard"));
app.use("/api/family", require("./routes/family"));

// Seed endpoint (for admin use)
app.post("/api/admin/seed", async (req, res) => {
  try {
    await seedDatabase();
    res.json({ msg: "Database seeded successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error seeding database", error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
