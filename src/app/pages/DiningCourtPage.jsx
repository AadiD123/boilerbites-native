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

import { Button } from "@mui/material";

import React, { useEffect, useState } from "react";
import "./DiningCourtPage.css";

// Components
import FoodCourtCard from "../components/FoodCourtCard";
import DishItem from "../components/DishItem";
import Datepicker from "../components/DatePicker";
import FoodCourtBar from "../components/FoodCourtBar";

export default function DiningCourtPage(props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMeal, setCurrentMeal] = useState("");
  const [dishesByStation, setDishesByStation] = useState({});  

  useEffect(() => {
    const fetchCurrentFood = async () => {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1)
      const day = String(currentDate.getDate());

      const formattedDate = `${year}-${month}-${day}`;
     
      const response = await fetch(
        `http://localhost:4000/api/dishes/${props.diningCourt}/${formattedDate}`
      );
      if (response.ok) {
        const data = await response.json();
        
        for (meal in data["Meals"]) {
          if (meal["Status"] == "Open") {
            meals[meal["Name"]] = [meal["Hours"]["StartTime"], meal["Hours"]["EndTime"]]
          } else {
            meals[meal["Name"]] = ["Closed", "Closed"]
          } 
        }
      }
    };
  }, [currentMeal, selectedDate]);

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
            <FoodCourtCard diningCourt={props.foodCourtName} />
            <Datepicker onSelectDate={handleDateChange} />
            <IonRow>
              <IonCol size="4" offset="1">
                <Button
                  variant={meal === "Breakfast" ? "contained" : "outlined"}
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setMeal("Breakfast");
                  }}
                  style={{
                    backgroundColor: meal === "Breakfast" ? "#daaa00" : "",
                  }}
                >
                  Breakfast
                </Button>
              </IonCol>
              <IonCol size="3">
              {meals}
                <Button
                  variant={meal === "Lunch" ? "contained" : "outlined"}
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setMeal("Lunch");
                  }}
                  style={{ backgroundColor: meal === "Lunch" ? "#daaa00" : "" }}
                >
                  Lunch
                </Button>
              </IonCol>
              <IonCol size="3">
                <Button
                  variant={meal === "Dinner" ? "contained" : "outlined"}
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setMeal("Dinner");
                  }}
                  style={{
                    backgroundColor: meal === "Dinner" ? "#daaa00" : "",
                  }}
                >
                  Dinner
                </Button>
              </IonCol>
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
