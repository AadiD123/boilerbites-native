import React from 'react';

export default function Location(props) {
  return (<IonItem routerLink="/earhart">
  <IonThumbnail slot="start">
    <img alt="Earhart" src="/assets/Earhart.png" />
  </IonThumbnail>
  <IonLabel>Earhart</IonLabel>
</IonItem>);
}