import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LangauageDetector from "i18next-browser-languagedetector";
import translationEn from "./locale/en.json";
import translationFr from "./locale/fr.json";

const resources = {
  en: {
    translation: translationEn,
  },
  fr: {
    translation: translationFr,
  },
};

i18n
  .use(LangauageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
    fallbackLng: "en",
    detection: {
      order: ["path", "cookie", "htmlTag", "localStorage"],
      caches: ["cookie"],
    },
    react: { useSuspense: false },
  });

export default i18n;