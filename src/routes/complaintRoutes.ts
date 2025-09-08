import { Router } from "express";
import { createComplaint } from "../controllers/complaintController";

const router = Router();

router.post("/", createComplaint);

export default router;
