export async function generateSpeech(text: string, voice: string) {
  const response = await fetch("http://localhost:3001/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice }), // ✅ إرسال النص + الصوت
  });

  if (!response.ok) {
    throw new Error("❌ فشل الاتصال بالسيرفر.");
  }

  const data = await response.json();

  // ✅ استخراج السلسلة الصوتية (Base64) من رد Gemini
  const audioBase64 =
    data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!audioBase64) {
    throw new Error("لم يتم العثور على بيانات الصوت في الرد.");
  }

  console.log("🎧 Voice generation result (base64 length):", audioBase64.length);
  return audioBase64;
}
