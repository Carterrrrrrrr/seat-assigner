// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, doc, updateDoc} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDT1gMYMrR6iDYBIM8fXX-4Ok0KdJHRvG0",
    authDomain: "seat-reservations-49c91.firebaseapp.com",
    projectId: "seat-reservations-49c91",
    storageBucket: "seat-reservations-49c91.appspot.com",
    messagingSenderId: "522725525744",
    appId: "1:522725525744:web:9061c8956634a54e305a35",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let eventDetails = null; // details of the selected event

// fucnction to create event elements
export const createEvents = async () => {
    try {
        console.log("Fetching events...");
        const eventsCollection = collection(db, "events");
        const eventsQuery = query(eventsCollection);
        const querySnapshot = await getDocs(eventsQuery);

        let listEvents = [];
        querySnapshot.forEach((doc) => {
            listEvents.push({
                id: doc.id, // Store the document ID
                eventName: doc.data().eventName,
                eventDescription: doc.data().eventDescription,
                width: doc.data().width,
                height: doc.data().height,
            });
        });

        // make the event list on the page
        const divEvents = document.getElementById("divEvents");
        if (!divEvents) {
            console.error("divEvents not found in the DOM.");
            return;
        }
        listEvents.forEach((event) => {
            const div = document.createElement("div");
            if (event.eventName) {
                div.textContent = event.eventName;
            } else {div.textContent = "UNKNOWN"}
             // display the event name
            div.id = event.id; // use the document ID as the div's ID
            div.classList.add("event"); // add the 'event' class for styling
            div.addEventListener("click", () => selectEvent(event)); // attack click event listener
            divEvents.appendChild(div);
        });
        console.log("Events created successfully!");
    } catch (error) {
        console.error("Error fetching events:" + error);
    }
};

// function to select an event and update the UI
const selectEvent = (event) => {
    //save event details as object
    eventDetails = {
        id: event.id,
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        width: event.width,
        height: event.height,
    };

    sessionStorage.setItem('eventDetails', JSON.stringify(eventDetails)); //save event details
    window.location.href = 'space.html';
};

// function to create seats
const createSeats = async (event) => {
    try {
        console.log("Fetching seats...");
        console.log(event);

        //accsess subcollection docs
        const parentDocRef = doc(db, "events", event.id);
        const seatsCollection = collection(parentDocRef, "seats");

        const seatsQuery = query(seatsCollection);
        const querySnapshot = await getDocs(seatsQuery);

        // make list of seat objects
        let listSeats = [];
        querySnapshot.forEach((doc) => {
            listSeats.push({
                id: doc.id,
                seatName: doc.data().seatName,
                price: doc.data().price,
                isReserved: doc.data().isReserved,
                reservationName: doc.data().reservationName,
                x: doc.data().x,
                y: doc.data().y,
                color: doc.data().color
            });
        });
        return sortSeats(listSeats);
    } catch (error) {
        console.error("Error fetching seats: " + error);
        return [];
    }
};

// function to sort seats into a 2D array
const sortSeats = (listSeats) => {
    console.log("Sorting seats...");
    const matrix = Array.from({ length: eventDetails.height }, () => Array(eventDetails.width).fill(null));
    listSeats.forEach((seat) => {
        if (seat.y != null && seat.x != null){
            matrix[seat.y][seat.x] = seat;
            console.log("what da flip!");
        } else{
            console.log("why is this null");  
        }
    });
    console.log(matrix);
    return matrix; //2D array of seats in position
};

// funcion to create the room layout
export const createRoom = async () => {
    eventDetails = JSON.parse(sessionStorage.getItem('eventDetails')); console.log("evName:" + eventDetails.eventName);
    console.log("Creating room...");
    if (!eventDetails.id) {
        console.error("No event selected.");
        return;
    }
    const seatList = await createSeats(eventDetails);

    const seatingAreaDiv = document.getElementById("seatingArea");
    const title = document.getElementById("title");
    const description = document.getElementById("description");

    if (!seatingAreaDiv || !title || !description) {
        console.error("Required DOM elements not found.");
        return;
    }

    // update event details
    title.innerHTML = eventDetails.eventName;
    description.innerHTML = eventDetails.eventDescription;
    //console.log(seatList);
    // clear the seating area before populating
    seatingAreaDiv.innerHTML = "";
    // create seat divs
    seatList.forEach((row) => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "seat-row";
        row.forEach((seat) => {
            const seatDiv = document.createElement("div");
            // Check if the seat exists
            if (seat) {
                // Use seat.seatName if available, otherwise default to '*'
                seatDiv.textContent = seat.seatName || "*";
                if(seat.price){
                    if(seat.isReserved){
                        seatDiv.className = "occupied-seat"
                    }else{
                        seatDiv.className = "available-seat"
                        seatDiv.addEventListener("click", () => selectSeat(seatDiv, seat)); // attach click event listener
                    }
                }else if(seat.color === "white"){
                    seatDiv.textContent = "";
                    seatDiv.className = "empty-seat";
                } else{
                    seatDiv.textContent = "+";
                    seatDiv.className = "stage-seat";
                }
            } else {
                // For empty seats
                seatDiv.textContent = "";
                seatDiv.className = "empty-seat";
            }
            rowDiv.appendChild(seatDiv);
        });

        seatingAreaDiv.appendChild(rowDiv);
    });
    console.log("Room created successfully!");
};

let totalPrice = 0;
let selectedSeats = [];
// funcion for when seats are clicked 
const selectSeat = (seatDiv, seat) => {
    if(!selectedSeats.includes(seat)){
        totalPrice += seat.price;
        selectedSeats.push(seat);
        seatDiv.className = "selected-seat";
    } else {
        totalPrice -= seat.price;
        selectedSeats.splice(selectedSeats.indexOf(seat), 1);
        seatDiv.className = "available-seat";
    }
    sessionStorage.setItem('totalPrice', totalPrice)
    sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
}

// fucntion to change to checkout page + set up
export const checkOutButton = () => {
    window.location.href = 'checkout.html';
}

// set up checkout page when loaded
export const checkOut = () => {    
    totalPrice = Number(sessionStorage.getItem('totalPrice'));
    const totalText = document.getElementById("total");
    console.log(totalPrice);
    totalText.innerHTML = "Total: $" + totalPrice;
}

// function to mark seats as reserved with a reservation name
export const confirmPurchase = () => {
    let selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats')); 
    const event = JSON.parse(sessionStorage.getItem('eventDetails')); 
    const reservationName = document.getElementById("name").value;
    const code = document.getElementById("code").value;

    if (code == 123){
        selectedSeats.forEach(async (seat) => {
            const parentDocRef = doc(db, "events", event.id);
            var seatToRes = doc(parentDocRef, "seats", seat.id);
            console.log(seatToRes.id);
            await updateDoc(seatToRes, {
                reservationName: reservationName,
                isReserved: true
            });
        });
    }
    console.log("DONE");
}
