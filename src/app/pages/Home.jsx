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
import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import FoodCourtCard from "../components/FoodCourtCard";
import LocationRating from "../components/LocationRating";
import LocationItem from "../components/LocationItem";

const Home = () => {
  const locations = ["Earhart", "Ford", "Wiley", "Windsor", "Hillenbrand"];
  const quickBites = [
    "1Bowl",
    "Pete's Za",
    "The Burrow",
    "The Gathering Place",
  ];
  const options = [
    "vegetarian",
    "vegan",
    "no beef",
    "no pork",
    "gluten-free",
    "nuts",
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);

  // experimental code below

  const [selectedMeal, setSelectedMeal] = useState("");
  const [mealDict, setMealDict] = useState({});
  const [dishesByStation, setDishesByStation] = useState({});

  useEffect(() => {
    console.log(selectedOptions);
  }, [selectedOptions]);

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
              {locations.map((location, index) => (
                <LocationItem key={index} location={location} />
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Quick Bites</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {quickBites.map((location, index) => (
                <LocationItem key={index} location={location} />
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
