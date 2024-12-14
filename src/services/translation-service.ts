import i18next, { Resource } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export default class TranslationService {
  updateLanguage(language: string) {
    i18next.changeLanguage(language);
  }

  async init(resources: Resource, language: string) {
    return i18next
      .use(LanguageDetector)
      .init({
        resources,
        load: 'languageOnly',
        lng: language,
        fallbackLng: 'en',
        returnEmptyString: false,
        debug: false,
        keySeparator: '.',
        nsSeparator: false,
        lowerCaseLng: true,
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
        detection: {
          order: ['localStorage', 'navigator']
        }
      });
  }
}

