import React from "react";
import { IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import LocationRating from "./LocationRating";

export default function LocationItem(props) {
  return (
    <IonItem routerLink={`/${props.location}`}>
      <IonThumbnail slot="start">
        <img alt={`${props.location}`} src={`/assets/${props.location}.png`} />
      </IonThumbnail>
      <IonLabel>{props.location}</IonLabel>
      <IonLabel>{props.timings}</IonLabel>
      <LocationRating
        location={`${props.location}`}
        totalAvgRating={props.avgRating}
      />
    </IonItem>
  );
}
