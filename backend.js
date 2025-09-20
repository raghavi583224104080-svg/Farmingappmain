// backend.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config(); // loads GEMINI_API_KEY from .env

const app = express();
app.use(cors());
app.use(express.json());

// multer for handling image uploads
const upload = multer();

app.post("/ai", upload.single("image"), async (req, res) => {
  const prompt = req.body.prompt;
  const imageFile = req.file;

  if (!prompt && !imageFile) {
    return res.status(400).json({ error: "No prompt or image provided" });
  }

  try {
    // Prepare payload for Gemini API
    const payload = { input: prompt || "" };

    if (imageFile) {
      // If your Gemini endpoint supports images, send base64
      payload.image = imageFile.buffer.toString("base64");
    }

    // Replace with your actual Gemini endpoint
    const response = await fetch("https://api.gemini.com/v1/your-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Send a simplified reply to frontend
    res.json({ reply: data.output || "No response from Gemini" });

  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Server error contacting AI" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
