import React, { useState, useEffect } from "react";
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
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";

import "./Home.css";

// Rating imports
import { styled } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Rating from "@mui/material/Rating";

// Components
import FilterDropdown from "../components/FilterDropdown";

import { store } from "../App";

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

const Home = () => {
  const [loading, setLoading] = useState(true);
  const locations = ["Earhart", "Ford", "Wiley", "Windsor", "Hillenbrand"];
  const quickBites = [
    "1Bowl",
    "Pete's Za",
    "The Burrow",
    "The Gathering Place",
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
    getFilters();
  }, []);

  const getFilters = async () => {
    const storedFilters = await store.get("selectedFilters");
    if (storedFilters) {
      setSelectedOptions(JSON.parse(storedFilters));
    } else {
      setLocationTimings({});
      setLocationRatings({});
      locations.forEach((location) => {
        getData(location);
      });
      quickBites.forEach((location) => {
        getData(location);
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!loading) {
      setLocationTimings({});
      setLocationRatings({});
      locations.forEach((location) => {
        getData(location);
      });
      quickBites.forEach((location) => {
        getData(location);
      });
    }
  }, [selectedOptions]);

  const getData = async (location) => {
    const currentTime = getCurrentTime();
    const date = getDate();
    console.log(location);
    console.log(currentTime);
    console.log(date);
    console.log("Selected options", selectedOptions);
    try {
      const response = await fetch(
        selectedOptions.length == 0
          ? `${
              import.meta.env.VITE_API_BASE_URL
            }/api/dinings/${location}/${date}/${currentTime}`
          : `${
              import.meta.env.VITE_API_BASE_URL
            }/api/dinings/${location}/${date}/${currentTime}/?restrict=${selectedOptions}`
      );
      if (response.ok) {
        const data = await response.json();
        setLocationRatings((prevRatings) => ({
          ...prevRatings,
          [location]: data.averageStars,
        }));
        setLocationTimings((prevTimings) => ({
          ...prevTimings,
          [location]: "Open till " + convertTo12HourFormat(data.end),
        }));
      }
      if (response.status === 404) {
        setLocationTimings((prevTimings) => ({
          ...prevTimings,
          [location]: "Closed",
        }));
        setLocationRatings((prevRatings) => ({
          ...prevRatings,
          [location]: 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching location ratings:", error);
    }
  };

  const handleRefresh = async (event) => {
    setTimeout(() => {
      setLocationTimings({});
      setLocationRatings({});
      locations.forEach((location) => {
        getData(location);
      });

      quickBites.forEach((location) => {
        getData(location);
      });
      event.detail.complete();
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle size="large">Boiler Bites</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Boiler Bites</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid>
          <IonRow>
            <IonCol class="ion-text-center">
              <FilterDropdown
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
              />
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonCard style={{ paddingInline: "0px" }}>
          <IonCardHeader>
            <IonCardTitle>Dining Courts</IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ paddingInline: "0px" }}>
            <IonList>
              {locations.map((location, index) => (
                <IonItem
                  routerLink={`/residential/${location}/${selectedOptions}`}
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

                    <div style={{ fontSize: "0.9em", textAlign: "center" }}>
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
                    {/* {console.log(locationRatings)} */}
                    {/* <IonNote slot="end">{locationRatings[location].toFixed(1) || 0}</IonNote> */}
                  </div>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
        <IonCard style={{ paddingInline: "0px" }}>
          <IonCardHeader>
            <IonCardTitle>Quick Bites</IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ paddingInline: "0px" }}>
            <IonList>
              {quickBites.map((location, index) => (
                <IonItem
                  routerLink={`/residential/${location}/${selectedOptions}`}
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

                    <div style={{ fontSize: "0.9em", textAlign: "center" }}>
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
                    {/* <IonNote slot="end">{locationRatings[location].toFixed(1) || 0}</IonNote> */}
                  </div>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
        <IonCard style={{ textAlign: "center", padding: "0.75em" }}>
          <IonText>Aaditya and Armanya</IonText>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
