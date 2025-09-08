import { Request, Response } from "express";
import prisma from "../services/db";

export const createProfile = async (req: Request, res: Response) => {
  const {
    clerk_user_id = null,
    full_name = "",
    phone_number = "",
    role = "citizen",
    preferred_language = "en",
  } = req.body;

  try {
    const profile = await prisma.profile.create({
      data: {
        clerk_user_id,
        full_name,
        phone_number,
        role,
        preferred_language,
      },
    });
    return res.status(201).json(profile);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
