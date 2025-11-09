import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface UserProfile {
  id: string;
  email: string | null;
  active: boolean;
  usage_count: number;
  max_generations?: number;
  max_characters?: number;
  trial_used?: boolean;
  role?: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [updating, setUpdating] = useState(false);

  // ✅ التحقق من صلاحيات الأدمن
  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      console.log("🟦 التحقق من الجلسة...");
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.error("🚫 لا توجد جلسة، إعادة إلى تسجيل الدخول");
        navigate("/login");
        return;
      }
      const user = data.session.user;
      console.log("✅ المستخدم الحالي:", user.email);

      // ✅ جلب الدور من جدول profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("❌ خطأ في جلب الدور:", profileError.message);
        navigate("/login");
        return;
      }

      console.log("🔍 دور المستخدم:", profile?.role);

      if (profile?.role === "admin") {
        console.log("🟢 المستخدم أدمن ✅");
        if (mounted) {
          setIsAdmin(true);
          setLoading(false);
          fetchUsers();
        }
      } else {
        console.warn("🚷 المستخدم ليس أدمن — تحويل للواجهة الرئيسية");
        navigate("/app");
      }
    };

    checkAdmin();

    // ✅ تحديث تلقائي كل 15 ثانية
    const interval = setInterval(() => {
      if (isAdmin) fetchUsers();
    }, 15000);

    // ✅ مراقبة تغيّر الجلسة
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          console.warn("❌ تم تسجيل الخروج — إعادة إلى صفحة تسجيل الدخول");
          navigate("/login");
          return;
        }
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (profile?.role === "admin") {
          setIsAdmin(true);
          setLoading(false);
          fetchUsers();
        } else {
          navigate("/app");
        }
      }
    );

    return () => {
      clearInterval(interval);
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [navigate, isAdmin]);
  // ✅ جلب المستخدمين عبر Edge Function
  const fetchUsers = async () => {
    console.log("📡 جارِ جلب المستخدمين من Edge Function...");
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("🚫 لا توجد جلسة صالحة.");
      return;
    }

    try {
      const response = await fetch(
        "https://egnqddcngnhkfjzixdhj.supabase.co/functions/v1/get-all-users",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("❌ فشل الجلب من Edge Function:", response.status);
        return;
      }

      const data = await response.json();
      console.log(`✅ تم جلب ${data.length} مستخدم من السيرفر.`);
      setUsers(data ?? []);
    } catch (err) {
      console.error("⚠️ خطأ أثناء الجلب:", err);
    }
  };

  // ✅ استدعاء update-user Edge Function (مع تمرير الـ token الصحيح)
  const callUpdateUser = async (userId: string, action: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const response = await fetch(
        "https://egnqddcngnhkfjzixdhj.supabase.co/functions/v1/update-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ userId, action }),
        }
      );

      const result = await response.json();
      if (result.success) {
        console.log(`✅ تمت العملية: ${action}`);
        fetchUsers();
      } else {
        console.error(`❌ فشل في العملية: ${result.error}`);
      }
    } catch (err) {
      console.error("⚠️ خطأ أثناء تنفيذ العملية:", err);
    }
  };

  // ✅ تعطيل المستخدم (active = false)
  const toggleUserStatus = async (id: string, current: boolean) => {
    if (!isAdmin) return;
    setUpdating(true);
    await callUpdateUser(id, current ? "deactivate" : "activate");
    setUpdating(false);
  };

  // ✅ إعادة تعيين العداد
  const resetUsage = async (id: string) => {
    if (!isAdmin) return;
    setUpdating(true);
    await callUpdateUser(id, "reset_usage");
    setUpdating(false);
  };

  // ✅ حذف المستخدم
  const deleteUser = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    setUpdating(true);
    await callUpdateUser(id, "delete");
    setUpdating(false);
  };

  // ✅ تفعيل المستخدم بعد الدفع (active=true, usage_count=0, max_generations=200)
  const activatePaidPlan = async (id: string) => {
    if (!isAdmin) return;
    setUpdating(true);
    await callUpdateUser(id, "enable_premium");
    setUpdating(false);
  };

  // ✅ أثناء التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-gray-300 flex items-center justify-center text-xl">
        جاري التحقق من الصلاحيات...
      </div>
    );
  }

  if (!isAdmin) return null;
  // ✅ واجهة لوحة التحكم
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl text-[#1A73E8] font-bold mb-6">
        لوحة تحكم الأدمين ⚙️
      </h1>
      <p className="text-gray-400 text-center mb-8">
        مرحبًا <span className="text-[#1A73E8] font-semibold">Sidali</span> 👋
        <br />
        يمكنك إدارة المستخدمين والاشتراكات من هنا.
      </p>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => fetchUsers()}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors"
        >
          🔄 تحديث القائمة
        </button>
        <button
          onClick={() => navigate("/app")}
          className="bg-[#1A73E8] hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors"
        >
          ⬅️ العودة لواجهة التعليق الصوتي
        </button>
      </div>

      {updating && <p className="text-yellow-400 mb-4">جارٍ التحديث...</p>}

      <div className="w-full max-w-4xl overflow-x-auto bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-xl">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-300 border-b border-gray-700">
            <tr>
              <th className="p-2">الإيميل</th>
              <th className="p-2 text-center">الحالة</th>
              <th className="p-2 text-center">الاستهلاك</th>
              <th className="p-2 text-center">الخطة</th>
              <th className="p-2 text-center">التحكم</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-6">
                  لا يوجد مستخدمين حالياً
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-800 hover:bg-gray-800/40 transition"
                >
                  <td className="p-2">{user.email}</td>
                  <td className="text-center p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        user.active
                          ? "bg-green-600/30 text-green-400"
                          : "bg-red-600/30 text-red-400"
                      }`}
                    >
                      {user.active ? "مفعّل" : "موقوف"}
                    </span>
                  </td>
                  <td className="text-center p-2">
                    {user.usage_count} / {user.max_generations ?? 2}
                  </td>
                  <td className="text-center p-2">
                    {user.trial_used ? (
                      <span className="text-green-400 text-xs font-semibold">
                        مدفوعة 💎
                      </span>
                    ) : (
                      <span className="text-yellow-400 text-xs font-semibold">
                        تجريبية 🧪
                      </span>
                    )}
                  </td>
                  <td className="text-center p-2 flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.active)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold ${
                        user.active
                          ? "bg-red-700 hover:bg-red-800"
                          : "bg-green-700 hover:bg-green-800"
                      }`}
                    >
                      {user.active ? "تعطيل" : "تفعيل"}
                    </button>

                    <button
                      onClick={() => resetUsage(user.id)}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-xs rounded-md font-semibold"
                    >
                      إعادة العداد
                    </button>

                    <button
                      onClick={() => activatePaidPlan(user.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-xs rounded-md font-semibold"
                    >
                      تفعيل المستخدم 🔓
                    </button>

                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-800 text-xs rounded-md font-semibold"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
