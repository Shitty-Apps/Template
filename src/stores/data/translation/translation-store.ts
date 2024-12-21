import { chain, map } from 'lodash';
import { getEnv } from '../../../helpers/mobx-easy-wrapper';
import { Resource } from 'i18next';
import { frontendResources } from '../../../locales';
import { action, observable } from 'mobx';
import { DEFAULT_LANGUAGE } from './types';

export default class TranslationStore {
  @observable
  currentLanguage: string = '';

  @action
  async init() {
    const { translationService } = getEnv();

    let resources: Resource;
    const { success: frontendResourcesSuccess, resources: frontendResources } = this._getFrontendResource();
    if (frontendResourcesSuccess && !!frontendResources) {
      resources = frontendResources;
    } else {
      console.error(`Could not init react i18next translation service with FE resources, init with empty resource`);
      resources = {};
    }

    const preferredLanguage = localStorage.getItem('preferred-language');
    const language: string = !!preferredLanguage ? preferredLanguage : DEFAULT_LANGUAGE;

    try {
      await translationService.init(resources, language);
      this.currentLanguage = language;
    } catch (e: any) {
      console.error(`Could not init react i18next translation service. Error: ${e}`, {}, e);
    }
  }

  @action
  updateLanguage = (language: string) => {
    const { translationService } = getEnv();

    translationService.updateLanguage(language);
    this.currentLanguage = language;
    localStorage.setItem('preferred-language', language);
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
      console.error(`Could not get Frontend translations, falling back to empty translations. Error: ${e}`, {}, e);
      return { success: false, resources: undefined };
    }
  }
}
