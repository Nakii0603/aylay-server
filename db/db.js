import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URI;
    if (!MONGODB_URL) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully 🔥 🚀");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};
