import React, { useState } from "react";
import "./DatePicker.css";

import { IonButton, IonContent, IonCol, IonRow, IonText } from "@ionic/react";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const Datepicker = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
    onSelectDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
    onSelectDate(newDate);
  };

  const hapticsImpactMedium = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  return (
    <IonRow class="ion-align-items-center">
      <IonCol size="3" offset="1">
        <IonButton
          fill="clear"
          onClick={() => {
            hapticsImpactMedium();
            handlePrevDay();
          }}
        >
          <ArrowBack style={{ color: "black" }} />
        </IonButton>
      </IonCol>
      <IonCol size="5">
        <IonText>{selectedDate.toDateString()}</IonText>
      </IonCol>
      <IonCol size="3">
        <IonButton
          fill="clear"
          onClick={() => {
            hapticsImpactMedium();
            handleNextDay();
          }}
        >
          <ArrowForward style={{ color: "black" }} />
        </IonButton>
      </IonCol>
    </IonRow>
  );
};

export default Datepicker;
