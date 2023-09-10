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
import { set } from "mongoose";
import Restrictions from "../components/Restrictions";

export default function DiningCourtPage(props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [meals, setMeals] = useState([]);
  const [mealDict, setMealDict] = useState({});

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
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1);
    const day = String(selectedDate.getDate());
    const formattedDate = `${year}-${month}-${day}`;

    const fetchCurrentMeal = async () => {
      const response = await fetch(
        `http://localhost:4000/api/dishes/${props.location}/${formattedDate}/`
      );
      if (response.ok) {
        const data = await response.json();
        const mealDict = {};

        for (const meal of data) {
          setMeals((meals) => [...meals, meal["meal_name"]]);

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

    const fetchLocationTimings = async (location) => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/dinings/timing/${location}/${date}`
        );
        if (response.ok) {
          const locationTimes = await response.json();

          const currentTime = getCurrentTime(date);
          var closestNextOpenTime = currentTime;

          for (const timing of locationTimes) {
            if (timing.status === "Open") {
              // check if current time is within meal time
              if (
                currentTime >= timing.timing[0] &&
                currentTime <= timing.timing[1]
              ) {
                // convert timing to 12 hour format
                const startTime = convertTo12HourFormat(timing.timing[0]);
                const endTime = convertTo12HourFormat(timing.timing[1]);
                setLocationTimings((prevTimings) => ({
                  ...prevTimings,
                  [location]: "Open till " + endTime,
                }));
              }

              if (currentTime <= timing.timing[0]) {
                if (
                  closestNextOpenTime === currentTime ||
                  timing.timing[0] < closestNextOpenTime
                ) {
                  closestNextOpenTime = timing.timing[0];
                }
              }
            }
          }

          // locationTimings[location] == null &&
          // closestNextOpenTime === currentTime
          //   ? setLocationTimings((prevTimings) => ({
          //       ...prevTimings,
          //       [location]: "Closed for rest of today",
          //     }))
          //   : setLocationTimings((prevTimings) => ({
          //       ...prevTimings,
          //       [location]: "Closed, will open at " + closestNextOpenTime,
          //     }));
        }
      } catch (error) {
        console.error("Error fetching location times:", error);
      }
    };

    fetchCurrentMeal();
  }, [selectedDate, selectedMeal]);

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
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonGrid>
            {selectedMeal != "" && mealDict[selectedMeal] != null ? (
              <FoodCourtCard diningCourt={props.location} />
            ) : (
              <FoodCourtCard diningCourt={props.location} />
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
              {/* <Restrictions
                options={Object.keys(mealDict)}
                selectedOption={selectedMeal}
                handleSelectionChange={handleSelectionChange}
              /> */}
            </IonRow>
          </IonGrid>
        </IonItem>

        {selectedMeal != "" && mealDict[selectedMeal].length > 0 ? (
          mealDict[selectedMeal].map((stationData) => (
            <FoodCourtBar
              key={stationData.stationName}
              bar={stationData.stationName}
              dishData={stationData.items}
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
