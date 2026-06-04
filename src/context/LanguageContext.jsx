import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const toggleLang = () => setLang(l => (l === 'en' ? 'ar' : 'en'));
  const isAr = lang === 'ar';

  // t(english, arabic) — returns the correct string for current language
  const t = (en, ar) => (isAr ? ar : en);

  // Convert to Arabic-Indic numerals when in Arabic mode
  const num = (n) => {
    if (!isAr) return String(n);
    return String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  };

  return (
    <LanguageContext.Provider value={{ lang, isAr, toggleLang, t, num }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
