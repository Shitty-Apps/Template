import DataStore from "./data/data-store";
import ServiceStore from "./service/service-store";
import UiStore from "./uiStore/ui-store";

interface RootStore {
  uiStore: UiStore;
  dataStore: DataStore;
  serviceStore: ServiceStore;
}

class RootStore {
  uiStore: UiStore = {} as UiStore;
  dataStore: DataStore = {} as DataStore;
  serviceStore: ServiceStore = {} as ServiceStore;

  init() {
    this.uiStore = new UiStore();
    this.dataStore = new DataStore();
    this.serviceStore = new ServiceStore();
  }
}

export default RootStore;
