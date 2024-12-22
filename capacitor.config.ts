import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sappsinteractive.appname',
  appName: '@AppName@', // TODO: edit name
  webDir: 'dist',
  plugins: {
    Assets: {
      iconBackgroundColor: '@transparent',                    // For basic icons
      androidAdaptiveIconBackgroundColor: '@transparent',     // For Android adaptive icons background
      androidAdaptiveIconForegroundColor: '@transparent',     // For Android adaptive icons foreground
      splashBackgroundColor: '#FFFFFF',                       // Keep splash screen background if needed
    },
    AdMob: {
      appId: "ca-app-pub-1275679285318015~9751469803",
      requestTrackingAuthorization: true
    }
  },
};

export default config;
