import { Request, Response } from "express";
import prisma from "../services/db"; // make sure you created and exported PrismaClient in db.ts

export const createComplaint = async (req: Request, res: Response) => {
  const {
    clerk_user_id = null,
    text,
    category = "",
    location = null,
    image_url = null,
    status = "submitted",
  } = req.body;

  if (!text) {
    return res.status(400).json({ error: "text is required" });
  }

  try {
    const complaint = await prisma.complaint.create({
      data: {
        clerk_user_id,
        text,
        category,
        image_url,
        status,
      },
    });

    return res.status(201).json(complaint);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
