import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonText,
} from "@ionic/react";
import "./Home.css";
import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import FoodCourtCard from "../components/FoodCourtCard";

const Home = () => {
  const options = ["vegetarian", "vegan", "no beef", "no pork", "gluten-free"];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dishes, setDishes] = useState([]);

  const handleSelectionChange = (event) => {
    setSelectedOptions(event.target.value);
  };




  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Boiler Bites</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Boiler Bites</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="home-dropdown">
          <FormControl fullWidth>
            <InputLabel>Restrictions</InputLabel>
            <Select
              label="Restrictions"
              multiple
              value={selectedOptions} // Pass an array for multiple selections
              onChange={handleSelectionChange}
            >
              {options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Dining Courts</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem routerLink="/earhart">
                <IonThumbnail slot="start">
                  <img alt="Earhart" src="/assets/Earhart.png" />
                </IonThumbnail>
                <IonLabel>Earhart</IonLabel>
              </IonItem>

              <IonItem routerLink="/ford">
                <IonThumbnail slot="start">
                  <img alt="Ford" src="/assets/Ford.png" />
                </IonThumbnail>
                <IonLabel>Ford</IonLabel>
              </IonItem>

              <IonItem routerLink="/wiley">
                <IonThumbnail slot="start">
                  <img alt="Wiley" src="/assets/Wiley.png" />
                </IonThumbnail>
                <IonLabel>Wiley</IonLabel>
              </IonItem>

              <IonItem routerLink="/windsor">
                <IonThumbnail slot="start">
                  <img alt="Windsor" src="/assets/Windsor.png" />
                </IonThumbnail>
                <IonLabel>Windsor</IonLabel>
              </IonItem>

              <IonItem routerLink="/hillenbrand">
                <IonThumbnail slot="start">
                  <img alt="Hillenbrand" src="/assets/Hillenbrand.png" />
                </IonThumbnail>
                <IonLabel>Hillenbrand</IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Quick Bites</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem routerLink="/1bowl">
                <IonThumbnail slot="start">
                  <img alt="1Bowl" src="/assets/1Bowl.png" />
                </IonThumbnail>
                <IonLabel>1Bowl</IonLabel>
              </IonItem>

              <IonItem routerLink="/petesza">
                <IonThumbnail slot="start">
                  <img alt="Pete's Za" src="/assets/Pete's Za.png" />
                </IonThumbnail>
                <IonLabel>Pete's Za</IonLabel>
              </IonItem>

              <IonItem routerLink="/theburrow">
                <IonThumbnail slot="start">
                  <img alt="The Burrow" src="/assets/The Burrow.png" />
                </IonThumbnail>
                <IonLabel>The Burrow</IonLabel>
              </IonItem>

              <IonItem routerLink="/thegatheringplace">
                <IonThumbnail slot="start">
                  <img
                    alt="The Gathering Place"
                    src="/assets/The Gathering Place.png"
                  />
                </IonThumbnail>
                <IonLabel>The Gathering Place</IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
