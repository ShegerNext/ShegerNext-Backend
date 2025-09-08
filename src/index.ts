import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/healthRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import { getOfficerComplaints } from "./controllers/complaintController";
import { connectDB } from "./services/db";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Application = express();
const PORT: number | string = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/complaints", complaintRoutes);

// GET /complaints_officer -> returns complaints assigned to the logged-in officer
app.get("/complaints_officer", getOfficerComplaints);

// connectDB()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Backend running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to connect to MongoDB", err);
//     process.exit(1);
//   });
const start = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    app.listen(4000, () => {
      console.log("🚀 Server running on http://localhost:4000");
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB", err);
    process.exit(1);
  }
};

start();
