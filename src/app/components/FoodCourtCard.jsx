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
      <IonCardContent>
        {props.openTime === "Closed" ? (
          <p>Closed</p>
        ) : (
          <p>
            {props.openTime} - {props.closeTime}
          </p>
        )}
      </IonCardContent>
    </IonCard>
  );
}

export default FoodCourtCard;
