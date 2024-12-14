import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '../locales/en/translations.json';
import esTranslations from '../locales/es/translations.json';
import arTranslations from '../locales/ar/translations.json';
import deTranslations from '../locales/de/translations.json';
import frTranslations from '../locales/fr/translations.json';
import hiTranslations from '../locales/hi/translations.json';
import itTranslations from '../locales/it/translations.json';
import jaTranslations from '../locales/ja/translations.json';
import koTranslations from '../locales/ko/translations.json';
import ptTranslations from '../locales/pt/translations.json';
import ruTranslations from '../locales/ru/translations.json';
import trTranslations from '../locales/tr/translations.json';
import zhTranslations from '../locales/zh/translations.json';
import heTranslations from '../locales/he/translations.json';


const resources = {
  en: {
    translation: enTranslations
  },
  es: {
    translation: esTranslations
  },
  ar: {
    translation: arTranslations
  },
  de: {
    translation: deTranslations
  },
  fr: {
    translation: frTranslations
  },
  hi: {
    translation: hiTranslations
  },
  it: {
    translation: itTranslations
  },
  ja: {
    translation: jaTranslations
  },
  ko: {
    translation: koTranslations
  },
  pt: {
    translation: ptTranslations
  },
  ru: {
    translation: ruTranslations
  },
  tr: {
    translation: trTranslations
  },
  zh: {
    translation: zhTranslations
  },
  he: {
    translation: heTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator']
    },
    keySeparator: '.',  // Add this line
    nsSeparator: false    // Add this line
  });

export default i18n;
