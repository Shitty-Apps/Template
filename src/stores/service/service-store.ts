import AdMobStore from "./ad-mob/ad-mob-store";

class ServiceStore {
  adMobStore: AdMobStore;

  constructor() {
    this.adMobStore = new AdMobStore();
  }
}

export default ServiceStore;
