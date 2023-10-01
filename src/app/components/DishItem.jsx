import React, { useEffect, useState, useRef } from "react";
import { IonItem, IonLabel, IonNote, IonList, IonTitle } from "@ionic/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { styled } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Rating from "@mui/material/Rating";
import { store } from "../App";

import "./DishItem.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function DishItem(props) {
  const hapticsImpactMedium = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  const [rating, setRating] = useState(props.avg || 0);
  const [reviews, setReviews] = useState(props.reviews || 0);
  const [starColor, setStarColor] = useState("black");
  const [precision, setPrecision] = useState(0.1);
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState([]);

  const modal = useRef(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  const fetchInfo = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dishes/${props.id}/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setInfo(data);
      });
  };

  useEffect(() => {
    fetchInfo();
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
        `${import.meta.env.VITE_API_BASE_URL}/api/ratings/patch/${ratingId}`,
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

  const deleteExistingRating = async (ratingId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/ratings/del/${ratingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const ratingID = await store.get(props.id);
        console.log(ratingID, props.id);
        await store.remove(ratingID);
        await store.remove(props.id);
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
      if (selectedRating > 0) {
        await updateExistingRating(selectedRating, ratingId);
      } else {
        setReviews(reviews - 1);
        await deleteExistingRating(ratingId);
      }
    } else {
      // Create a new rating
      setReviews(reviews + 1);
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <IonItem>
      <IonLabel onClick={handleOpen}>{props.name}</IonLabel>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "20em",
            minHeight: "20em",
            backgroundColor: "#cfb991", //"#f5f5f5
            padding: "2em",
            color: "black",
            boxShadow: 24,
            borderRadius: "20px",
            p: 4,
          }}
        >
          {info.map((field, index) => (
            <div key={index}>
              <h3 style={{ color: "black" }}>{props.name}</h3>
              <p>Serving Size: {field.serving_size}</p>
              <p>Calories: {Math.ceil(field.calories)} g</p>
              <p>Carbs: {Math.ceil(field.carbs)} g</p>
              <p>Protein: {Math.ceil(field.protein)} g</p>
              <p>Fat: {Math.ceil(field.fat)} g</p>
            </div>
          ))}
        </Box>
      </Modal>

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
      <IonNote slot="end" style={{ textColor: "#daaa00" }}>
        {reviews}
      </IonNote>
    </IonItem>
  );
}
