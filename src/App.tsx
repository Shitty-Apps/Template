import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonToast,
  isPlatform,
  setupIonicReact,
  useIonRouter
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { App as CapacitorApp } from '@capacitor/app';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './App.scss';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { useEffect, useState } from 'react';
import { BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { useTranslation } from 'react-i18next';
import { useStore } from './helpers/use-store';
import { observer } from 'mobx-react-lite';
import CalcMain from './pages/calculator/calculator';
import './App.scss';
import { checkIfCanRequestReview, requestReview } from './helpers/app-review';

setupIonicReact();

const App: React.FC = () => {
  const [bannerHeight, setBannerHeight] = useState<number>(0);
  const [lastBackPress, setLastBackPress] = useState<number>(0);
  const [showExitToast, setShowExitToast] = useState(false);
  const [showReviewToast, setShowReviewToast] = useState(false);
  const ionRouter = useIonRouter();
  const { t } = useTranslation();
  const {
    dataStore: { translationStore },
    serviceStore: { adMobStore }
  } = useStore();

  const initTranslation = async () => {
    await translationStore.init();
  };

  const tryInitAds = async () => {
    try {
      // First initialize AdMob
      await adMobStore.initializeAdMobOnce();

      if (!adMobStore.AdMobState.isInitialized) {
        console.error('AdMob failed to initialize, cannot show ads');
        return;
      }

      // Show the banner with production ID after a small delay
      setTimeout(async () => {
        await adMobStore.showBannerAd({
          adId: 'ca-app-pub-1275679285318015/5010279015',
          isTesting: false,
          position: BannerAdPosition.BOTTOM_CENTER,
          adSize: BannerAdSize.ADAPTIVE_BANNER
        });
      }, 3000);
    } catch (error) {
      console.error('Error initializing ads:', error);
    }
  };

  useEffect(() => {
    initTranslation();
    tryInitAds();

    return () => {
      adMobStore.removeBannerAd();
    };
  }, []);

  const showBannerAd = async () => {
    // await adMobStore.showBannerAd({adId: 'ca-app-pub-3940256099942544/9214589741', isTesting: true, position: BannerAdPosition.BOTTOM_CENTER, adSize: BannerAdSize.ADAPTIVE_BANNER}); // Test ad
    await adMobStore.showBannerAd({ adId: 'ca-app-pub-1275679285318015/5010279015', isTesting: false, position: BannerAdPosition.BOTTOM_CENTER, adSize: BannerAdSize.ADAPTIVE_BANNER }); // production ad
  }

  const removeBannerAd = async () => {
    await adMobStore.removeBannerAd();
  }


  useEffect(() => {
    console.log('Banner size changed:', 'width:', adMobStore.bannerSize.width, 'height:', adMobStore.bannerSize.height);
    setBannerHeight(adMobStore.bannerSize.height);
  }, [adMobStore.bannerSize]);

  useEffect(() => {
    const handleBackButton = () => {
      setShowExitToast(true);

      if (!isPlatform('hybrid')) {
        console.log('Not on mobile platform');
        return;
      }

      const currentTime = new Date().getTime();

      if (currentTime - lastBackPress < 2000) {
        console.log('Double press detected - exiting app');
        CapacitorApp.exitApp();
      } else {
        console.log('First press detected');
        setLastBackPress(currentTime);
        setShowExitToast(true);
      }
    };

    document.addEventListener('ionBackButton', (ev: any) => {
      ev.detail.register(10, () => {
        if (ionRouter.canGoBack()) {
          ionRouter.goBack();
        } else {
          handleBackButton();
        }
      });
    });

    // Also listen for hardware back button
    CapacitorApp.addListener('backButton', () => {
      handleBackButton();
    });

    return () => {
      document.removeEventListener('ionBackButton', handleBackButton);
      CapacitorApp.removeAllListeners();
    };
  }, [lastBackPress, ionRouter]);

  useEffect(() => {
    const shouldPromptForReview = checkIfCanRequestReview();
    if (!shouldPromptForReview) return;

    setShowReviewToast(true);
  }, []);

  return (
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/tab1">
                <CalcMain bannerHeight={bannerHeight} showBannerAd={showBannerAd} removeBannerAd={removeBannerAd} />
              </Route>
              <Route exact path="/">
                <Redirect to="/tab1" />
              </Route>
            </IonRouterOutlet>
          </IonTabs>
        </IonReactRouter>
        <IonToast
          isOpen={showExitToast}
          onDidDismiss={() => setShowExitToast(false)}
          message={t('press-again-to-exit')}
          duration={1500}
          position="bottom"
          positionAnchor='ad-placeholder'
        />
        <IonToast
          isOpen={showReviewToast}
          onDidDismiss={() => setShowReviewToast(false)}
          message={t('would-you-like-to-review')}
          duration={15000}
          position="bottom"
          positionAnchor='ad-placeholder'
          className='review-toast'
          buttons={[
            {
              side: 'start',
              text: t('maybe-later'),
              role: 'cancel',
              handler: () => setShowReviewToast(false)
            },
            {
              text: t('lets-go'),
              role: 'confirm',
              handler: () => {
                requestReview();
                setShowReviewToast(false);
              }
            }
          ]}
        />
      </IonApp>
  );
};

export default observer(App);
