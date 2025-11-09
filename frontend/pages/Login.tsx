import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../src/context/LanguageContext";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "../Logo"; // ✅ استيراد اللوغو

// ✅ الترجمة
const translations = {
  ar: {
    title: "تسجيل الدخول 🎙",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "دخول",
    loading: "⏳ جاري تسجيل الدخول...",
    noAccount: "ليس لديك حساب؟",
    createAccount: "إنشاء حساب جديد",
    forgotPassword: "نسيت كلمة المرور؟",
    invalid: "❌ لا يوجد حساب بهذا البريد الإلكتروني. أنشئ حسابًا جديدًا.",
    error: "حدث خطأ أثناء تسجيل الدخول.",
  },
  en: {
    title: "Login 🎙",
    email: "Email",
    password: "Password",
    login: "Login",
    loading: "⏳ Logging in...",
    noAccount: "Don't have an account?",
    createAccount: "Create an account",
    forgotPassword: "Forgot your password?",
    invalid: "❌ Invalid login credentials.",
    error: "An error occurred while logging in.",
  },
  fr: {
    title: "Connexion 🎙",
    email: "E-mail",
    password: "Mot de passe",
    login: "Se connecter",
    loading: "⏳ Connexion en cours...",
    noAccount: "Vous n'avez pas de compte ?",
    createAccount: "Créer un compte",
    forgotPassword: "Mot de passe oublié ?",
    invalid: "❌ Identifiants incorrects.",
    error: "Une erreur s'est produite lors de la connexion.",
  },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  // ✅ لتفعيل الأنيميشن مرة واحدة فقط عند تحميل الصفحة
  const [animate, setAnimate] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 2500); // مدة الأنيميشن 2.5 ثانية
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.includes("Invalid login credentials")) setError(t.invalid);
      else setError(t.error);
    } else {
      navigate("/app");
    }
  };

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center text-white relative"
    >
      {/* 🌐 أزرار اللغة */}
      <div className="absolute top-6 right-6 flex gap-2 text-sm">
        {["en", "fr", "ar"].map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang as "ar" | "en" | "fr")}
            className={`px-2 py-1 rounded-md transition-colors ${
              language === lang
                ? "bg-[#1A73E8] text-white"
                : "bg-gray-800 bg-opacity-70 hover:bg-gray-700"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* مربع تسجيل الدخول */}
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        {/* ✅ اللوغو مع النص بنفس الخط والأنيميشن */}
        <div className="flex flex-col items-center mb-6">
          <div className={`transition-all duration-1000 ${animate ? "animate-fadeIn" : ""}`}>
            <Logo />
          </div>
          <h1
            className={`text-3xl font-bold mt-2 text-[#1A73E8] ${
              animate ? "animate-glowOnce" : ""
            }`}
            style={{
              fontFamily: "'Orbitron', sans-serif", // 🔹 نفس خط شعار الموقع (modern tech style)
              textShadow: "0 0 12px #1A73E8, 0 0 20px #1A73E8",
            }}
          >
            DARDJA Ai Voice
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-sm mb-1">{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
              required
            />
          </div>

          {/* كلمة المرور */}
          <div className="relative">
            <label className="block text-sm mb-1">{t.password}</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-gray-800 border border-gray-600 rounded-lg p-3 ${
                language === "ar" ? "pl-10 pr-3" : "pr-10"
              } focus:outline-none focus:ring-2 focus:ring-[#1A73E8]`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-9 text-gray-400 hover:text-white transition ${
                language === "ar" ? "left-3" : "right-3"
              }`}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* زر الدخول */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-blue-800 cursor-not-allowed"
                : "bg-[#1A73E8] hover:bg-blue-600"
            } text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md`}
          >
            {loading ? t.loading : t.login}
          </button>

          {/* 🔑 زر نسيت كلمة المرور */}
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="block mx-auto text-sm text-[#1A73E8] hover:underline mt-3"
          >
            {t.forgotPassword}
          </button>
        </form>

        {/* جملة إنشاء حساب */}
        <p className="text-center text-sm text-gray-400 mt-6">
          {t.noAccount}{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-[#1A73E8] hover:underline"
          >
            {t.createAccount}
          </button>
        </p>
      </div>

      {/* ✅ الأنيميشن داخل نفس الملف */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-15px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease-out forwards;
        }

        @keyframes glowOnce {
          0% { text-shadow: 0 0 0px #1A73E8; opacity: 0.5; }
          50% { text-shadow: 0 0 20px #1A73E8; opacity: 1; }
          100% { text-shadow: 0 0 12px #1A73E8; opacity: 1; }
        }
        .animate-glowOnce {
          animation: glowOnce 2.5s ease-in-out 1;
        }
      `}</style>
    </div>
  );
}

