import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, navigateCircle, glasses, personCircle, addCircle } from 'ionicons/icons';
import Dashboard from './pages/Dashboard';
import Map from './pages/Map';
import Report from './pages/Report';
import Sightings from './pages/Sightings';
import Profile from './pages/Profile';


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

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/dashboard" render={() => <Dashboard />} exact={true} />
          <Route path="/map" render={() => <Map />} exact={true} />
          <Route path="/report" render={() => <Report />} exact={true} />
          <Route path="/sightings" render={() => <Sightings />} exact={true} />
          <Route path="/profile" render={() => <Profile />} exact={true} />
          <Route exact path="/">
            <Redirect to="/dashboard" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">

          <IonTabButton tab="dashboard" href="/dashboard">
            <IonIcon aria-hidden="true" icon={home} />
            <IonLabel>Dashboard</IonLabel>
          </IonTabButton>

          <IonTabButton tab="map" href="/map">
            <IonIcon aria-hidden="true" icon={navigateCircle} />
            <IonLabel>Map</IonLabel>
          </IonTabButton>

          <IonTabButton tab="report" href="/report">
            <IonIcon aria-hidden="true" icon={addCircle} />
            <IonLabel>Report</IonLabel>
          </IonTabButton>

          <IonTabButton tab="sightings" href="/sightings">
            <IonIcon aria-hidden="true" icon={glasses} />
            <IonLabel>Sightings</IonLabel>
          </IonTabButton>

          <IonTabButton tab="profile" href="/profile">
            <IonIcon aria-hidden="true" icon={personCircle} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>

        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
