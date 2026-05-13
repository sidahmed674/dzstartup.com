"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type Locale, getTranslations, type Translations } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
  isRTL: boolean;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: getTranslations("en"),
  isRTL: false,
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("dzstartup-locale") as Locale;
    if (saved && ["en", "fr", "ar"].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("dzstartup-locale", newLocale);
    document.documentElement.setAttribute("lang", newLocale);
    document.documentElement.setAttribute("dir", newLocale === "ar" ? "rtl" : "ltr");
  };

  useEffect(() => {
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
  }, [locale]);

  const isRTL = locale === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t: getTranslations(locale),
        isRTL,
        dir,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
