import React from "react";
import { IonCard, IonCardContent } from "@ionic/react";
import "./FoodCourtCard.css"; // Import the CSS file you created

function FoodCourtCard(props) {
  return (
    <IonCard className="food-court-card">
      <img
        alt={`Image for ${props.diningCourt}`}
        src={`/assets/${props.diningCourt}.png`}
      />
      <IonCardContent>*Rating*</IonCardContent>
    </IonCard>
  );
}

export default FoodCourtCard;
