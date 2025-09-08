import { Request, Response } from "express";
import Complaint from "../models/Complaint"; // mongoose model
import jwt from "jsonwebtoken";

export const createComplaint = async (req: Request, res: Response) => {
  const { text, image_url = null, status = "submitted" } = req.body;

  if (!text) {
    return res.status(400).json({ error: "text is required" });
  }

  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : "";
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret"
    ) as any;
    const userId = decoded.userId;

    const created = await Complaint.create({
      userId,
      text,
      image_url,
      status,
    });

    return res.status(201).json(created);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getOfficerComplaints = async (req: Request, res: Response) => {
  try {
    const category = (req.query.category as string) || "";

    if (!category) {
      return res
        .status(400)
        .json({ error: "category query param is required" });
    }

    const complaints = await Complaint.find({ category })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(complaints);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getComplaintById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    if (!id) {
      return res.status(400).json({ error: "id param is required" });
    }

    const complaint = await Complaint.findById(id).lean();

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    return res.status(200).json(complaint);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getAdminComplaints = async (req: Request, res: Response) => {
  try {
    const complaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .populate({ path: "userId", select: "username" })
      .select({
        text: 1,
        status: 1,
        estimated_completion_time: 1,
        assigned_officer_id: 1,
      })
      .lean();

    const mapped = complaints.map((c: any) => ({
      id: c._id,
      description: c.text,
      username: c.userId?.username || "",
      status: c.status,
      estimated_time: c.estimated_completion_time,
      assigned_officer_id: c.assigned_officer_id || null,
      createdAt: c.createdAt,
    }));

    return res.status(200).json(mapped);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getUserComplaints = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : "";
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret"
    ) as any;
    const userId = decoded.userId;

    const complaints = await Complaint.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(complaints);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const assignComplaint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { assigned_officer_id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id param is required" });
    }

    if (!assigned_officer_id) {
      return res.status(400).json({
        error: "assigned_officer_id is required",
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { assigned_officer_id },
      { new: true }
    ).lean();

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    return res.status(200).json(updatedComplaint);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateEstimatedTime = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { estimated_completion_time } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id param is required" });
    }

    if (!estimated_completion_time) {
      return res.status(400).json({
        error: "estimated_completion_time is required",
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { estimated_completion_time: new Date(estimated_completion_time) },
      { new: true }
    ).lean();

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    return res.status(200).json(updatedComplaint);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id param is required" });
    }

    if (!status) {
      return res.status(400).json({
        error: "status is required",
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    return res.status(200).json(updatedComplaint);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateComplaintUrgency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { urgency } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id param is required" });
    }

    if (!urgency) {
      return res.status(400).json({
        error: "urgency is required",
      });
    }

    if (!["low", "medium", "high"].includes(urgency)) {
      return res.status(400).json({
        error: "urgency must be one of: low, medium, high",
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { urgency },
      { new: true }
    ).lean();

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    return res.status(200).json(updatedComplaint);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteComplaint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    if (!id) {
      return res.status(400).json({ error: "id param is required" });
    }

    const deletedComplaint = await Complaint.findByIdAndDelete(id).lean();

    if (!deletedComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    return res.status(200).json({
      message: "Complaint deleted successfully",
      deletedComplaint,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// export const rejectComplaint = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params as { id: string };
//     if (!id) {
//       return res.status(400).json({ error: "id param is required" });
//     }

//     const officerId = (req as any).user?.id || req.headers["x-officer-id"];
//     if (!officerId || typeof officerId !== "string") {
//       return res.status(401).json({ error: "Officer not authenticated" });
//     }

//     // Ensure the complaint exists first for a clear 404
//     const exists = await prisma.complaint.findUnique({
//       where: { id },
//       select: { id: true },
//     });
//     if (!exists) {
//       return res.status(404).json({ error: "Complaint not found" });
//     }

//     // Atomic authorization + update: only update if this officer is assigned
//     const result = await prisma.complaint.updateMany({
//       where: { id, assigned_officer_id: officerId as string },
//       data: { category: "unassigned" },
//     });

//     if (result.count === 0) {
//       return res
//         .status(403)
//         .json({ error: "Not authorized to reject this complaint" });
//     }

//     const updated = await prisma.complaint.findUnique({
//       where: { id },
//       select: {
//         id: true,
//         text: true,
//         image_url: true,
//         category: true,
//         status: true,
//         created_at: true,
//       },
//     });

//     return res.status(200).json(updated);
//   } catch (error: any) {
//     console.error(error);
//     return res.status(500).json({ error: error.message });
//   }
// };
