import { wrapRoot } from "mobx-easy";
import RootStore from "../stores/root-store";
import { AdMobService } from "../services/google/ad-mob-service";

export interface Environment {
  isLocal: boolean;
  apiUrl: string;
}

export interface RootEnvironment {
  adMobService: AdMobService;
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

  const env: RootEnvironment = {
    adMobService
  };

  const rootStore = wrapRoot({ RootStore: RootStore, env});

  return {
    rootStore,
    env
  };
};

export default createStore;
