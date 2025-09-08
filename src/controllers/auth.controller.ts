import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Minimal JWT auth for hackathon demo: no refresh tokens
// Request bodies:
// Signup: { username: string, fan: string, password: string }
// Login:  { username: string, password: string }

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, fan, password } = req.body as {
      username?: string;
      fan?: string; // national id number
      password?: string;
    };

    if (!username || !fan || !password) {
      return res
        .status(400)
        .json({ message: "username, fan and password are required" });
    }

    // Ensure unique username and fan
    const existing = await User.findOne({
      $or: [{ username }, { fan }],
    }).lean();
    if (existing) {
      return res
        .status(409)
        .json({ message: "User with same username or fan already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const created = await User.create({ username, fan, password: hashed });

    return res.status(201).json({
      id: created._id,
      username: created.username,
      fan: created.fan,
      createdAt: created.createdAt,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, (user as any).password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        userId: (user as any)._id.toString(),
        username: (user as any).username,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
