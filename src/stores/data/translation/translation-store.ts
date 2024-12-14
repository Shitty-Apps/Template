import { getEnv } from './helpers/mobx-easy-wrapper';
import { chain, find, map } from 'lodash';
import { frontendResources } from 'locales';
import { Resource } from 'i18next';

export default class TranslationStore {
  async init() {
    const { translationService } = getEnv();

    let language: string = 'en';
    const { success: frontendResourcesSuccess, resources } = this._getFrontendResource();
    
    try {
      await translationService.init(resources, language);
    } catch (e: any) {
      console.error(`Could not init react i18next translation service. Error: ${e}`, {}, e);
    }
  }

  updateLanguage = (language: string) => {
    const { translationService } = getEnv();

    translationService.updateLanguage(language);
  };

  private _getFrontendResource(): { success: boolean; resources: Resource | undefined } {
    try {
      const resourcesArray = map(frontendResources, (resource, languageKey) => {
        return { languageKey, translation: resource.translation, fromDb: {} };
      });

      const resources = chain(resourcesArray)
        .keyBy('languageKey')
        .mapValues((item) => ({ translation: item.translation, fromDb: item.fromDb }))
        .value();

      return { success: true, resources };
    } catch (e: any) {
      Logger.error(`Could not get Frontend translations, falling back to empty translations. Error: ${e}`, {}, e);
      return { success: false, resources: undefined };
    }
  }
}
