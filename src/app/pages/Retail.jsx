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
import { useEffect, useState } from "react";

export default function Retail() {
  const locations = {
    Aatish: {
      Monday: ["17:00:00 20:00:00"],
      Tuesday: ["17:00:00 20:00:00"],
      Wednesday: ["17:00:00 20:00:00"],
      Thursday: ["17:00:00 20:00:00"],
      Sunday: ["17:00:00 20:00:00"],
    },
    "BBQ District": {
      Monday: ["17:00:00 20:00:00"],
      Tuesday: ["17:00:00 20:00:00"],
      Wednesday: ["17:00:00 20:00:00"],
      Thursday: ["17:00:00 20:00:00"],
    },
    "Burger 101": {
      Monday: ["17:00:00 20:00:00"],
      Tuesday: ["17:00:00 20:00:00"],
      Wednesday: ["17:00:00 20:00:00"],
      Thursday: ["17:00:00 20:00:00"],
    },
    "Cary Knight Spot": {
      Monday: ["17:00:00 20:00:00"],
      Tuesday: ["17:00:00 20:00:00"],
      Wednesday: ["17:00:00 20:00:00"],
      Thursday: ["17:00:00 20:00:00"],
      Sunday: ["17:00:00 20:00:00"],
    },
    "Chef Bill Kim's": {
      Monday: ["17:00:00 20:00:00"],
      Tuesday: ["17:00:00 20:00:00"],
      Wednesday: ["17:00:00 20:00:00"],
      Thursday: ["17:00:00 20:00:00"],
    },
    "Chick-fil-a": {
      Monday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Tuesday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Wednesday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Thursday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Friday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Saturday: ["11:00:00 14:00:00"],
    },
    Così: {
      Monday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Tuesday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Wednesday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Thursday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Friday: ["11:00:00 14:00:00"],
    },
    "Fresh Fare": {
      Monday: ["7:30:00 10:30:00"],
      Tuesday: ["7:30:00 10:30:00"],
      Wednesday: ["7:30:00 10:30:00"],
      Thursday: ["7:30:00 10:30:00"],
      Friday: ["7:30:00 10:30:00"],
    },
    Freshens: {
      Monday: ["17:00:00 20:00:00"],
      Tuesday: ["17:00:00 20:00:00"],
      Wednesday: ["17:00:00 20:00:00"],
      Thursday: ["17:00:00 20:00:00"],
    },
    "Jersey Mike's": {
      Monday: ["17:00:00 20:00:00"],
      Tuesday: ["17:00:00 20:00:00"],
      Wednesday: ["17:00:00 20:00:00"],
      Thursday: ["17:00:00 20:00:00"],
    },
    Lawson: {
      Monday: ["7:30:00 17:00:00"],
      Tuesday: ["7:30:00 17:00:00"],
      Wednesday: ["7:30:00 17:00:00"],
      Thursday: ["7:30:00 17:00:00"],
      Friday: ["7:30:00 17:00:00"],
    },
    Panera: {
      Monday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Tuesday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Wednesday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Thursday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Friday: ["11:00:00 14:00:00"],
      Saturday: ["11:00:00 14:00:00"],
    },
    Qdoba: {
      Monday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Tuesday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Wednesday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Thursday: ["11:00:00 14:00:00", "17:00:00 20:00:00"],
      Friday: ["11:00:00 14:00:00"],
      Saturday: ["11:00:00 14:00:00"],
      Sunday: ["17:00:00 20:00:00"],
    },
    Saladworks: {
      Monday: ["11:00:00 14:00:00"],
      Tuesday: ["11:00:00 14:00:00"],
      Wednesday: ["11:00:00 14:00:00"],
      Thursday: ["11:00:00 14:00:00"],
      Friday: ["11:00:00 14:00:00"],
    },
    "Shen Ye": {
      Monday: ["17:00:00 20:00:00"],
      Tuesday: ["17:00:00 20:00:00"],
      Wednesday: ["17:00:00 20:00:00"],
      Thursday: ["17:00:00 20:00:00"],
    },
    "Sol Toro": {
      Monday: ["17:00:00 20:00:00"],
      Tuesday: ["17:00:00 20:00:00"],
      Wednesday: ["17:00:00 20:00:00"],
      Thursday: ["17:00:00 20:00:00"],
    },
    "Sushi Boss": {
      Monday: ["17:00:00 20:00:00"],
      Tuesday: ["17:00:00 20:00:00"],
      Wednesday: ["17:00:00 20:00:00"],
      Thursday: ["17:00:00 20:00:00"],
      Sunday: ["17:00:00 20:00:00"],
    },
    Zen: {
      Monday: ["17:00:00 20:00:00"],
      Tuesday: ["17:00:00 20:00:00"],
      Wednesday: ["17:00:00 20:00:00"],
      Thursday: ["17:00:00 20:00:00"],
      Sunday: ["17:00:00 20:00:00"],
    },
  };

  const daysOfWeek = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  const [swipesAccepted, setSwipesAccepted] = useState([]);
  const [swipesNotAccepted, setSwipesNotAccepted] = useState([]);

  useEffect(() => {
    setSwipesAccepted([]);
    setSwipesNotAccepted([]);
    for (const location in locations) {
      const day = daysOfWeek[new Date().getDay()];
      if (day in locations[location]) {
        const timings = locations[location][day];
        for (const timing of timings) {
          const [start, end] = timing.split(" ");
          const [startHour, startMinute, startSecond] = start.split(":");
          const [endHour, endMinute, endSecond] = end.split(":");
          const currentTime = new Date();
          const currentHour = currentTime.getHours();
          const currentMinute = currentTime.getMinutes();
          const currentSecond = currentTime.getSeconds();
          console.log(location, startHour, endHour, currentHour);
          if (currentHour >= startHour && currentHour <= endHour) {
            if (
              (currentHour == startHour && currentMinute > startMinute) ||
              (currentHour == endHour && currentMinute < endMinute)
            ) {
              setSwipesAccepted((swipesAccepted) => {
                return [...swipesAccepted, location];
              });
              break;
            } else if (currentHour > startHour && currentHour < endHour) {
              setSwipesAccepted((swipesAccepted) => {
                return [...swipesAccepted, location];
              });
              break;
            }
          }
          if (!(location in swipesNotAccepted)) {
            setSwipesNotAccepted((swipesNotAccepted) => {
              return [...swipesNotAccepted, location];
            });
          }
        }
      } else {
        if (!(location in swipesNotAccepted)) {
          setSwipesNotAccepted((swipesNotAccepted) => {
            return [...swipesNotAccepted, location];
          });
        }
      }
    }
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle size="large">Boiler Bites</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher> */}

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Boiler Bites</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonCard style={{ paddingInline: "0px" }}>
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: "1.5em" }}>
              Swipes Accepted Now
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ paddingInline: "0px" }}>
            <IonList>
              {swipesAccepted.length == 0 ? (
                <IonItem>No places accepting swipes</IonItem>
              ) : (
                swipesAccepted.map((location, index) => (
                  <IonItem
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
                      {/* <IonThumbnail slot="start">
                        <img
                          alt={`${location}`}
                          src={`/assets/${location}.png`}
                        />
                      </IonThumbnail> */}

                      <div style={{ fontSize: "0.9em", textAlign: "center" }}>
                        <IonLabel>{location}</IonLabel>
                      </div>

                      {/* 

                    <Rating
                      name="read-only"
                      value={locationRatings[location] || 0}
                      readOnly
                      precision={0.1}
                      emptyIcon={customIcons.empty}
                      icon={customIcons.filled}
                    /> */}
                      {/* {console.log(locationRatings)} */}
                      {/* <IonNote slot="end">{locationRatings[location].toFixed(1) || 0}</IonNote> */}
                    </div>
                  </IonItem>
                ))
              )}
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard style={{ paddingInline: "0px" }}>
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: "1.5em" }}>
              Swipes Not Accepted
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ paddingInline: "0px" }}>
            <IonList>
              {swipesNotAccepted.length == 0 ? (
                <IonItem>Every place is accepting swipes</IonItem>
              ) : (
                swipesNotAccepted.map((location, index) => (
                  <IonItem
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
                      {/* <IonThumbnail slot="start">
                        <img
                          alt={`${location}`}
                          src={`/assets/${location}.png`}
                        />
                      </IonThumbnail> */}

                      <div style={{ fontSize: "0.9em", textAlign: "center" }}>
                        <IonLabel>{location}</IonLabel>
                      </div>

                      {/* 

                    <Rating
                      name="read-only"
                      value={locationRatings[location] || 0}
                      readOnly
                      precision={0.1}
                      emptyIcon={customIcons.empty}
                      icon={customIcons.filled}
                    /> */}
                      {/* {console.log(locationRatings)} */}
                      {/* <IonNote slot="end">{locationRatings[location].toFixed(1) || 0}</IonNote> */}
                    </div>
                  </IonItem>
                ))
              )}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}
