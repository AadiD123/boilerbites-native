import React, { useEffect, useState } from "react";
import { IonItem, IonButton, IonLabel } from "@ionic/react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import Rating from "@mui/material/Rating";

import "./DishItem.css";

const DishItem = (props) => {
  const totalVotes = props.likes + props.dislikes;
  const likePercentage =
    totalVotes === 0 ? 0 : (props.likes / totalVotes) * 100;

  const hapticsImpactMedium = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  const [rating, setRating] = useState(0);

  useEffect(() => {
    const storedRating = localStorage.getItem(localStorage.getItem(props.id));
    if (storedRating !== null) {
      setRating(parseFloat(storedRating)); // Convert the stored rating to a float
    }
  }, [props.id]); // Only update the effect when props.id changes

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
            stars:
              (props.avg * props.reviews + selectedRating) /
              (props.reviews + 1),
          }),
        }
      );

      if (response.ok) {
        console.log(`Updated user's rating: ${selectedRating}`);
        // Calculate new average rating
        avgRating =
          (avgRating * numRatings -
            localStorage.getItem(ratingId) +
            selectedRating) /
          numRatings;
        // Update the rating in localStorage
        localStorage.setItem(ratingId, selectedRating.toString());
        console.log("new avgRating", avgRating);
      } else {
        console.error("Failed to update rating on the server.");
      }
    } catch (error) {
      console.error("Error occurred while updating rating:", error);
    }
  };

  const createNewRating = async (selectedRating) => {
    console.log("create new rating", props.id, props.avg, props.num);
    // Create a new rating on the server
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/ratings/${props.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dish: props.id, stars: selectedRating }),
        }
      );

      if (response.ok) {
        const jsonResponse = await response.json();

        console.log(`User's rating: ${selectedRating}`);
        console.log("jsonResponse id", jsonResponse._id);

        // Add localStorage with the new rating id
        localStorage.setItem(props.id, jsonResponse._id);
        localStorage.setItem(jsonResponse._id, selectedRating.toString());
      } else {
        console.error("Failed to send rating to the server.");
      }
    } catch (error) {
      console.error("Error occurred while sending rating:", error);
    }

    // patch request to update the dish with the new average rating
  };

  const handleStarClick = async (selectedRating) => {
    // Update local state
    setRating(selectedRating);

    // Check if a rating for this dish already exists
    const ratingId = localStorage.getItem(props.id);

    if (ratingId) {
      await updateExistingRating(selectedRating, ratingId);
    } else {
      await createNewRating(selectedRating);
    }
  };

  return (
    <IonItem>
      <IonLabel>{props.name}</IonLabel>
      {/* <IonButton
        slot="end"
        fill="clear"
        onClick={() => {
          hapticsImpactMedium();
        }}
      >
        <img
          alt="Thumb Up"
          src="/assets/Boiler Up.png"
          style={{ width: "20px", height: "30px" }}
        />
      </IonButton>
      <IonButton
        slot="end"
        fill="clear"
        onClick={() => {
          hapticsImpactMedium();
        }}
      >
        <img
          alt="Thumb Up"
          src="/assets/Hammer Down.png"
          style={{ width: "45px", height: "25px" }}
        />
      </IonButton> */}
      <Rating
        slot="end"
        name={`simple-controlled-${props.id}`} // Use a unique name for each Rating component
        value={rating}
        onChange={(event, newValue) => {
          handleStarClick(newValue);
        }}
      />
    </IonItem>
  );
};

export default DishItem;
