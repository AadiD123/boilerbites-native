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
import { get } from "mongoose";

const Home = () => {
  // const [currentMeal, setCurrentMeal] = useState("");
  // const [dcAvgRatings, setDCAvgRatings] = useState({});
  // const [allDCData, setDCData] = useState({});
  // const [dcTimings, setDCTimings] = useState({});

  // const [date, setDate] = useState(new Date());
  // useEffect(() => {
  //   const fetchLocationData = async (location) => {
  //     const year = date.getFullYear();
  //     const month = String(date.getMonth() + 1);
  //     const day = String(date.getDate());
  //     const formattedDate = `${year}-${month}-${day}`;

  //     const selectedOptionsQuery = selectedOptions.join(",");

  //     try {
  //       const response = await fetch(
  //         `http://localhost:4000/api/dishes/${location}/${formattedDate}/?restrict=${selectedOptionsQuery}`
  //       );

  //       if (response.ok) {
  //         const data = await response.json();
  //         const currentTime = date;
  //         const currentFormattedTime = `${currentTime
  //           .getHours()
  //           .toString()
  //           .padStart(2, "0")}:${currentTime
  //           .getMinutes()
  //           .toString()
  //           .padStart(2, "0")}:${currentTime
  //           .getSeconds()
  //           .toString()
  //           .padStart(2, "0")}`;

  //         console.log(location, currentFormattedTime);

  //         const timingData = {};
  //         let ratings = 0;
  //         let numDishes = 0;
  //         let currentMeal = "";

  //         for (const meal of data) {
  //           if (meal["status"] === "Open") {
  //             const mealStartTime = meal["timing"][0];
  //             const mealEndTime = meal["timing"][1];

  //             // Check if current time is within meal time
  //             if (
  //               currentFormattedTime >= mealStartTime &&
  //               currentFormattedTime <= mealEndTime
  //             ) {
  //               timingData[meal["meal_name"]] = [mealStartTime, mealEndTime];
  //               currentMeal = meal["meal_name"];
  //             }

  //             // Calculate average rating
  //             if (meal["meal_name"] === currentMeal) {
  //               for (const station of meal["stations"]) {
  //                 for (const item of station["items"]) {
  //                   ratings += item["avg"] > 0 ? item["avg"] : 0;
  //                   numDishes += item["reviews"] > 0 ? 1 : 0;
  //                 }
  //               }
  //             }

  //             if (date.getHours() >= 21) {
  //               setDate(date + 1);
  //             }
  //           } else {
  //             // Handle closed dining court
  //           }
  //         }

  //         // Make sure average rating is not NaN
  //         const avgRating = numDishes > 0 ? ratings / numDishes : 0;

  //         console.log("Avg Rating", avgRating, location);
  //         console.log("Timing Data", timingData, location);
  //         console.log("Data", data, location);

  //         // Update state with the fetched data
  //         setDCData((dcData) => ({ ...dcData, [location]: data }));

  //         setDCTimings((dcTimings) => ({
  //           ...dcTimings,
  //           [location]: timingData,
  //         }));

  //         setDCAvgRatings((dcAvgRatings) => ({
  //           ...dcAvgRatings,
  //           [location]: avgRating,
  //         }));
  //       } else {
  //         console.log("Error fetching data");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   // Fetch data for each location
  //   const allLocations = [...locations, ...quickBites];
  //   const fetchDataPromises = allLocations.map((location) =>
  //     fetchLocationData(location)
  //   );

  //   // Wait for all fetch requests to complete
  //   Promise.all(fetchDataPromises).then(() => {
  //     console.log("All data fetched.");
  //   });
  // }, [selectedOptions, date]);

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
  const [locationRatings, setLocationRatings] = useState({});
  const [locationTimings, setLocationTimings] = useState({});

  const getDate = () => {
    const date = new Date();
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
    const date = getDate();
    console.log(date);

    const fetchLocationRatings = async (location) => {
      const selectedOptionsQuery = selectedOptions.join(",");

      try {
        const response = await fetch(
          selectedOptionsQuery === ""
            ? `http://localhost:4000/api/dinings/rating/${location}/${date}`
            : `http://localhost:4000/api/dinings/rating/${location}/${date}/?restrict=${selectedOptionsQuery}`
        );
        if (response.ok) {
          const data = await response.json();
          setLocationRatings((prevRatings) => ({
            ...prevRatings,
            [location]: data.averageStars,
          }));
        }
      } catch (error) {
        console.error("Error fetching location times:", error);
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

    locations.forEach((location) => {
      fetchLocationRatings(location);
      fetchLocationTimings(location);
    });

    quickBites.forEach((location) => {
      fetchLocationRatings(location);
      fetchLocationTimings(location);
    });
  }, []);

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
                  timings={locationTimings[location]}
                  totalAvgRating={locationRatings[location]}
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
                  timings={locationTimings[location]}
                  totalAvgRating={locationRatings[location]}
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
