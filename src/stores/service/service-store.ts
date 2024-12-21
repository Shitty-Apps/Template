import { getEnv } from "../../helpers/mobx-easy-wrapper";
import AdMobStore from "./ad-mob/ad-mob-store";

class ServiceStore {
  bannerAdId: string = '';
  rewardingAdId: string = '';
  adMobStore: AdMobStore;

  constructor() {
    const { envConfig } = getEnv();

    this.bannerAdId = envConfig.bannerAdId;
    this.rewardingAdId = envConfig.rewardingAdId;
    this.adMobStore = new AdMobStore();
  }
}

export default ServiceStore;
