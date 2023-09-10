import React, { useEffect, useState } from "react";
import { IonItem, IonButton, IonLabel } from "@ionic/react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import Rating from "@mui/material/Rating";
import { Drivers, Storage } from "@ionic/storage";

import "./DishItem.css";

const DishItem = (props) => {
  const storage = new Storage();
  storage.create();

  const hapticsImpactMedium = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  const [rating, setRating] = useState(0);

  useEffect(() => {
    // dish_id -> rating_id -> rating
    const checkIfRatingExists = async () => {
      const ratingKey = `${props.id}`;
      const storedRating = await storage.get(ratingKey);
      if (storedRating !== null) {
        setRating(parseFloat(storedRating));
      }
    };

    checkIfRatingExists();
  }, [props.id]); // Update the effect when props.id changes

  const updateExistingRating = async (selectedRating, ratingId) => {
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
        // Update the rating in localStorage
        const ratingKey = `rating_${props.id}`;
        await storage.set(ratingKey, selectedRating.toString());
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

        // Add localStorage with the new rating id
        const ratingKey = `rating_${props.id}`;
        await storage.set(ratingKey, selectedRating.toString());
        await storage.set(
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
    setRating(selectedRating);

    // Check if a rating for this dish already exists
    const ratingId = await storage.get(props.id);

    if (ratingId) {
      // Update the existing rating
      await updateExistingRating(selectedRating, ratingId);
    } else {
      // Create a new rating
      await createNewRating(selectedRating);
    }
  };

  return (
    <IonItem>
      <IonLabel>{props.name}</IonLabel>
      <Rating
        slot="end"
        name={`simple-controlled-${props.id}`}
        value={rating} // Use the controlled value from state
        onChange={(event, newValue) => {
          handleStarClick(newValue);
          hapticsImpactMedium();
        }}
      />
    </IonItem>
  );
};

export default DishItem;
