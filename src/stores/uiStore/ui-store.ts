import { makeObservable } from "mobx";

class UiStore {
  constructor() {
    makeObservable(this);
  }
}

export default UiStore;
