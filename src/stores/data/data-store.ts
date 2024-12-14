import TranslationStore from "./translation/translation-store";

class DataStore {
  translationStore: TranslationStore;
  
  constructor() {
    this.translationStore = new TranslationStore();
    
  }
}

export default DataStore;
