import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonThumbnail,
  IonContent,
  IonCardSubtitle,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import "./DiningCourtPage.css";

// Components
import FoodCourtCard from "../components/FoodCourtCard";
import Datepicker from "../components/DatePicker";
import FoodCourtBar from "../components/FoodCourtBar";

export default function DiningCourtPage(props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState("");
  const [mealDict, setMealDict] = useState({});
  const [dishesByStation, setDishesByStation] = useState({});

  useEffect(() => {
    const fetchCurrentMeal = async () => {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1);
      const day = String(selectedDate.getDate());

      const formattedDate = `${year}-${month}-${day}`;
      console.log(formattedDate, props.foodCourtName);

      const response = await fetch(
        `http://localhost:4000/api/dishes/${props.foodCourtName}/${formattedDate}`
      );
      if (response.ok) {
        const data = await response.json();
        const mealData = {};
        const dishesData = {}; // Initialize dishesData

        for (const meal of data["Meals"]) {
          if (meal["Status"] == "Open") {
            mealData[meal["Name"]] = [
              meal["Hours"]["StartTime"],
              meal["Hours"]["EndTime"],
            ];

            if (selectedMeal === "") {
              setSelectedMeal(Object.keys(mealData)[0]);
            }

            // Populate dishesData based on the current meal
            if (meal["Name"] === selectedMeal) {
              for (const station of meal["Stations"]) {
                dishesData[station["Name"]] = station["Items"];
              }
            }
          } else {
            mealData[meal["Name"]] = ["Closed", "Closed"];
          }
        }

        setMealDict(mealData);
        setDishesByStation(dishesData); // Set the dishes based on the current meal
        console.log(mealDict);
      } else {
        console.log("Error fetching data");
      }
    };

    fetchCurrentMeal();
  }, [selectedDate, selectedMeal]);

  const handleDateChange = (selectedDate) => {
    setSelectedDate(selectedDate); // Update the date state
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonGrid>
            {mealDict[selectedMeal] != null ? (
              <FoodCourtCard
                diningCourt={props.foodCourtName}
                openTime={mealDict[selectedMeal][0]}
                closeTime={mealDict[selectedMeal][1]}
              />
            ) : (
              <FoodCourtCard diningCourt={props.foodCourtName} />
            )}

            <Datepicker onSelectDate={handleDateChange} />
            <IonRow>
              <FormControl fullWidth>
                <InputLabel>Select a Meal</InputLabel>
                <Select
                  value={selectedMeal}
                  label="Select a Meal"
                  onChange={(event) => {
                    setSelectedMeal(event.target.value);
                  }}
                >
                  {Object.keys(mealDict).map((mealName) => (
                    <MenuItem key={mealName} value={mealName}>
                      {mealName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </IonRow>
          </IonGrid>
        </IonItem>

        {Object.keys(dishesByStation).length > 0 ? (
          Object.keys(dishesByStation)
            .sort((stationA, stationB) => {
              return (
                dishesByStation[stationB].length -
                dishesByStation[stationA].length
              );
            })
            .map((station) => (
              <FoodCourtBar
                key={station}
                bar={station}
                dishData={dishesByStation[station]}
              />
            ))
        ) : (
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>No meals served</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
}
