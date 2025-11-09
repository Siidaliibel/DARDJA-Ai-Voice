import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminPage from "./pages/AdminPage"; // ✅ تمت الإضافة
import { supabase } from "./lib/supabaseClient";
import { LanguageProvider } from "./src/context/LanguageContext"; // ✅ المسار الصحيح لأنك ما عندك مجلد src

// ✅ مكوّن الحماية العام للمستخدمين المسجلين
function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const [loading, setLoading] = React.useState(true);
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    const initSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (error) {
        console.error("⚠️ خطأ أثناء تحميل الجلسة:", error);
      } finally {
        setLoading(false);
      }
    };
    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading)
    return (
      <div className="text-white text-center mt-10">
        ⏳ جاري التحقق من الجلسة...
      </div>
    );

  if (!session) return <Navigate to="/login" replace />;
  return children;
}

// ✅ مكوّن حماية خاص بالأدمن فقط
function AdminRoute({ children }: { children: React.ReactElement }) {
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const checkAdmin = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role === "admin") {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("⚠️ خطأ أثناء التحقق من الأدمن:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading)
    return (
      <div className="text-white text-center mt-10">
        ⏳ جاري التحقق من الصلاحيات...
      </div>
    );

  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
}

const root = ReactDOM.createRoot(document.getElementById("root")!);

// ✅ إضافة معالجة انتظار تحميل التطبيق بالكامل قبل الرسم (يمنع خطأ الـ Reload)
(async () => {
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      console.log("✅ جلسة مستخدم موجودة، تحميل التطبيق...");
    } else {
      console.log("ℹ️ لا توجد جلسة حالياً، سيتم التوجيه عند الحاجة...");
    }
  } catch (error) {
    console.warn("⚠️ لم يتمكن من جلب الجلسة:", error);
  }

  root.render(
    <React.StrictMode>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* ✅ التوجيه الافتراضي */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* ✅ صفحات الدخول */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* ✅ صفحة التطبيق العادية للمستخدم */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }
            />

            {/* ✅ صفحة الأدمن */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            {/* ✅ أي مسار آخر */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </React.StrictMode>
  );
})();
