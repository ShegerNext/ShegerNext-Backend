import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async (): Promise<void> => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }
  await mongoose.connect(MONGODB_URI);
};

export default mongoose;
