import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

/* ------------------------------- 🎙 توليد الصوت ------------------------------- */
app.post("/generate", async (req, res) => {
  try {
    const { text, voice } = req.body;
    const voiceMap = {
      Amel: "Leda",
      Wael: "Algenib",
      Imene: "Sulafat",
      Amine: "Achird",
    };
    const selectedVoice = voiceMap[voice] || "Leda"; // ✅ تصحيح هنا (كان بدون ||)

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
              prebuiltVoiceConfig: {
                voiceName: selectedVoice,
              },
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
    console.error("❌ Error details:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    res.status(500).json({
      error:
        "⚠️ خطأ داخلي في السيرفر. تحقق من مفتاح Google API أو إعدادات الصوت.",
    });
  }
});

/* ------------------------------- 👑 لوحة الأدمين (Supabase Admin API) ------------------------------- */
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ جلب المستخدمين
app.get("/admin/users", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;
    res.json(data.users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ حذف مستخدم
app.delete("/admin/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ تفعيل أو تعطيل مستخدم (active = true/false)
app.post("/admin/toggle-active", async (req, res) => {
  try {
    const { email, active } = req.body;
    const { data, error } = await supabaseAdmin
      .from("users_usage")
      .update({ active })
      .eq("email", email);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------- ✅ Endpoint بسيط للـ cron-job ------------------------------- */
app.get("/", (req, res) => {
  res.send("Server Active ✅");
});

/* ------------------------------- 🚀 تشغيل السيرفر ------------------------------- */
const PORT = process.env.PORT || 3001; // ✅ تصحيح هنا (كان بدون ||)
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT} (with Admin API)`)
);
