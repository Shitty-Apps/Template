import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { globeOutline, locate } from 'ionicons/icons';
import { Country } from '../../data/types';
import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonModal, IonSearchbar} from '@ionic/react';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { CountryToFlagMap } from './helpers';

interface Props {
  onChange: (country: Country) => void;
  selectedCountry: Country | undefined;
  getDeviceCountry: () => Promise<void>
}

interface CountrySearchData {
  country: Country;
  translatedName: string;
  englishName: string;
}

const CountrySelect: FunctionComponent<Props> = ({ onChange, selectedCountry, getDeviceCountry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const { t, i18n } = useTranslation();

  // Create a memoized sorting function based on current language
  const getSortedCountries = useCallback((countries: Country[]) => {
    const collator = new Intl.Collator(i18n.language, {
      usage: 'sort',
      sensitivity: 'base',
      numeric: true
    });

    return [...countries].sort((a, b) => {
      const nameA = t(`countries.${a}`);
      const nameB = t(`countries.${b}`);
      return collator.compare(nameA, nameB);
    });
  }, [t, i18n.language]);

  // Initialize sorted countries
  useEffect(() => {
    setFilteredCountries(getSortedCountries(Object.values(Country)));
  }, [getSortedCountries]);

  const getSearchableCountries = useCallback((): CountrySearchData[] => {
    return Object.values(Country).map(country => ({
      country,
      translatedName: t(`countries.${country}`).toLowerCase(),
      englishName: country.toLowerCase()
    }));
  }, [t]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (!query.trim()) {
        setFilteredCountries(getSortedCountries(Object.values(Country)));
        return;
      }

      const searchableCountries = getSearchableCountries();
      const queryLower = query.trim().toLowerCase();

      const filtered = searchableCountries
        .filter(({ translatedName, englishName }) =>
          translatedName.includes(queryLower) || englishName.includes(queryLower)
        )
        .map(({ country }) => country);

      setFilteredCountries(getSortedCountries(filtered));
    }, 200),
    [getSearchableCountries, getSortedCountries]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (e: CustomEvent) => {
    const query = e.detail.value!;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleCountrySelect = (country: Country) => {
    onChange(country);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleFetchCountry = async () => {
    await getDeviceCountry();
    setIsOpen(false);
    setSearchQuery('');
  };

  const renderCountryItem = (country: Country) => {
    const translatedName = t(`countries.${country}`);
    const showEnglishName = i18n.language !== 'en' && translatedName !== country;

    return (
      <IonItem className='country-list-item' key={country} button onClick={() => handleCountrySelect(country)}>
        {CountryToFlagMap(country)}
        <IonLabel className='label'>
          <div>{translatedName}</div>
          {showEnglishName && (
            <div className="text-sm text-gray-500">{country}</div>
          )}
        </IonLabel>
      </IonItem>
    );
  };

  return (
    <>
      <IonLabel>{t('title')}</IonLabel>
      <IonItem id='country-select-button' className='select-button' button onClick={() => setIsOpen(true)}>
        {selectedCountry && (
          <IonLabel className='button-label'>
            <div className='flag-and-country'>
              {CountryToFlagMap(selectedCountry)}
              {t(`countries.${selectedCountry}`)}
            </div>
            <IonIcon icon={globeOutline}/>
          </IonLabel>
        )}
        {!selectedCountry && <IonLabel className='button-label'>{t('fields.select-country')} <IonIcon icon={globeOutline}/></IonLabel>}
      </IonItem>

      <IonModal isOpen={isOpen} onDidDismiss={() => {
        setIsOpen(false);
        setSearchQuery('');
      }}>
        <IonContent>
          <IonSearchbar
            value={searchQuery}
            onIonInput={handleSearchChange}
            placeholder={t('fields.search-placeholder')}
            debounce={0}
            className={i18n.language === 'ar' || i18n.language === 'he' ? 'rtl-searchbar' : ''}
          />
          <IonButton expand="block" onClick={handleFetchCountry}>
            {t('buttons.locate-auto')}
            <IonIcon icon={locate}/>
          </IonButton>
          <IonList>
            {filteredCountries.map(country => renderCountryItem(country))}
          </IonList>
          <IonButton expand="block" onClick={() => {
            setIsOpen(false);
            setSearchQuery('');
          }}>
            {t('buttons.cancel')}
          </IonButton>
        </IonContent>
      </IonModal>
    </>
  );
};

export default CountrySelect;
