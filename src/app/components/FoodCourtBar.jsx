import React from "react";
import "./FoodCourtBar.css";

import {
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";

import DishItem from "./DishItem";

export default function FoodCourtBar(props) {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{props.bar}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent style={{ paddingInline: "0px" }}>
        <IonList>
          {props.dishData != null && Array.isArray(props.dishData) ? (
            props.dishData.map((dish, index) => (
              <DishItem
                key={index}
                name={dish.dish_name}
                id={dish.id}
                avg={dish.avg}
                reviews={dish.reviews}
              />
            ))
          ) : (
            <p></p>
          )}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
}
