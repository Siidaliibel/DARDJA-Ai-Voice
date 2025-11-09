import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang === "ar" || savedLang === "fr" || savedLang === "en") {
      return savedLang;
    }
    const browserLang = navigator.language.split("-")[0];
    return ["ar", "fr", "en"].includes(browserLang) ? (browserLang as Language) : "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
