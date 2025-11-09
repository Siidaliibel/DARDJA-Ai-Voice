import React, { useState, useEffect, useRef } from "react";
import { Globe } from "lucide-react";

type Props = {
  language: string;
  setLanguage: (lang: string) => void;
};

const languages = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "ar", label: "AR", flag: "🇸🇦" },
];

export default function LanguageSelector({ language, setLanguage }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🧠 تحميل اللغة المحفوظة من localStorage عند بداية التشغيل
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && ["en", "fr", "ar"].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, [setLanguage]);

  // 🌀 عند اختيار لغة جديدة
  const handleLanguageChange = (lang: string) => {
    localStorage.setItem("lang", lang);
    setLanguage(lang);
    setIsOpen(false);
  };

  // 🧱 إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="absolute top-4 right-4 z-50">
      {/* 🌐 زر الأيقونة */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-full shadow-md transition"
      >
        <Globe size={18} className="text-blue-400" />
        <span className="text-sm">{language.toUpperCase()}</span>
      </button>

      {/* 🧾 القائمة المنسدلة */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-700 rounded-xl shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center justify-between w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition ${
                lang.code === language ? "bg-gray-800" : ""
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
