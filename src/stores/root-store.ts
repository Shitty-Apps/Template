import ServiceStore from "./service/service-store";

class RootStore {
  serviceStore: ServiceStore = {} as ServiceStore;

  init() {
    this.serviceStore = new ServiceStore();
  }
}

export default RootStore;
