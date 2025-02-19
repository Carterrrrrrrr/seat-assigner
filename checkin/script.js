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
const theSeats = collection(db, "seats");

//returns a list of seats with the information
//id
//reservationName
//seatName
//price
//isReserved
//isCheckedIn
//isSelected
div.addEventListener('click', function() {
    if (div.classList.contains('on')) {
        div.classList.remove('on'); // Remove 'on' class
        div.classList.add('off'); // Add 'off' class
        seat.isSelected = false;
        //console.log(seat + ' is off');
    } else {
        div.classList.remove('off'); // Remove 'off' class
        div.classList.add('on'); // Add 'on' class
        seat.isSelected = true;
        //console.log(seat + ' is on');
    }
});  

export const getSeats = async function(partyName) {
    console.log(partyName);
    const theSeatsForParty = query(theSeats, where("reservationName", "==", partyName));
    const querySnapshot1 = await getDocs(theSeatsForParty);
    let partySeats = [];
    querySnapshot1.forEach((doc) => {
        // Adding doc.id to each seat object
        partySeats.push({
            id: doc.id,
            reservationName: doc.data().reservationName,
            seatName: doc.data().seatName,
            price: doc.data().price,
            isReserved: doc.data().isReserved,
            isCheckedIn: doc.data().isCheckedIn
        });
    });
    return partySeats;
    
}


//event fires when button is clicked
//if the seat is avalible and marked it becomes unavalible
export const checkIn = async function () {
    console.log("rlly");
    // event.preventDefault();
    for (let i = 0; i < seats.length; i++){
        console.log("why");
        if (seats[i].isSelected && !seats[i].isCheckedIn) {
            //seats[i].isCheckedIn = true;
            const itemToComplete = doc(db, "seats", seats[i].id);
            await updateDoc(itemToComplete, {
                isCheckedIn: true
            });
        }
    }
    // window.location.href = 'index.html';
    console.log(seats);
}

export const goToCheckIn = async function () {
    const seats = await getSeats(document.getElementById('partyName').value);
    console.log(seats[0].seatName);
    // event.preventDefault();
    // window.location.href = 'checkin.html';
    //const seats = [{seatName:'seat 1', isSelected: false, isCheckedIn: true}, {seatName:'seat 2', isSelected: false, isCheckedIn: false}, {seatName:'seat 3', isSelected: false, isCheckedIn: false}];
    // get the container where the divs will be added
    console.log("what da flip");
    const containerToCheck = document.getElementById('divToCheck');
    const containerChecked = document.getElementById('divChecked');
    containerToCheck.innerHTML = "";
    containerChecked.innerHTML = "";
    // loop through the seats found (ALEX)
    // create a button for each object and sort it into checked in or avalible
    seats.forEach(seat => {
        // create a new div element
        const div = document.createElement('div');

        // set the content of the div
        div.textContent = seat.seatName; 
        div.className = 'button'; // add a class to the div

        // Add click event listener to the div
        
        // append the new div to the container
        if (seat.isCheckedIn == true){
            containerChecked.appendChild(div);
        } else{
            containerToCheck.appendChild(div);
        }
    });
}

