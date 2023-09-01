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
  const [dishesByStation, setDishesByStation] = useState({});
  const [meal, setMeal] = useState("");

  const isCurrentMeal = (meal, selectedDate) => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMeal =
      currentHour >= 7 && currentHour < 10
        ? "Breakfast"
        : (currentHour >= 11 && currentHour) < 13
        ? "Lunch"
        : "Dinner";

    const isSameDate =
      selectedDate.getDate() === currentDate.getDate() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear();

    return isSameDate && meal === currentMeal;
  };

  useEffect(() => {
    const currentHour = selectedDate.getHours();
    if (currentHour >= 21) {
      setSelectedDate(
        new Date(selectedDate.setDate(selectedDate.getDate() + 1))
      );
    }
    if (currentHour < 10) {
      setMeal("Breakfast");
    } else if (currentHour < 13) {
      setMeal("Lunch");
    } else if (currentHour < 20) {
      setMeal("Dinner");
    }
  }, []);

  useEffect(() => {
    if (meal !== "") {
      const fetchCurrentFood = async () => {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/timings/${selectedDate.getFullYear()}/${
            selectedDate.getMonth() + 1
          }/${selectedDate.getDate()}/${props.foodCourtName}/${meal}`
        );

        if (response.ok) {
          const json = await response.json();

          if (json.length === 0) {
            // setDishes([]);
            setDishesByStation({});
          } else {
            // const newDishes = json["0"].display;

            // setDishes(newDishes);
            const groupedDishes = {};

            json["0"].display.forEach((dish) => {
              const { station } = dish;
              if (!groupedDishes[station]) {
                groupedDishes[station] = [];
              }
              groupedDishes[station].push(dish);
            });

            for (const station in groupedDishes) {
              groupedDishes[station].sort(
                (a, b) => b.averagerating - a.averagerating
              );
            }

            setDishesByStation(groupedDishes);
          }
        } else {
          console.log(
            "Error fetching dishes for dining court",
            props.diningCourt
          );
        }
      };
      fetchCurrentFood();
    }
  }, [meal, selectedDate]);

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
