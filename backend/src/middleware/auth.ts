import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export interface AuthRequest extends Request {
  user?: JwtPayload | string;
}

// ✅ Middleware to authenticate JWT token
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;

    next();
  } catch (err: any) {
    console.error("❌ Auth Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
