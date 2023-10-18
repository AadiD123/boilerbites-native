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

export default function DiningCourtPage(props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState("");
  const [selectedOptions, setSelectedOptions] = useState("");
  const [locationRating, setLocationRating] = useState(0);
  const [times, setTimes] = useState({});
  const [mealDict, setMealDict] = useState({});

  let { place, restrictions } = useParams();

  var formattedDate;

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
    fetchData();
  }, [selectedDate, selectedMeal, selectedOptions]);

  const fetchData = async () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1);
    const day = String(selectedDate.getDate());
    formattedDate = `${year}-${month}-${day}`;

    // const storedFilters = await store.get("selectedFilters");
    // if (storedFilters) {
    //   setSelectedOptions(JSON.parse(storedFilters).join(","));
    // }

    if (restrictions) {
      setSelectedOptions(restrictions);
    }

    await fetchLocationTimings();
    await fetchCurrentMeal();
    await fetchCurrentLocationRating();
  };

  const fetchCurrentMeal = async () => {
    console.log("Fetching current meal");
    const response = await fetch(
      selectedOptions === ""
        ? `${
            import.meta.env.VITE_API_BASE_URL
          }/api/dishes/${place}/${formattedDate}`
        : `${
            import.meta.env.VITE_API_BASE_URL
          }/api/dishes/${place}/${formattedDate}/?restrict=${selectedOptions}`
    );
    if (response.ok) {
      const data = await response.json();

      const mealDict = {};

      for (const meal of data) {
        if (selectedMeal == "") {
          setSelectedMeal(meal["meal_name"]);
          console.log(selectedMeal);
        }

        const stationsArray = meal["stations"].map((station) => {
          const stationName = station["station_name"];
          const items = station["items"];
          return { stationName, items };
        });

        mealDict[meal["meal_name"]] = stationsArray;
      }

      setMealDict(mealDict);
    } else {
      console.log("Error fetching data");
    }
  };

  const fetchLocationTimings = async () => {
    console.log("Fetching location timings");
    try {
      const response = await fetch(
        selectedOptions === ""
          ? `${
              import.meta.env.VITE_API_BASE_URL
            }/api/dinings/timing/${place}/${formattedDate}`
          : `${
              import.meta.env.VITE_API_BASE_URL
            }/api/dinings/timing/${place}/${formattedDate}/?restrict=${selectedOptions}`
      );
      if (response.ok) {
        const locationTimes = await response.json();

        const currentTime = getCurrentTime(selectedDate);
        console.log("Current time ", currentTime);

        for (const timing of locationTimes) {
          const startTime = convertTo12HourFormat(timing.timing[0]);
          const endTime = convertTo12HourFormat(timing.timing[1]);

          if (timing.status == "Closed") {
            setTimes((otherTimes) => ({
              ...otherTimes,
              [timing["meal_name"]]: "Closed",
            }));
            continue;
          }

          setTimes((otherTimes) => ({
            ...otherTimes,
            [timing["meal_name"]]: startTime + " - " + endTime,
          }));

          if (timing.status === "Open") {
            // check if current time is within meal time
            if (
              currentTime >= timing.timing[0] &&
              currentTime <= timing.timing[1]
            ) {
              setSelectedMeal(timing["meal_name"]);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching location times:", error);
    }
  };

  const fetchCurrentLocationRating = async () => {
    console.log("Fetching location rating");
    try {
      const response = await fetch(
        selectedOptions === ""
          ? `${
              import.meta.env.VITE_API_BASE_URL
            }/api/dinings/rating/${place}/${formattedDate}`
          : `${
              import.meta.env.VITE_API_BASE_URL
            }/api/dinings/rating/${place}/${formattedDate}/?restrict=${selectedOptions}`
      );
      if (response.ok) {
        const rating = await response.json();
        setLocationRating(rating.averageStars);
        console.log(locationRating);
      }
    } catch (error) {
      console.error("Error fetching location times:", error);
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
              timing={times[selectedMeal]}
            />
          ) : (
            <FoodCourtCard diningCourt={place} />
          )}

          <Datepicker onSelectDate={handleDateChange} />
          <IonRow>
            <IonCol>
              <FormControl fullWidth>
                <InputLabel>Select a Meal</InputLabel>
                <Select
                  value={selectedMeal}
                  label="Select a Meal"
                  onChange={(event) => {
                    setSelectedMeal(event.target.value);
                  }}
                  style={{ backgroundColor: "white" }}
                >
                  {Object.keys(mealDict).map((mealName) => (
                    <MenuItem key={mealName} value={mealName}>
                      {mealName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </IonCol>
          </IonRow>
        </IonGrid>

        {selectedMeal !== "" ? (
          mealDict[selectedMeal] != null ? (
            mealDict[selectedMeal]
              .filter((s) => s.items.length > 0)
              .map((stationData) => (
                <IonCard key={stationData.stationName}>
                  <IonCardHeader>
                    <IonCardTitle>{stationData.stationName}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent style={{ paddingInline: "0px" }}>
                    <IonList>
                      {stationData.items != null &&
                      Array.isArray(stationData.items) ? (
                        stationData.items
                          .filter((dish) => dish != null) // Remove any null or undefined dishes
                          .sort((a, b) => b.avg - a.avg) // Sort dishes by avg in ascending order
                          .map((dish, index) => (
                            <DishItem
                              key={index}
                              name={dish.dish_name}
                              id={dish.id}
                              avg={dish.avg}
                              reviews={dish.reviews}
                              date={selectedDate}
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
          )
        ) : (
          <IonLoading
            isOpen={selectedMeal === ""}
            message="Loading..."
            spinner="circles"
          />
        )}
      </IonContent>
    </IonPage>
  );
}
