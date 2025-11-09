// index.js (أو server.js)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { text, voice } = req.body;

    const voiceMap = {
      Amel: "Leda",
      Wael: "Algenib",
      Imene: "Sulafat",
      Amine: "Achird",
    };

    const selectedVoice = voiceMap[voice] || "Leda";

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text }],
          },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GOOGLE_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ Voice generation error:", error.response?.data || error.message);
    res.status(500).json({ error: "❌ فشل الاتصال بالسيرفر." });
  }
});

app.listen(3001, () => console.log("🚀 Backend running on http://localhost:3001"));
