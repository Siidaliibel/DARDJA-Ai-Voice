// frontend/auth/useAdminCheck.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      console.log("useAdminCheck: Checking admin status..."); // جديد
      const { data: { user }, error } = await supabase.auth.getUser(); // تغيير: destructure user مباشرة

      if (error) { // جديد: التعامل مع الأخطاء
        console.error("useAdminCheck: Error getting user:", error);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      console.log("useAdminCheck: Current user:", user); // جديد: اطبع المستخدم
      const email = user?.email;
      console.log("useAdminCheck: User email:", email); // جديد: اطبع البريد الإلكتروني
      const adminEmail = "sidalibelbrini1@gmail.com"; // جديد: تعريف البريد الإلكتروني للأدمين
      console.log("useAdminCheck: Admin email to compare:", adminEmail); // جديد

      // ✅ تحقق إن كان المستخدم هو الأدمن
      if (email === adminEmail) { // تغيير: استخدام المتغير adminEmail
        setIsAdmin(true);
        console.log("useAdminCheck: User IS admin."); // جديد
      } else {
        setIsAdmin(false);
        console.log("useAdminCheck: User is NOT admin."); // جديد
      }

      setLoading(false);
    }

    checkAdmin();

    // 💡 إضافة هذا listener للاستماع لتغييرات حالة المصادقة
    // هذا سيجعل الـ hook يتفاعل بشكل ديناميكي
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("useAdminCheck: Auth state changed:", _event, session); // جديد
        if (session?.user?.email === "sidalibelbrini1@gmail.com") {
          setIsAdmin(true);
          console.log("useAdminCheck: User IS admin after auth state change.");
        } else {
          setIsAdmin(false);
          console.log("useAdminCheck: User is NOT admin after auth state change.");
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // أبقِ مصفوفة التبعيات فارغة لأننا نستمع للتغييرات داخل الـ useEffect

  return { isAdmin, loading };
}