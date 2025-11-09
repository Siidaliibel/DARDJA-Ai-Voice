// frontend/auth/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      console.log("ProtectedRoute: Checking session..."); // جديد
      const { data, error } = await supabase.auth.getSession(); // إضافة error للتحقق

      if (error) { // جديد: التعامل مع الأخطاء
        console.error("ProtectedRoute: Error getting session:", error);
        setIsAuthenticated(false);
      } else if (data.session) {
        console.log("ProtectedRoute: Session found!", data.session.user.email); // جديد
        setIsAuthenticated(true);
      } else {
        console.log("ProtectedRoute: No session found."); // جديد
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkSession();

    // 🧩 تحديث الجلسة في الوقت الحقيقي
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("ProtectedRoute: Auth state changed:", _event, session?.user?.email); // جديد
      setIsAuthenticated(!!session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    console.log("ProtectedRoute: Loading state..."); // جديد
    return <div className="text-white text-center mt-10">جارٍ التحقق...</div>;
  }

  // إذا لم يكن مسجلاً الدخول → أعد توجيهه إلى صفحة الدخول
  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to /login"); // جديد
    return <Navigate to="/login" replace />;
  }

  // إذا كان مسجلاً الدخول → أظهر الصفحة المطلوبة
  console.log("ProtectedRoute: Authenticated, rendering children."); // جديد
  return <>{children}</>;
}