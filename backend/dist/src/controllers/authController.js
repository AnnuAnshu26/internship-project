import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js"; // ✅ added .js extension for ESM
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
// ✅ Signup (Register a new user)
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const existing = await User.findOne({ email });
        if (existing) {
            res.status(400).json({ message: "Email already in use" });
            return;
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            passwordHash: hash,
        });
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (err) {
        console.error("❌ Signup Error:", err);
        res.status(500).json({ message: err.message || "Server error" });
    }
};
// ✅ Login (Authenticate existing user)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Missing credentials" });
            return;
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                teamId: user.teamId,
            },
        });
    }
    catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ message: err.message || "Server error" });
    }
};
