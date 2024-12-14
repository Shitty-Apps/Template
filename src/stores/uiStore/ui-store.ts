import { action, makeObservable, observable } from "mobx";

class UiStore {
  @observable
  shouldShowReviewButton: boolean = false;

  @observable
  shouldShowReviewModal: boolean = false;

  constructor() {
    makeObservable(this);
  }

  @action
  setShouldShowReviewButton(value: boolean) {
    this.shouldShowReviewButton = value;
  }

  @action
  setShouldShowReviewModal(value: boolean) {
    this.shouldShowReviewModal = value;
  }
}

export default UiStore;
