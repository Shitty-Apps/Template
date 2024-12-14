import { 
  AdMob, 
  AdMobBannerSize, 
  AdmobConsentDebugGeography, 
  AdmobConsentStatus, 
  AdMobError, 
  BannerAdOptions, 
  BannerAdPluginEvents 
} from "@capacitor-community/admob";
import { PluginListenerHandle } from "@capacitor/core";
import { action, makeObservable, observable } from "mobx";

export interface ConsentConfig {
  debugGeography?: AdmobConsentDebugGeography;
  testDeviceIdentifiers?: string[];
  tagForUnderAgeOfConsent?: boolean;
}

export interface AdMobState {
  isInitialized: boolean;
  hasConsent: boolean;
  isRewardedVideoLoading: boolean;
  consentStatus?: AdmobConsentStatus;
}

export default class AdMobStore {
  @observable
  AdMobState: AdMobState = {
    isInitialized: false,
    hasConsent: false,
    isRewardedVideoLoading: false,
    consentStatus: undefined
  };

  @observable
  bannerSize: AdMobBannerSize = {
    width: 320,
    height: 60
  };

  @observable
  initializationAttempts: number;
  
  constructor() {
    makeObservable(this);
    this.initializationAttempts = 0;
  }

  @action
  private _setAdMobState(updates: Partial<AdMobState>) {
    this.AdMobState = { ...this.AdMobState, ...updates };
  }

  @action
  private _setBannerSize(size: AdMobBannerSize) {
    this.bannerSize = size;
  }

  async checkAndRequestConsent(config?: ConsentConfig): Promise<void> {
    if (!this.AdMobState.isInitialized) return;

    try {
      const consentInfo = await AdMob.requestConsentInfo({
        debugGeography: config?.debugGeography,
        testDeviceIdentifiers: config?.testDeviceIdentifiers,
        tagForUnderAgeOfConsent: config?.tagForUnderAgeOfConsent
      });

      console.log('Consent info:', JSON.stringify(consentInfo));
      this._setAdMobState({ consentStatus: consentInfo.status });

      if (consentInfo.isConsentFormAvailable && consentInfo.status === AdmobConsentStatus.REQUIRED) {
        const result = await AdMob.showConsentForm();
        this._setAdMobState({ 
          hasConsent: result.status === AdmobConsentStatus.OBTAINED 
        });
      }
    } catch (error) {
      console.error('Consent error:', error);
    }
  }

  async showBannerAd(options: BannerAdOptions): Promise<void> {
    try {

      if (!this.AdMobState.isInitialized) {
        await this.initializeAdMobOnce();
      }

      if (!this.AdMobState.isInitialized) return;
            
      const listeners: PluginListenerHandle[] = [];
      
      const loadedListener = await AdMob.addListener(
        BannerAdPluginEvents.Loaded, 
        () => {
          console.log('Banner ad loaded');
        }
      );
      listeners.push(loadedListener);

      const sizeListener = await AdMob.addListener(
        BannerAdPluginEvents.SizeChanged, 
        (size: AdMobBannerSize) => {
          console.log('Banner size changed:', size);
          this._setBannerSize(size);
        }
      );
      listeners.push(sizeListener);

      const errorListener = await AdMob.addListener(
        BannerAdPluginEvents.FailedToLoad, 
        (error: AdMobError) => {
          console.error('Failed to load banner ad:', error);
        }
      );
      listeners.push(errorListener);

      await AdMob.showBanner(options);
    } catch (error) {
      console.error('Error showing banner ad:', error);
    }
  }

  private async _adMobInitialize(): Promise<void> {
    try {
      await AdMob.initialize({
        initializeForTesting: false,
      });

      await this.checkAndRequestConsent();

      const trackingInfo = await AdMob.trackingAuthorizationStatus();
      console.log('Tracking authorization:', trackingInfo);

      if (trackingInfo.status === 'notDetermined') {
        console.log('Requesting tracking authorization...');
        await AdMob.requestTrackingAuthorization();
      }

      const authorizationStatus = await AdMob.trackingAuthorizationStatus();
      console.log('Final tracking authorization:', authorizationStatus);
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Error initializing AdMob:', error);
    }
  }

  async removeBannerAd(): Promise<void> {
    if (!this.AdMobState.isInitialized) return;

    try {
      await AdMob.removeBanner();
    } catch (error) {
      console.error('Error removing banner ad:', error);
    }
  }

  async initializeAdMobOnce(): Promise<void> {
    if (!this.AdMobState.isInitialized) {
      try {
        await this._adMobInitialize();
        this._setAdMobState({ isInitialized: true });
      } catch (error) {
        console.log('Error initializing AdMob:', error);
        this.initializationAttempts++;
        if (this.initializationAttempts < 3) {
          console.log('Retrying initialization...');
          await this.initializeAdMobOnce();
        }
      }
    }
  }

  async showConsentForm(): Promise<void> {
    if (!this.AdMobState.isInitialized) return;

    try {
      const result = await AdMob.showConsentForm();
      this._setAdMobState({ 
        hasConsent: result.status === AdmobConsentStatus.OBTAINED 
      });
    } catch (error) {
      console.error('Error showing consent form:', error);
    }
  }
}
