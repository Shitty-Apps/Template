import { AdMob, AdMobBannerSize, AdmobConsentDebugGeography, AdmobConsentStatus, AdMobError, AdMobPlugin, BannerAdOptions, BannerAdPluginEvents, BannerAdPosition, BannerAdSize, RewardAdOptions, RewardAdPluginEvents } from "@capacitor-community/admob";
import { PluginListenerHandle } from "@capacitor/core";

export interface ConsentConfig {
  debugGeography?: AdmobConsentDebugGeography;
  testDeviceIdentifiers?: string[];
  tagForUnderAgeOfConsent?: boolean;
}

export class AdMobService {
  public AdMobState: { isInitialized: boolean; hasConsent: boolean; isRewardedVideoLoading: boolean; consentStatus?: AdmobConsentStatus };
  public bannerSize: AdMobBannerSize;

  constructor() {
    this.AdMobState = {
      isInitialized: false,
      hasConsent: false,
      isRewardedVideoLoading: false
    };
    this.bannerSize = {
      width: 320,
      height: 60
    }
  }

  public async checkAndRequestConsent(config?: ConsentConfig): Promise<void> {
    try {
      const consentInfo = await AdMob.requestConsentInfo({
        debugGeography: config?.debugGeography,
        testDeviceIdentifiers: config?.testDeviceIdentifiers,
        tagForUnderAgeOfConsent: config?.tagForUnderAgeOfConsent
      });

      this.AdMobState.consentStatus = consentInfo.status;

      if (consentInfo.isConsentFormAvailable &&
        consentInfo.status === AdmobConsentStatus.REQUIRED) {
        const result = await AdMob.showConsentForm();
        this.AdMobState.hasConsent = result.status === AdmobConsentStatus.OBTAINED;
      }
    } catch (error) {
      console.error('Consent error:', error);
    }
  }

  public async showBannerAd(options: BannerAdOptions): Promise<void> {
    try {
      // Remove any existing banner
      await AdMob.removeBanner();

      // Set up event listeners - make sure to await them
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
          this.bannerSize = size;
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

      // Show the banner
      await AdMob.showBanner(options);

      // // Cleanup the listeners when done
      // for (const listener of listeners) {
      //   listener.remove();
      // }

    } catch (error) {
      console.error('Error showing banner ad:', error);
    }
  }

  private async _adMobInitialize(): Promise<void> {
    try {
      // Initialize AdMob
      await AdMob.initialize({
        initializeForTesting: false,
        // testingDevices: ['DE2F4E15F59046B3EFDD5C8A463E0892'] // for test ads
      });

      await this.checkAndRequestConsent({
        debugGeography: AdmobConsentDebugGeography.EEA, // Simulates EU user
        testDeviceIdentifiers: ['DE2F4E15F59046B3EFDD5C8A463E0892']
      }); //for development testing

      // await this.checkAndRequestConsent();

      // Parallel requests for tracking and consent info
      const trackingInfo = await AdMob.trackingAuthorizationStatus();

      console.log('Tracking authorization:', trackingInfo);

      // Handle iOS tracking authorization
      if (trackingInfo.status === 'notDetermined') {
        console.log('Requesting tracking authorization...');
        await AdMob.requestTrackingAuthorization();
      }

      // Get final authorization status and handle consent
      const authorizationStatus = await AdMob.trackingAuthorizationStatus();
      console.log('Final tracking authorization:', authorizationStatus);

      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Error initializing AdMob:', error);
    }
  }

  public async removeBannerAd(): Promise<void> {
    try {
      await AdMob.removeBanner();
    } catch (error) {
      console.error('Error removing banner ad:', error);
    }
  }

  async initializeAdMobOnce() {
    try {
      await this._adMobInitialize();
      return { success: true };
    } catch (error) {
      console.log('Error initializing AdMob:', error);
      return { success: false };
    }
  }

  public async showConsentForm(): Promise<void> {
    try {
      const result = await AdMob.showConsentForm();
      this.AdMobState.hasConsent = result.status === AdmobConsentStatus.OBTAINED;
    } catch (error) {
      console.error('Error showing consent form:', error);
    }
  }
}
