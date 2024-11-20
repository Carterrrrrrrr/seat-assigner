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
export const addItem = async function(eventName, eventDescription, wdith, height ) {
    try {
      const docRef = await addDoc(collection(db, "seats"), {
        EventName: eventName,
        EventDescription: eventDescription,
        width: wdith,
        height: height,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding item to database: ", e);
    }
    document.getElementById("newItem").value = "";
  }

  async function addDocument() {
    try {
      const docRef = await addDoc(newCollectionRef, {
        field1: "value1",
        field2: "value2",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  
  addDocument();

//add the seats to firebase
export const addseats = async function(arrays){
  console.log("check");
  for (let i = 0; i < width * height; i++) {
    try{
      const docRef = await addDoc(collection(db, "seats"), {
        isCheckedin: false,
        isReserved: false,
        price: seat.price,
        reservationName: "",
        seatName: "",
        x: seat.x,
        y: seat.y,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding item to database: ", e);
  } 
    document.getElementById("newItem").value = "";
  } 
}