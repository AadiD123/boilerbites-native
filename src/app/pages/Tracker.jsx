import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, 
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, 
  IonFabButton, IonFabList, IonHeader, IonIcon, IonItem, IonItemOption, 
  IonItemOptions, IonItemSliding, IonLabel, IonList, IonListHeader, 
  IonMenuButton, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
  
import React, { useState, useEffect } from 'react';
import { addCircle, arrowBackCircle, key, add, addCircleOutline, timeOutline, folderOpen, calendarOutline, cardOutline } from 'ionicons/icons';
import { Doughnut } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js'; 
import Chart from 'chart.js/auto'; 
import { store } from "../App";

Chart.register(CategoryScale);

const Tracker = () => {
  const [chartData, setChartData] = useState(null);

  const fetchChartData = async () => {
    try {
      const protein = await store.get("Protein");
      const carbs = await store.get("Carbs");
      const fat = await store.get("Fat");

      const data = {
        labels: ['Protein', 'Carbs', 'Fat'],
        datasets: [
          {
            backgroundColor: ['#36a2eb', 'rgba(255,99,132,0.2)', 'rgba(0,99,132,0.2)'],
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [protein, carbs, fat]
          }
        ]
      };

      setChartData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useIonViewWillEnter(() => {
    fetchChartData(); // Fetch data whenever the user navigates to this tab
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Tracker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        {chartData && <Doughnut data={chartData} />}
      </IonContent>
    </IonPage>
  );
};

export default Tracker;
