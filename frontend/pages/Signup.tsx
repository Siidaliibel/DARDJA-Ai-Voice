import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../src/context/LanguageContext";
import { Eye, EyeOff } from "lucide-react"; // ✅ أيقونات احترافية

// ✅ الترجمة
const translations = {
  ar: {
    title: "إنشاء حساب جديد ✨",
    username: "اسم المستخدم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    create: "إنشاء حساب",
    loading: "⏳ جاري إنشاء الحساب...",
    haveAccount: "لديك حساب؟",
    login: "تسجيل الدخول",
    passwordMismatch: "❌ كلمتا المرور غير متطابقتين.",
    alreadyRegistered: "❌ هذا البريد الإلكتروني مسجل بالفعل. حاول تسجيل الدخول.",
    weakPassword: "⚠️ كلمة المرور ضعيفة جدًا. الرجاء اختيار كلمة أقوى.",
    signupError: "حدث خطأ أثناء إنشاء الحساب. حاول مجددًا.",
    signinError:
      "تم إنشاء حسابك بنجاح. يرجى مراجعة بريدك الإلكتروني والنقر على رابط التفعيل لإتمام عملية التسجيل.",
  },
  en: {
    title: "Create a New Account ✨",
    username: "Username",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    create: "Create Account",
    loading: "⏳ Creating account...",
    haveAccount: "Already have an account?",
    login: "Login",
    passwordMismatch: "❌ Passwords do not match.",
    alreadyRegistered: "❌ This email is already registered. Try logging in.",
    weakPassword: "⚠️ Password too weak. Please choose a stronger one.",
    signupError: "An error occurred while creating the account. Try again.",
    signinError:
      "Your account has been created successfully. Please check your email and click the activation link to complete your registration.",
  },
  fr: {
    title: "Créer un nouveau compte ✨",
    username: "Nom d'utilisateur",
    email: "E-mail",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    create: "Créer un compte",
    loading: "⏳ Création du compte...",
    haveAccount: "Vous avez déjà un compte ?",
    login: "Connexion",
    passwordMismatch: "❌ Les mots de passe ne correspondent pas.",
    alreadyRegistered: "❌ Cet e-mail est déjà enregistré. Essayez de vous connecter.",
    weakPassword: "⚠️ Mot de passe trop faible. Choisissez-en un plus fort.",
    signupError: "Une erreur est survenue lors de la création du compte.",
    signinError:
      "Votre compte a été créé avec succès. Veuillez vérifier votre e-mail et cliquer sur le lien d’activation pour finaliser votre inscription.",
  },
};


export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setLoading(true);

    // ✅ إنشاء الحساب في Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("already registered")) setError(t.alreadyRegistered);
      else if (error.message.includes("weak password")) setError(t.weakPassword);
      else setError(t.signupError);
    } else {
      // ✅ بعد التسجيل، نضيف المستخدم مباشرة في جدول profiles
      const user = data.user;
      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            active: true,
            usage_count: 0,
            trial_used: false,
            max_generations: 2,
            max_characters: 600,
            role: "user",
          }, { onConflict: "id" });

        if (profileError) {
          console.warn("⚠️ خطأ أثناء إنشاء صف المستخدم في profiles:", profileError.message);
        } else {
          console.log("✅ تم إنشاء صف المستخدم في جدول profiles بنجاح");
        }
      }

      // ✅ تسجيل الدخول مباشرة بعد التسجيل
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) setError(t.signinError);
      else navigate("/app");
    }
  };

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center text-white relative"
    >
      {/* 🌐 أزرار اللغة خارج المربع */}
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

      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6">{t.title}</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* 🧍‍♂️ اسم المستخدم */}
          <div>
            <label className="block text-sm mb-1">{t.username}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
              required
            />
          </div>

          {/* 📧 البريد الإلكتروني */}
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

          {/* 🔒 كلمة المرور */}
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

          {/* ✅ تأكيد كلمة المرور */}
          <div className="relative">
            <label className="block text-sm mb-1">{t.confirmPassword}</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-gray-800 border border-gray-600 rounded-lg p-3 ${
                language === "ar" ? "pl-10 pr-3" : "pr-10"
              } focus:outline-none focus:ring-2 focus:ring-[#1A73E8]`}
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

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-blue-800 cursor-not-allowed"
                : "bg-[#1A73E8] hover:bg-blue-600"
            } text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md`}
          >
            {loading ? t.loading : t.create}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          {t.haveAccount}{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#1A73E8] hover:underline"
          >
            {t.login}
          </button>
        </p>
      </div>
    </div>
  );
}
