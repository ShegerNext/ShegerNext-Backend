import { Router } from "express";
import { createProfile } from "../controllers/profileController";

const router = Router();

router.post("/", createProfile);

export default router;
