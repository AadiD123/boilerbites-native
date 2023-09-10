import React from "react";
import { IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import LocationRating from "./LocationRating";
import { styled } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Rating from "@mui/material/Rating";

export default function LocationItem(props) {
  const { location, timings, avgRating } = props;
  console.log(location, avgRating);
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
    <IonItem routerLink={`/${location}`}>
      <IonThumbnail slot="start">
        <img alt={`${location}`} src={`/assets/${location}.png`} />
      </IonThumbnail>
      <IonLabel>{location}</IonLabel>
      <IonLabel>{timings}</IonLabel>
      <Rating
        name="read-only"
        value={avgRating}
        readOnly
        precision={0.1}
        emptyIcon={customIcons.empty}
        icon={customIcons.filled}
      />
    </IonItem>
  );
}
