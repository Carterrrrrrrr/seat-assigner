import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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


export const addItem = async function (eventName, eventDescription, width, height) {
    try {
      const eventDetails = JSON.parse(sessionStorage.getItem('eventDetails'));
      let eventDocRef;
      if (eventDetails && eventDetails.id) {
        // Editing existing event: update event doc and delete old seats
        eventDocRef = doc(db, "events", eventDetails.id);
        await updateDoc(eventDocRef, {
          eventName: eventName,
          eventDescription: eventDescription,
          width: width,
          height: height,
        });
  
        // Delete all old seats
        const seatsCollection = collection(eventDocRef, "seats");
        const seatsSnapshot = await getDocs(seatsCollection);
        const deletePromises = [];
        seatsSnapshot.forEach((seatDoc) => {
          deletePromises.push(deleteDoc(doc(seatsCollection, seatDoc.id)));
        });
        await Promise.all(deletePromises);
        console.log("Old seats deleted.");
      } else {
        // Creating new event
        eventDocRef = await addDoc(collection(db, "events"), {
          eventName: eventName,
          eventDescription: eventDescription,
          width: width,
          height: height,
        });
        console.log("Event Document written with ID: ", eventDocRef.id);
      }
  
      // Upload the seats to firebase
      const gridItems = JSON.parse(sessionStorage.getItem("grid"));
      console.log("Publishing seats...");
      for (let seat of gridItems) {
        try {
          await addDoc(collection(eventDocRef, "seats"), {
            isCheckedIn: false,
            isReserved: false,
            price: seat.price,
            reservationName: "",
            seatName: seat.letter + "" + seat.y+1,
            x: seat.x,
            y: seat.y,
            color: seat.color,
            letter: seat.letter
          });
        } catch (e) {
          console.error("Error adding seat to database: ", e);
        }
      }
    } catch (e) {
      console.error("Error adding item to database: ", e);
    }
  };


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
const selectEvent = async (event) => {
    let eventDetails = {
        id: event.id,
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        width: event.width,
        height: event.height,
    };

    sessionStorage.setItem('eventDetails', JSON.stringify(eventDetails));
    window.location.href = 'editor.html';
};

// Helper to create a seat DOM element and object, and set up click handler
function createSeatElement(seat, gridItems) {
    const gridItemElement = document.createElement("div");
    gridItemElement.className = "grid-item";
    gridItemElement.style.backgroundColor = seat.color;
    // Set border color based on color
    if (seat.color === "white") {
        gridItemElement.style.borderColor = "white";
    } else {
        gridItemElement.style.borderColor = "black";
    }
    // Attach click handler for editing
    gridItemElement.addEventListener("click", () => {
        // Use the same logic as creator.js's changeColor
        const selectedColor = document.getElementById('color-select').value;
        gridItemElement.style.backgroundColor = selectedColor;
        if (selectedColor === "white") {
            gridItemElement.style.borderColor = "white";
        } else {
            gridItemElement.style.borderColor = "black";
        }
        seat.color = selectedColor;
        if (selectedColor === "yellow") {
            seat.price = 15;
        } else if (selectedColor === "brown") {
            seat.price = 10;
        } else {
            seat.price = null;
        }
        // Update session storage for all seats
        sessionStorage.setItem("grid", JSON.stringify(gridItems.map(seat => ({
            x: seat.x,
            y: seat.y,
            seatName: seat.letter + "" + seat.y,
            color: seat.color,
            price: seat.price,
            letter: seat.letter
        }))));
    });
    seat.element = gridItemElement;
    return seat;
}

// take the seats, name and description and load it out.
export const loadEventData = async () => {
    const eventDetails = JSON.parse(sessionStorage.getItem('eventDetails'));
    if (!eventDetails) {
        console.error("No event selected.");
        return;
    }
    document.getElementById('event-d').value = eventDetails.eventName;
    document.getElementById('event-c').value = eventDetails.eventDescription;
    document.getElementById('grid-w').value = eventDetails.width;
    document.getElementById('grid-h').value = eventDetails.height;

    const eventDocRef = doc(db, "events", eventDetails.id);
    const seatsCollection = collection(eventDocRef, "seats");
    const querySnapshot = await getDocs(seatsCollection);

    let gridItems = [];

    querySnapshot.forEach((doc) => {
        const seatData = doc.data();

        gridItems.push({
            id: doc.id, 
            color: seatData.color,
            x: seatData.x,
            y: seatData.y,
            price: seatData.price,
            seatName: seatData.seatName, 
            letter: seatData.letter 
        });
    });

    //Sort the seats into the right order
    gridItems.sort((a, b) => {
        const numA = parseInt(a.seatName.slice(1)); 
        const numB = parseInt(b.seatName.slice(1));
    
        if (numA !== numB) {
            return numA - numB; 
        }
        return a.letter.localeCompare(b.letter); 
    });

    document.getElementById("grid-container").innerHTML = ""; 
    // Create DOM elements and attach handlers
    gridItems = gridItems.map(seat => createSeatElement(seat, gridItems));
    gridItems.forEach(seat => {
        document.getElementById("grid-container").appendChild(seat.element);
    });

    sessionStorage.setItem("grid", JSON.stringify(gridItems.map(seat => ({
        x: seat.x,
        y: seat.y,
        seatName: seat.letter + "" + seat.y,
        color: seat.color,
        price: seat.price,
        letter: seat.letter
    }))));
    document.getElementById("grid-container").style.gridTemplateColumns = `repeat(${eventDetails.width}, 1fr)`;
    initializeDragSelect(gridItems);
};

// Expose a function to allow drag select to work with loaded seats
function initializeDragSelect(gridItems) {
    if (typeof DragSelect === "undefined") return;
    const ds = new DragSelect({
        selectables: document.querySelectorAll(".grid-item"),
        area: document.querySelector('#grid-container')
    });

    ds.subscribe("DS:end", ({ items }) => {
        const selectedColor = document.getElementById('color-select').value;
        items.forEach(item => {
            const seat = gridItems.find(seat => seat.element === item);
            if (seat) {
                seat.element.style.backgroundColor = selectedColor;
                seat.color = selectedColor;
                if (selectedColor === "white") {
                    seat.element.style.borderColor = "white";
                } else {
                    seat.element.style.borderColor = "black";
                }
                if (selectedColor === "yellow") {
                    seat.price = 15;
                } else if (selectedColor === "brown") {
                    seat.price = 10;
                } else {
                    seat.price = null;
                }
            }
        });
        sessionStorage.setItem("grid", JSON.stringify(gridItems.map(seat => ({
            x: seat.x,
            y: seat.y,
            seatName: seat.letter + "" + seat.y,
            color: seat.color,
            price: seat.price,
            letter: seat.letter
        }))));
    });
}

export const checkIn = () => {
    console.log("HIT")
    const eventDetails = JSON.parse(sessionStorage.getItem('eventDetails'));
    console.log(eventDetails.eventName);
    console.log(window.location.pathname + "/checkin/index.html?event=" + eventDetails.eventName);
    //window.location = "/checkin/index.html?event=" + eventDetails.eventName;
    window.location = "https://carterrrrrrrr.github.io/seat-assigner/checkin/index.html?event=" + eventDetails.eventName;
    //window.open(window.location.hostname + "/checkin/index.html?event=" + eventDetails.eventName);
};