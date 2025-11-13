import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../src/context/LanguageContext";
import { Eye, EyeOff } from "lucide-react";

const translations = {
  ar: {
    title: "إعادة تعيين كلمة المرور 🔑",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    reset: "تحديث كلمة المرور",
    success: "✅ تم تحديث كلمة المرور بنجاح!",
    error: "❌ حدث خطأ أثناء تحديث كلمة المرور.",
    mismatch: "⚠️ كلمتا المرور غير متطابقتين.",
    back: "العودة إلى تسجيل الدخول",
  },
  en: {
    title: "Reset Password 🔑",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    reset: "Update Password",
    success: "✅ Password updated successfully!",
    error: "❌ Error updating password.",
    mismatch: "⚠️ Passwords do not match.",
    back: "Back to Login",
  },
  fr: {
    title: "Réinitialiser le mot de passe 🔑",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    reset: "Mettre à jour le mot de passe",
    success: "✅ Mot de passe mis à jour avec succès!",
    error: "❌ Erreur lors de la mise à jour du mot de passe.",
    mismatch: "⚠️ Les mots de passe ne correspondent pas.",
    back: "Retour à la connexion",
  },
};

export default function ResetPassword() {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ الالتقاط التلقائي للـ token من Supabase
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace("#", "?"));
    const access_token = hashParams.get("access_token");
    const type = hashParams.get("type");

    if (type === "recovery" && access_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token: hashParams.get("refresh_token") || "",
      });
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage(t.mismatch);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) setMessage(t.error);
    else setMessage(t.success);
  };

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white"
    >
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6">{t.title}</h1>

        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* كلمة المرور الجديدة */}
          <div className="relative">
            <label className="block text-sm mb-1">{t.newPassword}</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
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

          {/* تأكيد كلمة المرور */}
          <div className="relative">
            <label className="block text-sm mb-1">{t.confirmPassword}</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute top-9 text-gray-400 hover:text-white transition ${
                language === "ar" ? "left-3" : "right-3"
              }`}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {message && (
            <p
              className={`text-center text-sm ${
                message.includes("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#1A73E8] hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
          >
            {t.reset}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          <button
            onClick={() => navigate("/login")}
            className="text-[#1A73E8] hover:underline"
          >
            {t.back}
          </button>
        </p>
      </div>
    </div>
  );
}
