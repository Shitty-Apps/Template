import { IonCard, IonCardContent, IonContent, IonItem, IonLabel, IonPage } from '@ionic/react';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import Toolbar from '../../components/toolbar/toolbar';

const SamplePage: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonContent fullscreen>
        <Toolbar />
        
      </IonContent>
    </IonPage>
  );
};

export default observer(SamplePage);
