// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Your web app's Firebase configuration
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

// // NOT WORKING
// db.listCollections()
//   .then(snapshot=>{
//       snapshot.forEach(snaps => {
//         console.log(snaps["_queryOptions"].collectionId); // LIST OF ALL COLLECTIONS
//       })
//   })
//   .catch(error => console.error(error));

// const eventsDiv = document.getElementById('divEvents');
// if(LIST-OF-COLLECTIONS.length == 0){
//     const div = document.createElement('div');
//     div.textContent = "there are currently no Events";
// } else {
//     LIST-OF-COLLECTIONS.forEach(collection => {
//         // create a new div element
//         const div = document.createElement('div');
    
//         // set the content of the div
//         div.textContent = collection; 
//         div.className = 'button'; // add a class to the div
//         });  
// }
// containerChecked.appendChild(div);

const event = collection(db, "seats"); //"seats" WILL BE WHATEVER EVENT IS CLICKED

createRoom(event);

export const createRoom = async function(event) {
    const seats = query(event);
    const querySnapshot1 = await getDocs(seats);
    let listSeats = [];
    querySnapshot1.forEach((doc) => {
        // Adding doc.id to each seat object
        listSeats.push({
            id: doc.id,
            reservationName: doc.data().reservationName,
            seatName: doc.data().seatName,
            price: doc.data().price,
            isReserved: doc.data().isReserved,
            isCheckedIn: doc.data().isCheckedIn
        });
    });
    return listSeats;
}
