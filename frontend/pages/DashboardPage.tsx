import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserStatus() {
      // ✅ الحصول على المستخدم الحالي
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        window.location.href = "/login";
        return;
      }

      const user = sessionData.session.user;
      setEmail(user.email || "");

      // ✅ جلب بيانات المستخدم من جدول profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("active, role")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        console.error("⚠️ لم يتم العثور على المستخدم في profiles:", error?.message);
        window.location.href = "/login";
        return;
      }

      setActive(profile.active);
      setRole(profile.role);
      setLoading(false);
    }

    fetchUserStatus();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>⏳ جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg text-center space-y-4 max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#1A73E8]">لوحة المستخدم 🎛</h1>
        <p className="text-gray-300 text-sm">مرحبًا، {email}</p>

        {!active ? (
          <p className="text-red-400 font-semibold">
            🚫 حسابك موقوف مؤقتًا. يرجى التواصل مع الدعم لتفعيله.
          </p>
        ) : role === "admin" ? (
          <div className="space-y-3">
            <p className="text-green-400 font-semibold">✅ أنت الأدمن الرئيسي!</p>
            <a
              href="/admin"
              className="block bg-[#1A73E8] hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              ⚙️ الذهاب إلى لوحة تحكم الأدمن
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-green-400 font-semibold">
              ✅ حسابك مفعل ويمكنك استخدام المنصة بحرية.
            </p>
            <a
              href="/app"
              className="block bg-[#1A73E8] hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              🎙 الانتقال إلى المولد الصوتي
            </a>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
