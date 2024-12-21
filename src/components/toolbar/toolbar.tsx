import { FunctionComponent } from 'react';
import { languageOutline } from 'ionicons/icons';
import { IonButton, IonButtons, IonIcon, IonSelect, IonSelectOption, IonText, IonToolbar } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../helpers/use-store';
import { AdmobConsentStatus, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { includes } from 'lodash';
import { LANGUAGES } from '../../stores/data/translation/types';

const Toolbar: FunctionComponent = () => {
  const {
    dataStore: { translationStore },
    serviceStore: { adMobStore, bannerAdId }
  } = useStore();
  const { t } = useTranslation();

  const showBannerAd = async () => {
    await adMobStore.showBannerAd({
      adId: bannerAdId,
      isTesting: false,
      position: BannerAdPosition.BOTTOM_CENTER,
      adSize: BannerAdSize.ADAPTIVE_BANNER
    });
  };

  const removeBannerAd = async () => {
    await adMobStore.removeBannerAd();
  };

  const handleLanguageChange = (event: CustomEvent) => {
    const newLanguage = event.detail.value;
    translationStore.updateLanguage(newLanguage);
    showBannerAd();
  };


  const shouldShowConsentButton = includes([AdmobConsentStatus.REQUIRED, AdmobConsentStatus.OBTAINED], adMobStore.adMobState.consentStatus);

  return (
    <IonToolbar>
      <IonButtons slot='start'>
        <IonButton shape='round'>
          <IonIcon icon={languageOutline} />
          <IonSelect
            value={translationStore.currentLanguage}
            onIonChange={handleLanguageChange}
            interface='popover'
            className='max-w-xs'
            onClick={removeBannerAd}
            onIonCancel={showBannerAd}
            onIonDismiss={showBannerAd}
            placeholder='Select Language'
            defaultValue={localStorage.getItem('preferred-language') ?? LANGUAGES.en}
          >
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <IonSelectOption key={code} value={code}>{name}</IonSelectOption>
            ))}
          </IonSelect>
        </IonButton>
      </IonButtons>
      {shouldShowConsentButton && (
        <IonButtons slot='end'>
          <IonButton>
            <IonText className='consent-button' color='primary'>
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => adMobStore.showConsentForm()}>
                {t('ad-preferences')}
              </span>
            </IonText>
          </IonButton>
        </IonButtons>
      )}
    </IonToolbar>
  );
};

export default observer(Toolbar);
