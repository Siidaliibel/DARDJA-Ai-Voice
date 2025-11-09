import React, { useState } from "react";

// 🧠 نصوص الواجهة باللغات الثلاث
const translations = {
  en: {
    title: "Welcome to DARDJA Ai Voice",
    subtitle: "Create your account or log in to start generating voiceovers.",
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    username: "Username",
  },
  fr: {
    title: "Bienvenue sur DARDJA Ai Voice",
    subtitle: "Créez un compte ou connectez-vous pour commencer.",
    login: "Se connecter",
    signup: "Créer un compte",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    username: "Nom d'utilisateur",
  },
  ar: {
    title: "مرحبًا بك في DARDJA Ai Voice",
    subtitle: "أنشئ حسابًا أو قم بتسجيل الدخول لبدء توليد التعليقات الصوتية.",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة السر",
    confirmPassword: "تأكيد كلمة السر",
    username: "اسم المستخدم",
  },
};

export default function AuthPage() {
  const [language, setLanguage] = useState<"en" | "fr" | "ar">("en");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const t = translations[language];

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative ${
        language === "ar" ? "font-cairo" : "font-sans"
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* 🌐 Dropdown لتغيير اللغة */}
      <div className="absolute top-4 right-6">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gray-800 px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            🌐 {language.toUpperCase()} ▼
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-gray-800 rounded-md shadow-lg w-28 text-center border border-gray-700">
              <button
                onClick={() => {
                  setLanguage("en");
                  setDropdownOpen(false);
                }}
                className="block w-full px-3 py-2 hover:bg-gray-700 transition-colors"
              >
                EN 🇬🇧
              </button>
              <button
                onClick={() => {
                  setLanguage("fr");
                  setDropdownOpen(false);
                }}
                className="block w-full px-3 py-2 hover:bg-gray-700 transition-colors"
              >
                FR 🇫🇷
              </button>
              <button
                onClick={() => {
                  setLanguage("ar");
                  setDropdownOpen(false);
                }}
                className="block w-full px-3 py-2 hover:bg-gray-700 transition-colors"
              >
                AR 🇸🇦
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🧠 واجهة التسجيل / الدخول */}
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 border border-gray-700 text-center">
        <h1 className="text-3xl font-bold mb-4">DARDJA Ai Voice</h1>
        <p className="text-gray-400 mb-6">{t.subtitle}</p>

        <input
          type="text"
          placeholder={t.username}
          className="w-full mb-3 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder={t.email}
          className="w-full mb-3 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder={t.password}
          className="w-full mb-3 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder={t.confirmPassword}
          className="w-full mb-6 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-between">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
            {t.login}
          </button>
          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md">
            {t.signup}
          </button>
        </div>
      </div>
    </div>
  );
}
