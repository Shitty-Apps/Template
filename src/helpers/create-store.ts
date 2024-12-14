import { wrapRoot } from "mobx-easy";
import RootStore from "../stores/root-store";
import { AdMobService } from "../services/google/ad-mob-service";
import TranslationService from "../services/translation-service";

export interface Environment {
  isLocal: boolean;
  apiUrl: string;
}

export interface RootEnvironment {
  envConfig: Environment;
  adMobService: AdMobService;
  translationService: TranslationService;
}

export interface CreateStoreResult {
  rootStore: RootStore;
  env: RootEnvironment;
}

export interface CreateStoreOptions {
  envConfig: Environment;
}

const createStore = ({ envConfig }: CreateStoreOptions): CreateStoreResult => {
  const adMobService = new AdMobService();
  const translationService = new TranslationService(); 

  const env: RootEnvironment = {
    envConfig,
    adMobService,
    translationService,
  };

  const rootStore = wrapRoot({ RootStore: RootStore, env});

  return {
    rootStore,
    env
  };
};

export default createStore;
