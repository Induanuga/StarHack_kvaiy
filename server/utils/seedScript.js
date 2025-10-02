const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { seedDatabase } = require("./seedData");

dotenv.config();

const runSeed = async () => {
  try {
    console.log("🌱 Starting database seed...");

    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/youmatter",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("✅ MongoDB connected");

    await seedDatabase();

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

runSeed();
