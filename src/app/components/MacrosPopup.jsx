// import { useState, useEffect, useRef } from "react";
// import { styled } from "@mui/material/styles";
// import Dialog from "@mui/material/Dialog";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
// import {
//   IonButton,
//   IonModal,
//   IonHeader,
//   IonContent,
//   IonToolbar,
//   IonTitle,
//   IonPage,
//   IonList,
//   IonItem,
//   IonLabel,
//   IonIcon,
// } from "@ionic/react";

// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialogContent-root": {
//     padding: theme.spacing(2),
//   },
//   "& .MuiDialogActions-root": {
//     padding: theme.spacing(1),
//   },
// }));

// const PopupContent = styled(IonContent)({
//   padding: "16px",
// });

// const PopupHeader = styled(IonCard)({
//   background: "#007bff",
//   color: "#fff",
//   padding: "16px",
// });

// export default function MacrosPopup(props) {
//   const [open, setOpen] = useState(props.popUp);
//   const [info, setInfo] = useState([]);

//   useEffect(() => {
//     fetchInfo();
//   }, []);

//   const fetchInfo = () => {
//     fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dishes/${props.dishId}/`)
//       .then((response) => response.json())
//       .then((data) => {
//         setInfo(data);
//       });
//   };

//   const modal = useRef < HTMLIonModalElement > null;

//   function dismiss() {
//     modal.current?.dismiss();
//   }

//   return (
//     <IonModal id="example-modal" ref={modal} trigger="open-custom-dialog">
//       <div className="wrapper">
//         <h1>{props.dish}</h1>

//         <IonList lines="none">
//           <IonItem button={true} detail={false} onClick={dismiss}>
//             <IonIcon icon={personCircle}></IonIcon>
//             <IonLabel>Item 1</IonLabel>
//           </IonItem>
//           <IonItem button={true} detail={false} onClick={dismiss}>
//             <IonIcon icon={personCircle}></IonIcon>
//             <IonLabel>Item 2</IonLabel>
//           </IonItem>
//           <IonItem button={true} detail={false} onClick={dismiss}>
//             <IonIcon icon={personCircle}></IonIcon>
//             <IonLabel>Item 3</IonLabel>
//           </IonItem>
//         </IonList>
//       </div>
//     </IonModal>
//   );
// }
