import React from "react";
import { IonCard, IonCardContent } from "@ionic/react";
import { styled } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Rating from "@mui/material/Rating";

import "./FoodCourtCard.css"; // Import the CSS file you created

function FoodCourtCard(props) {
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

  return (
    <IonCard className="food-court-card">
      <img
        alt={`Image for ${props.diningCourt}`}
        src={`/assets/${props.diningCourt}.png`}
      />
      <Rating
        name="read-only"
        value={props.rating || 0}
        readOnly
        precision={0.1}
        emptyIcon={customIcons.empty}
        icon={customIcons.filled}
      />
      <IonCardContent>
        <p>{props.timing}</p>
      </IonCardContent>
    </IonCard>
  );
}

export default FoodCourtCard;
