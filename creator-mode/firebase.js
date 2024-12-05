import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDT1gMYMrR6iDYBIM8fXX-4Ok0KdJHRvG0",
    authDomain: "seat-reservations-49c91.firebaseapp.com",
    projectId: "seat-reservations-49c91",
    storageBucket: "seat-reservations-49c91.appspot.com",
    messagingSenderId: "522725525744",
    appId: "1:522725525744:web:9061c8956634a54e305a35"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//add the name and description to firebase
export const addItem = async function (eventName, eventDescription, width, height) {
  try {
    // Create a document in the "events" collection
    const eventDocRef = await addDoc(collection(db, "events"), {
      eventName: eventName,
      eventDescription: eventDescription,
      width: width,
      height: height,
    });

    console.log("Event Document written with ID: ", eventDocRef.id);

    const gridItems = JSON.parse(sessionStorage.getItem("grid"));
    console.log("Publishing seats...");
    for (let seat of gridItems) {
      try {
        const seatRef = await addDoc(collection(eventDocRef, "seats"), {
          isCheckedin: false,
          isReserved: false,
          price: seat.price,
          reservationName: "",
          seatName: "",
          x: seat.x,
          y: seat.y,
        });
        console.log("Seat Document written with ID: ", seatRef.id);
      } catch (e) {
        console.error("Error adding seat to database: ", e);
      }
    }
  } catch (e) {
    console.error("Error adding item to database: ", e);
  }
};