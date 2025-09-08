import { Router } from "express";
import {
  createComplaint,
  getOfficerComplaints,
  getComplaintById,
  getAdminComplaints,
  getUserComplaints,
  assignComplaint,
  updateEstimatedTime,
  updateComplaintStatus,
  updateComplaintUrgency,
  deleteComplaint,
} from "../controllers/complaintController";

const router = Router();

router.post("/", createComplaint);
router.get("/officer", getOfficerComplaints);
router.get("/admin", getAdminComplaints);
router.get("/mine", getUserComplaints);
router.patch("/:id/assign", assignComplaint);
router.patch("/:id/estimate", updateEstimatedTime);
router.patch("/:id/status", updateComplaintStatus);
router.patch("/:id/urgency", updateComplaintUrgency);
router.delete("/:id", deleteComplaint);
router.get("/:id", getComplaintById);

export default router;
