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

import { styled } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Rating from "@mui/material/Rating";

import "./Home.css";
import React, { useState, useEffect } from "react";
import Restrictions from "../components/Restrictions";

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
    "no nuts",
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [locationRatings, setLocationRatings] = useState({});
  const [locationTimings, setLocationTimings] = useState({});

  const StyledStarIcon = styled(StarIcon)({
    color: "black", // Change to the desired color
  });

  const StyledStarBorderIcon = styled(StarBorderIcon)({
    color: "#8e6f3e", // Change to the desired color
  });

  const customIcons = {
    filled: <StyledStarIcon fontSize="inherit" />,
    empty: <StyledStarBorderIcon fontSize="inherit" />,
  };

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
          // console.log("called ratings", location, data);
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

  // const handleSelectionChange = (event) => {
  //   setSelectedOptions(event.target.value);
  // };

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
        {/* <div className="home-dropdown">
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
          
        </div> */}
        <div>
          {/* <Restrictions
            options={options}
            selectedOptions={selectedOptions}
            handleSelectionChange={handleSelectionChange}
          /> */}
        </div>

        <IonCard style={{ paddingInline: "0px" }}>
          <IonCardHeader>
            <IonCardTitle>Dining Courts</IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ paddingInline: "0px" }}>
            <IonList>
              {locations.map((location, index) => (
                <IonItem
                  routerLink={`/${location}`}
                  key={index}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    "--detail-icon-color": "transparent",
                    "--detail-icon-size": "0",
                    padding: "0px",
                    margin: "0px",
                    minHeight: "4.5em",
                  }}
                >
                  <div className="home-list-item-cont">
                    <IonThumbnail slot="start">
                      <img
                        alt={`${location}`}
                        src={`/assets/${location}.png`}
                      />
                    </IonThumbnail>

                    <div style={{ fontSize: "0.9em" }}>
                      <IonLabel>{location}</IonLabel>
                      <IonLabel>{locationTimings[location]}</IonLabel>
                    </div>

                    <Rating
                      name="read-only"
                      value={locationRatings[location] || 0}
                      readOnly
                      precision={0.1}
                      emptyIcon={customIcons.empty}
                      icon={customIcons.filled}
                    />
                  </div>
                </IonItem>
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
                <IonItem routerLink={`/${location}`} key={index}>
                  <IonThumbnail slot="start">
                    <img alt={`${location}`} src={`/assets/${location}.png`} />
                  </IonThumbnail>
                  <IonLabel>{location}</IonLabel>
                  <IonLabel>{locationTimings[location]}</IonLabel>
                  <Rating
                    name="read-only"
                    value={locationRatings[location] || 0}
                    readOnly
                    precision={0.1}
                    emptyIcon={customIcons.empty}
                    icon={customIcons.filled}
                  />
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
