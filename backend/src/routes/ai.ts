import express, { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Gemini model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// ✅ Pitch generator route
router.post("/generate-pitch", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body as { prompt?: string };
    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing" });
    }

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (err: any) {
    console.error("❌ AI ERROR:", err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
});

// ✅ Chatbot route
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message } = req.body as { message?: string };
    if (!message) {
      return res.status(400).json({ error: "Message missing" });
    }

    const result = await model.generateContent(message);
    res.json({ reply: result.response.text() });
  } catch (err: any) {
    console.error("❌ Chat Error:", err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
});

// ✅ Chat Summary Route
router.post("/summary", async (req: Request, res: Response) => {
  try {
    const { chats } = req.body as { chats?: { senderName: string; text: string }[] };
    if (!chats || chats.length === 0) {
      return res.status(400).json({ error: "No chats to summarize" });
    }

    const prompt = `
      Summarize the following team chat briefly and clearly in 5-7 lines:
      ${chats.map((c) => `${c.senderName}: ${c.text}`).join("\n")}
    `;

    const result = await model.generateContent(prompt);
    res.json({ summary: result.response.text() });
  } catch (err: any) {
    console.error("❌ Summary Error:", err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
});

export default router;
