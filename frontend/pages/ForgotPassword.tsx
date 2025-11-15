import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../src/context/LanguageContext";

// ✅ الترجمات
const translations = {
  ar: {
    title: "إعادة تعيين كلمة المرور 🔑",
    email: "البريد الإلكتروني",
    sendLink: "إرسال رابط إعادة التعيين",
    loading: "⏳ جاري الإرسال...",
    success: "✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
    error: "❌ حدث خطأ أثناء الإرسال. حاول مجددًا.",
    backToLogin: "العودة إلى تسجيل الدخول",
  },
  en: {
    title: "Reset Password 🔑",
    email: "Email",
    sendLink: "Send Reset Link",
    loading: "⏳ Sending...",
    success: "✅ A password reset link has been sent to your email.",
    error: "❌ An error occurred while sending the email. Please try again.",
    backToLogin: "Back to Login",
  },
  fr: {
    title: "Réinitialiser le mot de passe 🔑",
    email: "E-mail",
    sendLink: "Envoyer le lien de réinitialisation",
    loading: "⏳ Envoi en cours...",
    success: "✅ Un lien de réinitialisation du mot de passe a été envoyé à votre e-mail.",
    error: "❌ Une erreur s'est produite lors de l'envoi. Réessayez.",
    backToLogin: "Retour à la connexion",
  },
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://dardjaaivoice.com/reset-password", // ✅ غيّر هذا إلى رابط موقعك الحقيقي لاحقًا
    });

    setLoading(false);
    if (error) {
      setMessage(t.error);
    } else {
      setMessage(t.success);
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

      {/* 🔹 المربع الرئيسي */}
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6">{t.title}</h1>

        <form onSubmit={handleResetPassword} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-blue-800 cursor-not-allowed"
                : "bg-[#1A73E8] hover:bg-blue-600"
            } text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md`}
          >
            {loading ? t.loading : t.sendLink}
          </button>
        </form>

        {/* ✅ رسالة النجاح أو الخطأ */}
        {message && (
          <p
            className={`text-center text-sm mt-4 ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {/* 🔙 العودة إلى تسجيل الدخول */}
        <p className="text-center text-sm text-gray-400 mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-[#1A73E8] hover:underline"
          >
            {t.backToLogin}
          </button>
        </p>
      </div>
    </div>
  );
}
