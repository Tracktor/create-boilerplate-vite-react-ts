import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en";
import fr from "@/locales/fr";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    load: "languageOnly",
    react: {
      useSuspense: true,
    },
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
    },
    returnNull: false,
  })
  .then(() => {
    if (document.documentElement.lang === i18n.resolvedLanguage) {
      return;
    }

    if (i18n.resolvedLanguage) {
      document.documentElement.setAttribute("lang", i18n.resolvedLanguage);
    }
  });

i18n.on("languageChanged", (lng: string) => {
  document.documentElement.setAttribute("lang", lng);
});

export default i18n;
