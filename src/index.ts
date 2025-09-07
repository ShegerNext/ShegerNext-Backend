import express, { Application } from "express";
import cors from "cors"
import dotenv from "dotenv";
import healthRoutes from "./routes/healthRoutes";

dotenv.config();

const app: Application = express();
const PORT: number | string = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", healthRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
