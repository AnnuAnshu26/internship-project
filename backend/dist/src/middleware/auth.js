import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
// ✅ Middleware to authenticate JWT token
export const authMiddleware = (req, res, next) => {
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
    }
    catch (err) {
        console.error("❌ Auth Error:", err.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
