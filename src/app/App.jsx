import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home.jsx";

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
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route path="/residential/:place" component={DiningCourtPage} />

        {/* <Route exact path="/earhart">
          <DiningCourtPage location="Earhart" />
        </Route>
        <Route exact path="/ford">
          <DiningCourtPage location="Ford" />
        </Route>
        <Route exact path="/hillenbrand">
          <DiningCourtPage location="Hillenbrand" />
        </Route>
        <Route exact path="/wiley">
          <DiningCourtPage location="Wiley" />
        </Route>
        <Route exact path="/windsor">
          <DiningCourtPage location="Windsor" />
        </Route>
        <Route exact path="/1bowl">
          <DiningCourtPage location="1Bowl" />
        </Route>
        <Route exact path="/Pete's Za">
          <DiningCourtPage location="Pete's Za" />
        </Route>
        <Route exact path="/The Burrow">
          <DiningCourtPage location="The Burrow" />
        </Route>
        <Route exact path="/The Gathering Place">
          <DiningCourtPage location="The Gathering Place" />
        </Route> */}
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
