import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { languageOutline } from 'ionicons/icons';
import { DATA } from '../data/data';
import { Country, CountryData } from '../data/types';
import CountrySelect from '../components/country-select/country-select';
import { FunctionComponent, useEffect, useState } from 'react';
import { LocationHelper } from '../heplers/location-helper';
import { useTranslation } from 'react-i18next';
import { AdmobConsentStatus } from '@capacitor-community/admob';
import { observer } from 'mobx-react-lite';
import { useStore } from '../heplers/use-store';
import { includes } from 'lodash';
import { JSX } from 'react/jsx-runtime';

const locationHelper = new LocationHelper();

interface Props {
  bannerHeight: number;
  removeBannerAd: () => void;
  showBannerAd: () => void;
}

const CalcMain: FunctionComponent<Props> = ({ bannerHeight, removeBannerAd, showBannerAd }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();
  const [selectedCountryData, setSelectedCountryData] = useState<CountryData | undefined>();
  const [bill, setBill] = useState<number>();
  const [tipPercentage, setTipPercentage] = useState<number>();
  const [splitBy, setSplitBy] = useState<number>();
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(true);
  const [toastInfo, setToastInfo] = useState({ message: '', color: '', show: false });

  const {
    serviceStore: { adMobStore }
  } = useStore();

  const { t, i18n } = useTranslation();

  const languages = {
    en: 'English',
    es: 'Español',
    ar: 'العربية',
    de: 'Deutsch',
    fr: 'Français',
    hi: 'हिन्दी',
    it: 'Italiano',
    ja: '日本語',
    ko: '한국어',
    pt: 'Português',
    ru: 'Русский',
    tr: 'Türkçe',
    zh: '中文',
    he: 'עברית'
  };

  const handleLanguageChange = (event: CustomEvent) => {
    const newLang = event.detail.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem('preferred-language', newLang);
    showBannerAd();
  };

  const onCountryChange = (country: Country) => {
    setSelectedCountry(country);
  }

  const getDeviceCountry = async () => {
    const {success, data} = await locationHelper.getCurrentLocation();

    if (success && data && data.address && data.address.country_code) {
      const countryData = DATA.find((country) => country.code === data.address.country_code.toUpperCase());
      setSelectedCountry(countryData?.name);
    } else {
      setToastInfo({ message: t('failed-to-get-location-enter-manually'), color: 'danger', show: true });
    }
  }

  const handleRoundUp = () => {
    const roundedTotal = Math.ceil(total);
    const difference = roundedTotal - total;
    setTotal(roundedTotal);
    setTipAmount(tipAmount + difference);
  };

  const handleRoundDown = () => {
    const roundedTotal = Math.floor(total);
    const difference = total - roundedTotal;
    setTotal(roundedTotal);
    setTipAmount(tipAmount - difference);
  };

    const renderTipButtons = () => {
      if (!selectedCountryData) return null;

      const range = selectedCountryData.tippingRange;
      if (!range) return null;

      // If min equals max, show a single preselected percentage
      if (range.min === range.max) {
        return (
          <IonChip 
            color="primary"
            className="m-1"
            onClick={() => setTipPercentage(range.min)}
          >
            {range.min}%
          </IonChip>
        );
      }

      // If there's a range, show buttons for each value
      const buttons: JSX.Element[] = [];
      const rangeValues = [range.min,range.max];

      rangeValues.forEach(rangeValue => {
        buttons.push(
          <IonChip
            key={rangeValue}
            color={tipPercentage === rangeValue ? 'primary' : 'medium'}
            className="m-1"
            onClick={() => setTipPercentage(rangeValue)}
          >
            {rangeValue}%
          </IonChip>
        );
      });
      
      return buttons;
  };

  useEffect(() => {
    const tip = ((bill ?? 0) * (tipPercentage ?? 0)) / 100;
    setTipAmount(tip);
    setTotal((bill ?? 0) + tip);
  }, [bill, tipPercentage]);

  useEffect(() => {
    if (selectedCountry) {
      const countryData = DATA.find((data) => data.name === selectedCountry);
      setSelectedCountryData(countryData);
    }
  }, [selectedCountry]);

  useEffect(() => {
    const dir = i18n.language === 'ar' || i18n.language === 'he' ? 'rtl' : 'ltr';
    document.dir = dir;
    setIsVisible(false);
    setTimeout(() => {
      setIsVisible(true);
    }, 0);
  }, [i18n.language]);

  const shouldShowConsentButton = includes([AdmobConsentStatus.REQUIRED, AdmobConsentStatus.OBTAINED], adMobStore.AdMobState.consentStatus);

  return (
    <IonPage>
      <IonContent fullscreen>    
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton shape="round">
              <IonIcon icon={languageOutline}/>
                <IonSelect
                  value={i18n.language}
                  onIonChange={handleLanguageChange}
                  interface="popover"
                  className="max-w-xs"
                  onClick={removeBannerAd}
                  onIonCancel={showBannerAd}
                  onIonDismiss={showBannerAd}
                  placeholder='Select Language'
                  defaultValue={localStorage.getItem('preferred-language') ?? languages.en}
                >
                  {Object.entries(languages).map(([code, name]) => (
                    <IonSelectOption key={code} value={code}>
                      {name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
            </IonButton>
          </IonButtons>
          {shouldShowConsentButton && (
            <IonButtons slot="end">
              <IonButton>
                <IonText className="consent-button" color="primary">
                  <span 
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => adMobStore.showConsentForm()}
                  >
                    {t('ad-preferences')}
                  </span>
                </IonText>
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
        <IonCard className="mb-4">
          <IonCardHeader>
            <CountrySelect selectedCountry={selectedCountry} onChange={onCountryChange} getDeviceCountry={getDeviceCountry} />
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              {isVisible && <IonLabel position="stacked">{t('fields.total-bill')}</IonLabel>}
              <IonInput
                type="number"
                value={bill}
                onIonInput={e => setBill(Number(e.detail.value))}
                placeholder={t('fields.total-bill-placeholder')}
                className="text-xl"
              />
            </IonItem>
            <IonItem>
              {isVisible && <IonLabel position="stacked">{t('fields.tip-percentage')}</IonLabel>}
              <IonInput
                type="number"
                min={0}
                max={100}
                maxlength={3}
                value={tipPercentage}
                onIonInput={e => setTipPercentage(Number(e.detail.value))}
                placeholder={t('fields.tip-percentage-placeholder')}
              />
            </IonItem>

            <div className="p-3">
            {selectedCountryData && <IonCardSubtitle className="mt-2">{t(`descriptions.${selectedCountryData?.descriptionTranslationKey}`)}</IonCardSubtitle>}
            {selectedCountryData?.tippingRange && (
              <>
                <IonText color="medium" className="text-sm">
                  {t('fields.suggested-tips')}
                </IonText>

                <div className="flex flex-wrap gap-2 mt-2">
                  {renderTipButtons()}
                </div>
              </>
            )}
            </div>

            <IonItem>
              {isVisible && <IonLabel position="stacked">{t('fields.split-by')}</IonLabel>}
              <IonInput
                type="number"
                min={1}
                max={100}
                value={splitBy}
                onIonInput={e => setSplitBy(Number(e.detail.value) || 1)}
                placeholder={t('fields.split-by-placeholder')}
              />
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard className="mb-4">
          <IonCardContent>
            {(splitBy && splitBy > 1) && <>
            <IonItem>
              <IonLabel>{t('fields.split-tip')}</IonLabel>
              <IonLabel slot="end" className="text-right">
                {(tipAmount / (splitBy ?? 1)).toFixed(2)}
              </IonLabel>
            </IonItem>

            <IonItem >
              <IonLabel>{t('fields.split-total')}</IonLabel>
              <IonLabel slot="end" className="text-right">
                {(total / (splitBy ?? 1)).toFixed(2)}
              </IonLabel>
            </IonItem>
            </>
            }
            <IonItem>
              <IonLabel>{t('fields.tip')}</IonLabel>
              <IonLabel slot="end" className="text-right">
                {tipAmount.toFixed(2)}
              </IonLabel>
            </IonItem>
            
            <IonItem lines="none">
              <IonLabel>{t('fields.total')}</IonLabel>
              <IonLabel slot="end" className="text-right font-bold">
                {total.toFixed(2)}
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton expand="block" onClick={handleRoundDown} color="medium">
                {t('buttons.round-down')}
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton expand="block" onClick={handleRoundUp} color="primary">
                {t('buttons.round-up')}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <div className="ad-placeholder" id='ad-placeholder' style={{height: `${bannerHeight}px`}}></div>
          <IonToast
            isOpen={toastInfo.show}
            onDidDismiss={() => setToastInfo({ message: '', color: '', show: false })}
            message={toastInfo.message}
            duration={1500}
            color={toastInfo.color}
            position="bottom"
            positionAnchor='country-select-button'
          />
      </IonContent>
    </IonPage>
  );
};

export default observer(CalcMain);
