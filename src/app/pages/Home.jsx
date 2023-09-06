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
  const [dcAvgRatings, setDCAvgRatings] = useState({});
  const [allDCData, setDCData] = useState({});

  const [date, setDate] = useState(new Date());

  const [dcTimings, setDCTimings] = useState({});

  useEffect(() => {
    const fetchLocationData = async (location) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1);
      const day = String(date.getDate());
      const formattedDate = `${year}-${month}-${day}`;

      const selectedOptionsQuery = selectedOptions.join(",");

      try {
        const response = await fetch(
          `http://localhost:4000/api/dishes/${location}/${formattedDate}/?restrict=${selectedOptionsQuery}`
        );

        if (response.ok) {
          const data = await response.json();
          const currentTime = date;
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

          const timingData = {};
          let ratings = 0;
          let numDishes = 0;
          let currentMeal = "";

          for (const meal of data) {
            if (meal["status"] === "Open") {
              const mealStartTime = meal["timing"][0];
              const mealEndTime = meal["timing"][1];

              if (
                currentFormattedTime >= mealStartTime &&
                currentFormattedTime <= mealEndTime
              ) {
                timingData[meal["meal_name"]] = [mealStartTime, mealEndTime];
                currentMeal = meal["meal_name"];
              }

              if (meal["meal_name"] === currentMeal) {
                for (const station of meal["stations"]) {
                  for (const item of station["items"]) {
                    ratings += item["avg"] > 0 ? item["avg"] : 0;
                    numDishes += item["reviews"] > 0 ? 1 : 0;
                  }
                }
              }
              const currentHour = date.getHours();
              if (currentHour >= 21) {
                date = new Date(date.setDate(date.getDate() + 1));
              }
            } else {
              // Handle closed dining court
            }
          }

          const avgRating = numDishes > 0 ? ratings / numDishes : 0;

          // Update state with the fetched data
          setDCData((dcData) => ({ ...dcData, [location]: data }));
          setDCTimings((dcTimings) => ({
            ...dcTimings,
            [location]: timingData,
          }));
          setDCAvgRatings((dcAvgRatings) => ({
            ...dcAvgRatings,
            [location]: avgRating,
          }));
        } else {
          console.log("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data for each location
    const allLocations = [...locations, ...quickBites];
    const fetchDataPromises = allLocations.map((location) =>
      fetchLocationData(location)
    );

    // Wait for all fetch requests to complete
    Promise.all(fetchDataPromises).then(() => {
      console.log("All data fetched.");
    });
  }, [selectedOptions, date]);

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
                <LocationItem
                  key={index}
                  location={location}
                  // openTime={dcTimings[location][0]}
                  // closeTime={dcTimings[location][1]}
                  data={allDCData[location]}
                  totalAvgRating={dcAvgRatings[location]}
                />
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
                <LocationItem
                  key={index}
                  location={location}
                  // openTime={dcTimings[location][0]}
                  // closeTime={dcTimings[location][1]}
                  data={allDCData[location]}
                  totalAvgRating={dcAvgRatings[location]}
                />
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
