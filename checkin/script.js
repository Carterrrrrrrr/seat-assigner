// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, setDoc} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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
const eventsCollection = collection(db, "events");


//returns a list of seats with the information
//id
//reservationName
//seatName
//price
//isReserved
//isCheckedIn
//isSelected
//returns a list of seat objects for the inputed partyName and selected event
export const getSeats = async function(partyName) {
    //gets seats from the selected event from firebase which are reserved to the partyName in the parameter using a query
    const parentDocRef = doc(db, "events", document.getElementById("events").value);
    var theSeats = collection(parentDocRef, "seats");
    const theSeatsForParty = query(theSeats, where("reservationName", "==", partyName));
    const querySnapshot1 = await getDocs(theSeatsForParty);
    //stores the seats on local objects and stores them in a list called "partySeats" which is returned
    let partySeats = [];
    querySnapshot1.forEach((doc) => {
        //Adding attributes to each seat object
        partySeats.push({
            id: doc.id, //store the document ID 
            reservationName: doc.data().reservationName, //store the name of the person who reserved the seat (string)
            seatName: doc.data().seatName, //store the seat name (string)
            price: doc.data().price, //store the price (int)
            isReserved: doc.data().isReserved, //store if the seat is reserved (boolean)
            isCheckedIn: doc.data().isCheckedIn //store if the seat is checked in (boolean)
        });
    });
    return partySeats;
}


//same thing as getSeats but doesn't take into account a parameter and returns all of the seats in an event
export const getAllSeats = async function() {
    //gets all of the seats from the selected event from firebase 
    const parentDocRef = doc(db, "events", document.getElementById("events").value);
    var theSeats = collection(parentDocRef, "seats");
    const querySnapshot1 = await getDocs(theSeats);
    let partySeats = [];
    //stores the seats on local objects and stores them in a list called "partySeats" which is returned
    querySnapshot1.forEach((doc) => {
        // Adding attributes to each seat object
        partySeats.push({
            id: doc.id, //store the document ID
            reservationName: doc.data().reservationName, //store the name of the person who reserved the seat (string)
            seatName: doc.data().seatName, //store the seat name (string)
            price: doc.data().price, //store the price (int)
            isReserved: doc.data().isReserved, //store if the seat is reserved (boolean)
            isCheckedIn: doc.data().isCheckedIn //store if the seat is checked in (boolean)
        });
    });
    return partySeats;
}  


//returns "theNames" a list of all of the reservation names in the selected event alphabetically sorted
export const getAllNames = async function() {
    //stores all seats from the selected event on the variable "seats"
    var seats = await getAllSeats();
    //loops through every all of the seats and stores the reservation names in the list called "theNames" if the name isn't already in the list and isn't empty - eventually returning all of the reservation names
    let theNames = [];
    seats.forEach(seat => {
        if(!seat.reservationName == ""){
            if(!theNames.includes(seat.reservationName)){
                theNames.push(seat.reservationName);
            }
        }
    })
    //alphabetically sorts the list "theNames"
    theNames.sort();
    return theNames;
}


//this is past code no longer being used:
//event fires when button is clicked
//if the seat is avalible and marked it becomes unavalible
// export const checkIn = async function () {
//     // .log("rlly");console
//     // event.preventDefault();
//     const theSeatsForParty = query(theSeats, where("reservationName", "==", partyName));
//     const querySnapshot1 = await getDocs(theSeatsForParty);
//     for (let i = 0; i < seats.length; i++){
//         // console.log("why");
//         if (seats[i].isSelected && !seats[i].isCheckedIn) {
//             //seats[i].isCheckedIn = true;
//             const itemToComplete = doc(db, "seats", seats[i].id);
//             await updateDoc(itemToComplete, {
//                 isCheckedIn: true
//             });
//         }
//     }
//     // window.location.href = 'index.html';
//     // console.log(seats);
// }


//this is not used but later it might be useful
export const goToCheckIn = async function () {
    const seats = await getSeats(document.getElementById('partyName').value);
    console.log(seats);
    const containerToCheck = document.getElementById('divToCheck');
    const containerChecked = document.getElementById('divChecked');
    //resets buttons
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
        //maybe remove async function
        div.addEventListener('click', async function() {
            seat.isCheckedIn = !seat.isCheckedIn;
            if (seat.isCheckedIn == true){
                containerChecked.appendChild(div);
            } else{
                containerToCheck.appendChild(div);
            }
            //change this
            const parentDocRef = doc(db, "events", document.getElementById("events").value);
            var seatToCheckIn = doc(parentDocRef, "seats", seat.id);
            console.log(seatToCheckIn.id);
            await updateDoc(seatToCheckIn, {
                isCheckedIn: seat.isCheckedIn
            });
        });  
        // append the new div to the container
        if (seat.isCheckedIn == true){
            containerChecked.appendChild(div);
        } else{
            containerToCheck.appendChild(div);
        }
    });
}


// fucnction to create event elements
// I want to incorporate a for loop - looping through events and adding them to event drop down
// I want to return a locally stored list
export const createEvents = async function(){
    try {
        //returns all of the event objects from fire base
        const eventsQuery = query(eventsCollection);
        const querySnapshot = await getDocs(eventsQuery);
        let listEvents = [];
        //puting the firebase events into local objects into a list called "listEvents"
        querySnapshot.forEach((doc) => {
            listEvents.push({
                id: doc.id, // store the document ID
                eventName: doc.data().eventName, // store the event name (string)
            });
        });
        //loops through all of the events in "listEvents" and adds all of the events to a html select input so the user can select which event they would like to check in seats on
        var x = document.getElementById("events");
        for (const event of listEvents) {
            if(!event.eventName == ""){
                var option = document.createElement("option");
                option.innerHTML = event.eventName;
                option.value = event.id;
                x.appendChild(option);
            }
        }
        console.log("Events created successfully!");
        return listEvents;
    } catch (error) {
        console.error("Error fetching events:" + error);
    }
}


//generates the names and seat divs that show up below the name filter text input
export const generateNames = async function(){
    //get the div (names) in which the names and seat divs will be added to
    const namesDiv = document.getElementById('names');
    //empty the names
    namesDiv.innerHTML = "";
    //if the value of the event drop down is nothing when either there is an event with no name the option events is selcted then console.log an error message
    if (document.getElementById("events").value == ""){
        return "nothing selected bruh";
    } else{
        //gets all the party names that have reserved seats and include the text within the name filter input in the name
        const theNames = await filterNames();
        //looping through every single party that has had reserved seats
        theNames.forEach(async name => {
            //adds the names from the variable "theNames" to the names div
            const partyDiv = document.createElement('div');
            namesDiv.appendChild(partyDiv);
            partyDiv.className = "partyDiv";
            partyDiv.textContent = name + ":  \n ";
            //gets the reserved seats objects for each name in the variable "theNames" and puts them into the variable "seats"
            var seats = await getSeats(name);
            //looping through reserved seats in the variable "seats"
            seats.forEach(seat => {
                // adds a div next to each party name in the names div that says the name of the seat and that you can also press on and it changes from green if isCheckedIn is true and red if isCheckedIn is false by updating the CSS class between the "buttonOn" and "buttonOff"
                const div = document.createElement('div');
                div.textContent = seat.seatName;
                if(seat.isCheckedIn == true){
                    div.setAttribute('class', 'buttonOn');
                } else{
                    div.setAttribute('class', 'buttonOff');
                }
                //every time the seat divs are clicked they change colors and update the fire base.
                div.addEventListener('click', async function() {
                    seat.isCheckedIn = !seat.isCheckedIn;
                    //div class changing 
                    if (seat.isCheckedIn == true){
                        div.setAttribute('class', 'buttonOn');
                    } else{
                        div.setAttribute('class', 'buttonOff');
                    }
                    const parentDocRef = doc(db, "events", document.getElementById("events").value);
                    var seatToCheckIn = doc(parentDocRef, "seats", seat.id);
                    await updateDoc(seatToCheckIn, {
                        isCheckedIn: seat.isCheckedIn
                    });
                });  
            partyDiv.appendChild(div);
            });
        });
    }

}


//filters the names accordingly to the name filter text box and returns a list of them
export const filterNames = async function(){
    //get all of the party names that have reservations
    const theNames = await getAllNames();
    //if their is nothing in the name filter text input than return all of the Names
    if(document.getElementById("fName").value == ""){
        return theNames;
        //if not loop through all of the names adding the ones that contain what is in the name filter text box to the list "names" which will eventually be returned 
    } else{
        let names = [];
        theNames.forEach(async name => {
            if(name.toLowerCase().includes(document.getElementById("fName").value.toLowerCase())){
                names.push(name);
            }
        });
        return names;
    } 
}
