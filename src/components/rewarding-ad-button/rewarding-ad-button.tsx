import { FunctionComponent } from 'react';
import { IonButton } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../helpers/use-store';
import { useEffectOnce } from '../../hooks/use-effect-once';

const RewardingAtButton: FunctionComponent = () => {
  const {
    serviceStore: { adMobStore, rewardingAdId }
  } = useStore();
  const { t } = useTranslation();

  useEffectOnce(() => {
    const init = async () => {
      await adMobStore.initializeAdMobOnce();

      await adMobStore.prepareRewardedAd({
        adId: rewardingAdId,
        isTesting: false,
      });
    }

    init();
  });

  const showRewardedAd = async () => {
    try {
      // Show the ad
      await adMobStore.showRewardingAd({
        adId: rewardingAdId,
        isTesting: false,
      });
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
    }
  };

  return (
    <IonButton
      expand='block'
      className='mx-4'
      onClick={showRewardedAd}
    >
      {t('watch-rewarding-ad')}
    </IonButton>
  );
};

export default observer(RewardingAtButton);
