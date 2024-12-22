import { AdMob, AdMobBannerSize, AdmobConsentStatus, AdMobError, BannerAdOptions, BannerAdPluginEvents, RewardAdOptions, RewardAdPluginEvents } from '@capacitor-community/admob';
import { PluginListenerHandle } from '@capacitor/core';
import { action, makeObservable, observable } from 'mobx';
import { AdMobState, ConsentConfig } from './types';

const MAX_INITIALIZATION_ATTEMPS = 3;

export default class AdMobStore {
  @observable
  adMobState: AdMobState = {
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
  listeners: PluginListenerHandle[] = [];

  constructor() {
    makeObservable(this);
  }

  async initializeAdMobOnce(): Promise<void> {
    if (this.adMobState.isInitialized) return;

    let initializationAttempt = 0;
    let didInitialized = false;

    while (initializationAttempt < MAX_INITIALIZATION_ATTEMPS && !didInitialized) {
      console.log(`AdMob initialization attempt: ${initializationAttempt}`);

      try {
        await this._adMobInitialize();
        this._setAdMobState({ isInitialized: true });
        didInitialized = true;
      } catch (error) {
        console.log('Error initializing AdMob:', error);
      }

      initializationAttempt++;
    }
  }

  async checkAndRequestConsent(config?: ConsentConfig): Promise<void> {
    if (!this.adMobState.isInitialized) return;

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
      if (!this.adMobState.isInitialized) {
        await this.initializeAdMobOnce();
      }

      if (!this.adMobState.isInitialized) return;

      const loadedListener = await AdMob.addListener(
        BannerAdPluginEvents.Loaded,
        () => {
          console.log('Banner ad loaded');
        }
      );

      const sizeListener = await AdMob.addListener(
        BannerAdPluginEvents.SizeChanged,
        (size: AdMobBannerSize) => {
          console.log('Banner size changed:', size);
          this._setBannerSize(size);
        }
      );

      const errorListener = await AdMob.addListener(
        BannerAdPluginEvents.FailedToLoad,
        (error: AdMobError) => {
          console.error('Failed to load banner ad:', error);
        }
      );

      const adImpressionsListener = await AdMob.addListener(
        BannerAdPluginEvents.AdImpression,
        () => {
          console.error('Banner ad impression received');
        }
      );

      this.listeners.push(...[loadedListener, sizeListener, errorListener, adImpressionsListener]);

      await AdMob.showBanner(options);
    } catch (error) {
      console.error('Error showing banner ad:', error);
    }
  }

  async removeBannerAd(): Promise<void> {
    if (!this.adMobState.isInitialized) return;

    try {
      await AdMob.removeBanner();
    } catch (error) {
      console.error('Error removing banner ad:', error);
    }
  }

  async showConsentForm(): Promise<void> {
    if (!this.adMobState.isInitialized) return;

    try {
      const result = await AdMob.showConsentForm();
      this._setAdMobState({
        hasConsent: result.status === AdmobConsentStatus.OBTAINED
      });
    } catch (error) {
      console.error('Error showing consent form:', error);
    }
  }

  async prepareRewardedAd(options: RewardAdOptions) {
    this._setAdMobState({ isRewardedVideoLoading: true });

    try {
      await AdMob.prepareRewardVideoAd(options);

      const loadedListener = await AdMob.addListener(
        RewardAdPluginEvents.Loaded,
        () => {
          console.log('Rewarding ad loaded');
        }
      );

      const errorShowListener = await AdMob.addListener(
        RewardAdPluginEvents.FailedToShow,
        (error: AdMobError) => {
          console.error('Failed to show rewarding ad:', error);
        }
      );

      const errorLoadListener = await AdMob.addListener(
        RewardAdPluginEvents.FailedToLoad,
        (error: AdMobError) => {
          console.error('Failed to load rewarding ad:', error);
        }
      );

      const dismissedListener = await AdMob.addListener(
        RewardAdPluginEvents.Dismissed,
        () => {
          console.error('Dismissed rewarding ad');
        }
      );

      const showedListener = await AdMob.addListener(
        RewardAdPluginEvents.Showed,
        () => {
          console.error('Showed rewarding ad');
        }
      );

      const rewardedListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
        console.log('User earned reward:', reward);
      });

      this.listeners.push(...[loadedListener, errorShowListener, errorLoadListener, dismissedListener, showedListener, rewardedListener]);
    } catch (error) {
      console.error('Error preparing rewarded ad:', error);
    }

    this._setAdMobState({ isRewardedVideoLoading: false });
  };

  async showRewardingAd(options: RewardAdOptions): Promise<void> {
    try {
      if (!this.adMobState.isInitialized) {
        await this.initializeAdMobOnce();
      }

      if (!this.adMobState.isInitialized) return;

      await AdMob.showRewardVideoAd();
    } catch (error) {
      console.error('Error showing rewarding ad:', error);
      await this.prepareRewardedAd(options);
    }
  }

  @action
  private _setAdMobState(updates: Partial<AdMobState>) {
    this.adMobState = { ...this.adMobState, ...updates };
  }

  @action
  private _setBannerSize(size: AdMobBannerSize) {
    this.bannerSize = size;
  }

  private async _adMobInitialize() {
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
}
