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
    
  const [currentMeal, setCurrentMeal] = useState("");
  const [allDCMealData, setAllDCMealData] = useState({});
  const [dcTimings, setAllDCTimings] = useState({});
  const [dishesByStation, setDishesByStation] = useState({});

  useEffect(() => {
    const fetchCurrentMeal = async (location) => {

      // Get today's date and current meal time 

      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1);
      const day = String(new Date().getDate());
      const formattedDate = `${year}-${month}-${day}`;      

      let selectedOptionsQuery = selectedOptions.join(",");

      // sends dish_id, dish_name, avg rating, num of reviews
      const response = await fetch(
        `http://localhost:4000/api/dishes/${location}/${formattedDate}/?restrict=${selectedOptionsQuery}`
      );
      if (response.ok) {
        const data = await response.json();

        // get all the dishes for the dining court and store in temp data variable
        const mealData = {};     
        const timingData = {};
        const dishesData = {};

        // get current time
        const currentTime = new Date();
        const currentFormattedTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`;

        // loop through all the meals for the dining court for the day
        for (const meal of data["Meals"]) {
          if (meal["Status"] == "Open") {

            const mealStartTime = meal["Hours"]["StartTime"];
            const mealEndTime = meal["Hours"]["EndTime"];

            // Check if the current time is within the meal's start and end times
            if (currentFormattedTime >= mealStartTime && currentFormattedTime <= mealEndTime) {
              timingData[meal["Name"]] = [mealStartTime, mealEndTime];
              currentMeal = meal["Name"];
            }

            // Populate dishesData based on the current meal
            if (meal["Name"] === currentMeal) {
              for (const station of meal["Stations"]) {
                dishesData[station["Name"]] = station["Items"];
              }
            }
          } else {
            mealData[meal["Name"]] = ["Closed", "Closed"];
          }
        }

        setAllDCMealData(mealData);
        setDishesByStation(dishesData); // Set the dishes based on the current meal
        console.log(allDCMealData);
      } else {
        console.log("Error fetching data");
      }
    };

    for (const location of locations) {
      fetchCurrentMeal(location);
    }

    for (const location of quickBites) {
      fetchCurrentMeal(location);
    }
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
