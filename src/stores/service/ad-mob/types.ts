import { AdmobConsentDebugGeography, AdmobConsentStatus } from '@capacitor-community/admob';

interface ConsentConfig {
  debugGeography?: AdmobConsentDebugGeography;
  testDeviceIdentifiers?: string[];
  tagForUnderAgeOfConsent?: boolean;
};

interface AdMobState {
  isInitialized: boolean;
  hasConsent: boolean;
  isRewardedVideoLoading: boolean;
  consentStatus?: AdmobConsentStatus;
};

export { ConsentConfig, AdMobState };
