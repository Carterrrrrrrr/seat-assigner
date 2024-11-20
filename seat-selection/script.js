// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const { initializeApp } = require('firebase-admin/app');
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDT1gMYMrR6iDYBIM8fXX-4Ok0KdJHRvG",
    authDomain: "seat-reservations-49c91.firebaseapp.com",
    projectId: "seat-reservations-49c91",
    storageBucket: "seat-reservations-49c91.appspot.com",
    messagingSenderId: "522725525744",
    appId: "1:522725525744:web:9061c8956634a54e305a35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const events = collection(db, "events");
createEvents(events);

let currentEventCollection = null; // will store the currently selected event's collection

// attach click event listeners after creating event divs
const createEvents = async function(events) {
    const seatsQuery = query(events);
    const querySnapshot1 = await getDocs(seatsQuery);
    let listEvents = [];
    querySnapshot1.forEach((doc) => {
        listEvents.push({
            id: doc.id, // store the document ID to reference the event
            eventName: doc.data().eventName,
            eventDescription: doc.data().eventDescription,
            width: doc.data().width,
            height: doc.data().height
        });
    });
    const divEvents = document.getElementById('divEvents');
    for (let i = 0; i < listEvents.length; i++) {
        const event = listEvents[i];
        const div = document.createElement('div');
        div.textContent = event.eventName;
        div.id = event.id; // use the document ID as the div's ID
        div.className = 'event';
        div.addEventListener('click', () => {
            // update the current event collection and fetch its data
            currentEventCollection = collection(db, event.id);
            eventDetails = {
                eventName: event.eventName,
                eventDescription: event.eventDescription,
                width: event.width,
                height: event.height
            };
            createRoom(); // refresh the seating area for the selected event
        });
        divEvents.appendChild(div);
    }
};


const event = collection(db, "seats"); //"seats" WILL BE WHATEVER EVENT IS CLICKED
const eventDetails = null;

//creates a list of seats as they are listed in firebase
//creates a event details object that hold the title, description, x, and y.
const createSeats = async function(event) {
    //takes a snapshot of all the seats in a certain event
    const seats = query(event);
    const querySnapshot1 = await getDocs(seats);
    let listSeats = [];
    querySnapshot1.forEach((doc) => {
        //pushes seats into the seatlist as objects with certain inforamtion
        listSeats.push({
            id: doc.id,
            seatName: doc.data().seatName,
            price: doc.data().price,
            isReserved: doc.data().isReserved,
            x: doc.data().x,
            y: doc.data().y
        });        
    });
    return sortSeats(listSeats);
}

//sorts the seats list into a 2d array based on position
function sortSeats(listSeats){
    //creates a 2d array based on the width and height of the room
    matrix[eventDetails.height][eventDetails.width] = {}
    for (let i = 0; i < listSeats.length; i++){
        //populates the list based on the x and y of each seat
        matrix[listSeats[i].y][listSeats[i].x] = listSeats[i];
    }
    return matrix
}

//creates div elementes (seats) for each seat in the 2d seat array
export const createRoom = async function(){
    //find the divs to put the seats and information into const
    const seatList = createSeats(event);
    const seatingAreaDiv = document.getElementById('seatingArea');

    //edit the title and description so that it matches the selected event 
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    title.innerHTML(eventDetails.eventName);
    description.innerHTML(eventDetails.eventDescription);

    //loop through the 2d array and create divs for the seats in order
    let i, j;
    for (i = 0; i < seatList.length; i++) {
        for (j = 0; j < seatList[i].length; j++) {
            //create a new div elemenet and 
            const div = document.createElement('div');
            div.textContent = seatList[i].seatName; 
            div.className = 'seat'; // add a seat class to the div
            seatingAreaDiv.appendChild(div);
        }
        //create a div to start a new row
        seatingAreaDiv.appendChild(document.createElement('div'));
        console.log("a new row was created");
    }
}
