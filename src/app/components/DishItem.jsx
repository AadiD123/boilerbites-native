import React from "react";
import { IonItem, IonButton, IonLabel } from "@ionic/react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { ThumbDown } from "@mui/icons-material";
import "./DishItem.css";

const DishItem = (props) => {
  const totalVotes = props.likes + props.dislikes;
  const likePercentage =
    totalVotes === 0 ? 0 : (props.likes / totalVotes) * 100;

  const hapticsImpactMedium = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  return (
    <IonItem>
      <IonLabel style={{ textAlign: "center", whiteSpace: "normal" }}>
        {props.name}
      </IonLabel>
      <IonButton
        slot="start"
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
      </IonButton>
    </IonItem>
  );
};

export default DishItem;
