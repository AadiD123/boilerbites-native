import React, { useEffect, useState } from "react";
import { IonItem, IonButton, IonLabel } from "@ionic/react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { styled } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Rating from "@mui/material/Rating";
import { store } from "../App";

import "./DishItem.css";

const DishItem = (props) => {
  const hapticsImpactMedium = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  const [rating, setRating] = useState(props.avg || 0);
  const [starColor, setStarColor] = useState("black");
  const [precision, setPrecision] = useState(0.1);

  useEffect(() => {
    // dish_id -> rating_id -> rating
    const checkIfRatingExists = async () => {
      if ((await store.get(props.id)) != null) {
        const ratingId = await store.get(props.id);
        const storedRating = await store.get(ratingId);
        if (storedRating !== null) {
          setRating(parseFloat(storedRating));
          setStarColor("#daaa00");
        }
      }
    };

    checkIfRatingExists();
  }, [props.id]); // Update the effect when props.id changes

  const updateExistingRating = async (selectedRating, ratingId) => {
    console.log("update existing rating", selectedRating, ratingId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/ratings/${ratingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stars: selectedRating,
          }),
        }
      );

      if (response.ok) {
        console.log(`Updated user's rating: ${selectedRating}`);
        // Update the rating in store
        const ratingID = await store.get(props.id);
        await store.set(ratingID, selectedRating.toString());
      } else {
        console.error("Failed to update rating on the server.");
      }
    } catch (error) {
      console.error("Error occurred while updating rating:", error);
    }
  };

  const createNewRating = async (selectedRating) => {
    console.log("create new rating", props.id, props.avg, props.reviews);
    // Create a new rating on the server
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/ratings/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dish_id: props.id, stars: selectedRating }),
        }
      );

      if (response.ok) {
        const jsonResponse = await response.json();

        console.log(`User's rating: ${selectedRating}`);
        console.log("jsonResponse id", jsonResponse[0].insertId);

        // Add store with the new rating id
        await store.set(props.id, jsonResponse[0].insertId.toString());
        await store.set(
          jsonResponse[0].insertId.toString(),
          selectedRating.toString()
        );
      } else {
        console.error("Failed to send rating to the server.");
      }
    } catch (error) {
      console.error("Error occurred while sending rating:", error);
    }
  };

  const handleStarClick = async (selectedRating) => {
    // Update local state
    setRating(Math.ceil(selectedRating));
    setStarColor("#daaa00");
    setPrecision(1);

    // Check if a rating for this dish already exists
    const ratingId = await store.get(props.id);

    if (ratingId) {
      // Update the existing rating
      await updateExistingRating(selectedRating, ratingId);
    } else {
      // Create a new rating
      await createNewRating(selectedRating);
    }
  };

  const StyledStarIcon = styled(StarIcon)({
    color: starColor, // Change to the desired color
  });

  const StyledStarBorderIcon = styled(StarBorderIcon)({
    color: "#8e6f3e", // Change to the desired color
  });

  const customIcons = {
    filled: <StyledStarIcon fontSize="inherit" />,
    empty: <StyledStarBorderIcon fontSize="inherit" />,
  };

  return (
    <IonItem>
      <IonLabel>{props.name}</IonLabel>
      <Rating
        slot="end"
        name={`simple-controlled-${props.id}`}
        value={rating} // Use the controlled value from state
        precision={precision}
        emptyIcon={customIcons.empty}
        icon={customIcons.filled}
        onChange={(event, newValue) => {
          handleStarClick(Math.ceil(newValue));
          hapticsImpactMedium();
        }}
      />
    </IonItem>
  );
};

export default DishItem;
