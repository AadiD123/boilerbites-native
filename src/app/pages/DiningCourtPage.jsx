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
  IonLoading,
} from "@ionic/react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DiningCourtPage.css";

import { store } from "../App";

// Components
import FoodCourtCard from "../components/FoodCourtCard";
import Datepicker from "../components/DatePicker";
import DishItem from "../components/DishItem";

export default function DiningCourtPage() {
  let { place, restrictions } = useParams();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(
    restrictions == undefined ? [] : restrictions
  );
  const [locationRating, setLocationRating] = useState(0);
  const [mealDict, setMealDict] = useState({});

  const [loading, setLoading] = useState(true);

  const [mealNamesAndTimings, setMealNamesAndTimings] = useState({});

  const formattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const getCurrentTime = () => {
    const currentTime = new Date();
    const currentFormattedTime = `${currentTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${currentTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${currentTime
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    return currentFormattedTime;
  };

  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":");
    let period = "AM";
    let hour = parseInt(hours);

    if (hour >= 12) {
      period = "PM";
      if (hour > 12) {
        hour -= 12;
      }
    }
    return `${hour}:${minutes} ${period}`;
  };

  useEffect(() => {
    getAllMealNamesAndTimings();
    getCurrentData();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchSelectedMeal();
    }
  }, [selectedDate, selectedMeal]);

  const getAllMealNamesAndTimings = async () => {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/api/dinings/${place}/${formattedDate(selectedDate)}`
    );
    if (response.ok) {
      const data = await response.json();
      for (const meal of data) {
        var timing = "";
        if (meal.start_time == null && meal.end_time == null) {
          timing = "Closed";
        } else {
          timing =
            convertTo12HourFormat(meal.start_time) +
            " - " +
            convertTo12HourFormat(meal.end_time);
        }
        console.log(meal.meal_name, timing);

        setMealNamesAndTimings((mealNamesAndTimings) => ({
          ...mealNamesAndTimings,
          [meal.meal_name]: timing,
        }));
      }
    } else {
      console.log("Error fetching data");
    }
  };

  // Get the total average rating and timings for the location
  const getCurrentData = async () => {
    const currentTime = getCurrentTime();
    try {
      const response = await fetch(
        selectedOptions.length == 0
          ? `${
              import.meta.env.VITE_API_BASE_URL
            }/api/dinings/${place}/${formattedDate(
              selectedDate
            )}/${currentTime}`
          : `${
              import.meta.env.VITE_API_BASE_URL
            }/api/dinings/${place}/${formattedDate(
              selectedDate
            )}/${currentTime}/?restrict=${selectedOptions}`
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedMeal(data.mealName);
        setLocationRating(data.averageStars);
      }
      if (response.status === 404) {
        selectedMeal("");
        setLocationRating(0);
      }
    } catch (error) {
      console.error("Error fetching location ratings:", error);
    }
  };

  const fetchSelectedMeal = async () => {
    const response = await fetch(
      selectedOptions.length == 0
        ? `${
            import.meta.env.VITE_API_BASE_URL
          }/api/dishes/${place}/${formattedDate(selectedDate)}/${selectedMeal}`
        : `${
            import.meta.env.VITE_API_BASE_URL
          }/api/dishes/${place}/${formattedDate(
            selectedDate
          )}/${selectedMeal}/?restrict=${selectedOptions}`
    );
    if (response.ok) {
      const data = await response.json();

      const tempMealDict = {};

      const stationsArray = data.map((station) => {
        const stationName = station["station_name"];
        const dishes = station["dishes"];
        return { stationName, dishes };
      });

      tempMealDict[selectedMeal] = stationsArray;

      setMealDict(tempMealDict);
    } else {
      console.log("Error fetching data");
    }
  };

  const handleDateChange = (selectedDate) => {
    setSelectedDate(selectedDate); // Update the date state
  };

  const handleSelectionChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>{place}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          {selectedMeal !== "" ? (
            <FoodCourtCard
              diningCourt={place}
              rating={locationRating}
              timing={
                !loading ? mealNamesAndTimings[selectedMeal] : "Fetching..."
              }
            />
          ) : (
            <FoodCourtCard diningCourt={place} />
          )}

          <Datepicker onSelectDate={handleDateChange} />

          <IonRow>
            <IonCol></IonCol>
            <IonCol>
              <FormControl style={{ width: "18em" }}>
                <InputLabel>Meal</InputLabel>
                <Select
                  value={selectedMeal}
                  label="Select a Meal"
                  onChange={(event) => {
                    setSelectedMeal(event.target.value);
                  }}
                  style={{ backgroundColor: "white" }}
                >
                  {Object.keys(mealNamesAndTimings).map((mealName) => (
                    <MenuItem key={mealName} value={mealName}>
                      {mealName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </IonCol>
            <IonCol></IonCol>
          </IonRow>
        </IonGrid>
        {selectedOptions.length > 0 ? (
          <IonCard>
            <IonCardContent>
              <p>{"Filtering by: " + selectedOptions}</p>
            </IonCardContent>
          </IonCard>
        ) : (
          <p></p>
        )}

        {loading ? (
          <IonLoading
            isOpen={mealDict.length == 0}
            message="Purdue Pete's looking for dishes..."
            spinner="circles"
          />
        ) : mealDict[selectedMeal] != null &&
          mealDict[selectedMeal].length > 0 ? (
          mealDict[selectedMeal].map((stationData) => (
            <IonCard key={stationData.stationName}>
              <IonCardHeader>
                <IonCardTitle>{stationData.stationName}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent style={{ paddingInline: "0px" }}>
                <IonList>
                  {stationData.dishes != null &&
                  stationData.dishes.length > 0 ? (
                    stationData.dishes
                      .filter((dish) => dish != null) // Remove any null or undefined dishes
                      .sort((a, b) => {
                        // Sort dishes by average stars in ascending order
                        return (
                          parseFloat(b.average_stars) -
                          parseFloat(a.average_stars)
                        );
                      })
                      .map((dish, index) => (
                        <DishItem
                          key={index}
                          name={dish.dish_name}
                          id={dish.id}
                          avg={parseFloat(dish.average_stars)}
                          reviews={parseInt(dish.num_ratings)}
                        />
                      ))
                  ) : (
                    <p></p>
                  )}
                </IonList>
              </IonCardContent>
            </IonCard>
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
