import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonToast, isPlatform, setupIonicReact, useIonRouter } from '@ionic/react';
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
import './App.scss';

import { useEffect, useState } from 'react';
import { BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { useTranslation } from 'react-i18next';
import { useStore } from './helpers/use-store';
import { observer } from 'mobx-react-lite';
import { checkIfCanRequestReview, requestReview } from './helpers/app-review';
import { useEffectOnce } from './hooks/use-effect-once';
import { includes } from 'lodash';
import { RTL_LANGUAGES } from './stores/data/translation/types';
import SamplePage from './pages/sample-page/sample-page';
import BanneredLayout from './banner-ad-layout';

setupIonicReact();

const BANNER_AD_CONTAINER_ID = 'banner-ad-container-id';

const App: React.FC = () => {
  const [bannerHeight, setBannerHeight] = useState<number>(0);
  const [lastBackPress, setLastBackPress] = useState<number>(0);
  const [showExitToast, setShowExitToast] = useState(false);
  const [showReviewToast, setShowReviewToast] = useState(false);
  const ionRouter = useIonRouter();
  const { t } = useTranslation();
  const {
    dataStore: { translationStore },
    serviceStore: { adMobStore, bannerAdId }
  } = useStore();

  const showBannerAd = async () => {
    await adMobStore.showBannerAd({
      adId: bannerAdId,
      isTesting: false,
      position: BannerAdPosition.BOTTOM_CENTER,
      adSize: BannerAdSize.ADAPTIVE_BANNER
    });
  };

  useEffectOnce(() => {
    translationStore.init();
  });

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

  useEffectOnce(() => {
    const shouldPromptForReview = checkIfCanRequestReview();
    if (!shouldPromptForReview) return;

    setShowReviewToast(true);
  });

  useEffect(() => {
    const dir = includes(RTL_LANGUAGES, translationStore.currentLanguage) ? 'rtl' : 'ltr';
    document.dir = dir;
  }, [translationStore.currentLanguage]);


  return (
    <IonApp>
      <IonReactRouter>
        <BanneredLayout bannerAdContainerId={BANNER_AD_CONTAINER_ID}>
          <IonRouterOutlet>
            <Route exact path="/tab1">
              <SamplePage />
            </Route>
            <Route exact path="/">
              <Redirect to="/tab1" />
            </Route>
          </IonRouterOutlet>
        </BanneredLayout>
      </IonReactRouter>

      <IonToast
        isOpen={showExitToast}
        onDidDismiss={() => setShowExitToast(false)}
        message={t('press-again-to-exit')}
        duration={1500}
        position='bottom'
        positionAnchor={BANNER_AD_CONTAINER_ID}
      />
      <IonToast
        isOpen={showReviewToast}
        onDidDismiss={() => setShowReviewToast(false)}
        message={t('would-you-like-to-review')}
        duration={15000}
        position='bottom'
        positionAnchor={BANNER_AD_CONTAINER_ID}
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
