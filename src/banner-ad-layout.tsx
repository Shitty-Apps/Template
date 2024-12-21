import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { useStore } from './helpers/use-store';
import { observer } from 'mobx-react-lite';
import { BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { useEffectOnce } from './hooks/use-effect-once';

interface Props {
  bannerAdContainerId: string;
  children: ReactNode;
};

const SHOW_BANNER_AD_DELAY = 3000;

const BannerAdLayout: FunctionComponent<Props> = ({ bannerAdContainerId, children }) => {
  const [bannerHeight, setBannerHeight] = useState<number>(0);
  const {
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
    const tryInitAds = async () => {
      try {
        // First initialize AdMob
        await adMobStore.initializeAdMobOnce();

        if (!adMobStore.adMobState.isInitialized) {
          console.error('AdMob failed to initialize, cannot show ads');
          return;
        }

        // Show the banner with production ID after a small delay
        setTimeout(showBannerAd, SHOW_BANNER_AD_DELAY);
      } catch (error) {
        console.error('Error initializing ads:', error);
      }
    };

    tryInitAds();

    return () => {
      adMobStore.removeBannerAd();
    };
  });

  useEffect(() => {
    console.log(`Banner size changed. Width: ${adMobStore.bannerSize.width}, Height: ${adMobStore.bannerSize.height}`);
    setBannerHeight(adMobStore.bannerSize.height);
  }, [adMobStore.bannerSize]);


  return (
    <>
      {children}
      <div
        id={bannerAdContainerId}
        className='banner-ad-container'
        style={{ height: `${bannerHeight}px` }}
      />
    </>
  );
};

export default observer(BannerAdLayout);
