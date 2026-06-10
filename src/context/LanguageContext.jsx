import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const isAr = lang === 'ar';
  const isFr = lang === 'fr';

  // t(english, arabic, french) — french defaults to english if omitted
  const t = (en, ar, fr) => {
    if (isAr) return ar;
    if (isFr) return fr ?? en;
    return en;
  };

  // Convert to Arabic-Indic numerals in Arabic mode only
  const num = (n) => {
    if (!isAr) return String(n);
    return String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  };

  return (
    <LanguageContext.Provider value={{ lang, isAr, isFr, setLang, t, num }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
