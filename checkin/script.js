// Import Firebase
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, sendEmailVerification} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
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
const auth = getAuth(app);

let event = null;
const user = null;

export const linkEvent = async function(){
    console.log("Linking Event...");
    //let queryString = window.location.search;
    let queryString = "http://ASDADS.org/checkin/index.html/?event=KIKI%20AY";
    queryString = queryString.substring(queryString.indexOf('?'), queryString.length);
    const urlParams = new URLSearchParams(queryString);
    let linkedEvent = urlParams.get('event');
    console.log("event: " + linkedEvent);
    sessionStorage.setItem('linkedEvent', linkedEvent);
}

//Email must exist and be real
//password must be at least 6 charaters
export const signUp = async function (email, password){
  console.log("signUp");
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    sessionStorage.setItem('userEmail', user.email);
    window.location.href = 'checkIn.html';
    sendEmailVerification(auth.currentUser)
        .then(() => {
            // Email verification sent!
            // TODO: ADD CODE THAT TELLS USER TO VERRIFY EMAIL!
        });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}

//login function for submit button
export const login = function (email, password){
  console.log("login")
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user
      sessionStorage.setItem('userEmail', user.email);
      window.location.href = 'checkIn.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

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
    const parentDocRef = doc(db, "events", event.id);
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
    const parentDocRef = doc(db, "events", event.id);
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

// fucnction to create event elements
// I want to incorporate a for loop - looping through events and adding them to event drop down
// I want to return a locally stored list
export const createEvents = async function(){
    try {
        let linkedEvent = sessionStorage.getItem('linkedEvent')
        document.getElementById("currentEvent").innerHTML = linkedEvent;
        console.log("EMAIL: " + sessionStorage.getItem('userEmail'));
        const eventsQuery = query(
        eventsCollection,
        where("eventName", "==", linkedEvent),
        where("checkInUsers", "array-contains", sessionStorage.getItem('userEmail')) //user must be logined in to see seats
        ); //returns all of the event objects from fire base
        const querySnapshot = await getDocs(eventsQuery);
        //puting the firebase events into local objects into a list called "listEvents"
        if (querySnapshot.empty) {
            document.getElementById("error").innerHTML = "either you are not allowed to check in seats for this event or no seats are reserved yet"
        }
        querySnapshot.forEach((doc) => {
            event = {id: doc.id, eventName: doc.data().eventName}
        });
        generateNames()

        console.log("Events created successfully!");
        return event;
    } catch (error) {
        console.error("Error fetching events: " + error);
    }
}


//generates the names and seat divs that show up below the name filter text input
export const generateNames = async function(){
    //get the div (names) in which the names and seat divs will be added to
    const namesDiv = document.getElementById('names');
    //empty the names
    namesDiv.innerHTML = "";
    //if the value of the event drop down is nothing when either there is an event with no name the option events is selcted then console.log an error message
    if (event == ""){
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
            partyDiv.textContent = name + ": ";
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
                    const parentDocRef = doc(db, "events", event.id);
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