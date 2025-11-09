import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import history from "connect-history-api-fallback";
import os from "os";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3000;

// ✅ دعم History API لحل مشكلة إعادة التحميل (reload)
app.use(history());

// ✅ تقديم ملفات البناء (dist)
app.use(express.static(path.join(__dirname, "dist")));

// ✅ تشغيل السيرفر على كل الشبكة (0.0.0.0) ليظهر IP المحلي مثل 192.168.x.x
app.listen(port, "0.0.0.0", () => {
  console.log("✅ Server running on:");
  console.log(`→ Local:   http://localhost:${port}`);
  console.log(`→ Network: http://${getLocalIP()}:${port}`);
});

// 🔍 دالة للحصول على عنوان IP المحلي (للشبكة)
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}
