import { Redirect, Route } from "react-router-dom";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonApp,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home.jsx";
import Retail from "./pages/Retail.jsx";
import Tracker from "./pages/Tracker.jsx";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import DiningCourtPage from "./pages/DiningCourtPage.jsx";
import { Drivers, Storage } from "@ionic/storage";

setupIonicReact();

export const store = new Storage({
  name: "__mydb",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});
store.create();

const App = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/residential">
            <Home />
          </Route>
          <Route exact path="/retail">
            <Retail />
          </Route>
          <Route exact path="/">
            <Redirect to="/residential" />
          </Route>
          <Route exact path="/tracker">
            <Tracker />
          </Route>
          <Route
            path="/residential/:place/:restrictions?"
            component={DiningCourtPage}
          />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="residential" href="/residential">
            <IonLabel>Residential</IonLabel>
          </IonTabButton>
          <IonTabButton tab="retail" href="/retail">
            <IonLabel>Retail</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tracker" href="/tracker">
            <IonLabel>Tracker</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
