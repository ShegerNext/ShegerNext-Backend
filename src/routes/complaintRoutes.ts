import { Router } from "express";
import {
  createComplaint,
  getOfficerComplaints,
  getComplaintById,
  getAdminComplaints,
  getUserComplaints,
} from "../controllers/complaintController";

const router = Router();

router.post("/", createComplaint);
router.get("/officer", getOfficerComplaints);
router.get("/admin", getAdminComplaints);
router.get("/:id", getComplaintById);
router.get("/mine", getUserComplaints);

export default router;
