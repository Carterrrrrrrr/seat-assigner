// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, doc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

let currentSeatCollection = null; // store the selected event's collection
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
    eventDetails = {
        id: event.id,
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        width: event.width,
        height: event.height,
    };

    sessionStorage.setItem('eventDetails', JSON.stringify(eventDetails));
    window.location.href = 'space.html';
};

// function to create seats
const createSeats = async (event) => {
    try {
        console.log("Fetching seats...");
        const parentDocRef = doc(db, "events", event.id);
        const seatsCollection = collection(parentDocRef, "seats");

        const seatsQuery = query(seatsCollection);
        const querySnapshot = await getDocs(seatsQuery);

        let listSeats = [];
        querySnapshot.forEach((doc) => {
            listSeats.push({
                id: doc.id,
                seatName: doc.data().seatName,
                price: doc.data().price,
                isReserved: doc.data().isReserved,
                x: doc.data().x,
                y: doc.data().y,
            });
        });
        return sortSeats(listSeats);
    } catch (error) {
        console.error("Error fetching seats:" + error);
        return [];
    }
};

// function to sort seats into a 2D array
const sortSeats = (listSeats) => {
    console.log("Sorting seats...");
    const matrix = Array.from({ length: eventDetails.height }, () => Array(eventDetails.width).fill(null));
    listSeats.forEach((seat) => {
        matrix[seat.y][seat.x] = seat;
    });
    return matrix;
};

// funcion to create the room layout
export const createRoom = async () => {

    currentSeatCollection = JSON.parse(sessionStorage.getItem('event')); console.log("event:" + currentSeatCollection);
    eventDetails = JSON.parse(sessionStorage.getItem('eventDetails')); console.log("evName:" + eventDetails.eventName);

    console.log("Creating room...")
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

    // clear the seating area before populating
    seatingAreaDiv.innerHTML = "";

    // create seat divs
    seatList.forEach((row) => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "seat-row";

        row.forEach((seat) => {
            const seatDiv = document.createElement("div");
            seatDiv.textContent = seat ? seat.seatName : "";
            seatDiv.className = seat ? "seat" : "empty-seat";
            rowDiv.appendChild(seatDiv);
        });

        seatingAreaDiv.appendChild(rowDiv);
    });
    console.log("Room created successfully!");
};

