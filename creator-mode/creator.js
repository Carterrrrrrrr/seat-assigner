
export let gridItems = [];

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const generateButton = document.getElementById('generate-grid');
    gridItems = []; 
// Array to store grid item objects
//set up an eventlistener and wait when the waits until the HTML document is fully loaded and parsed before executing the script.
//have constants that is the gridcontainer and the generatebutton. 
    generateButton.addEventListener('click', () => {
        const gridWidth = parseInt(document.getElementById('grid-w').value);
        const gridHeight = parseInt(document.getElementById('grid-h').value);
        createGrid(gridWidth, gridHeight);
        initializeDragSelect();
    });
//when the button is clicked the eventlitener is taking the value of the wdith and height and convert it to integars
//and put the values in the creatgrid function



//this function will take the x value and convert it to a Alphabet
    function numberToLetters(num) {
        let result = "";
        while (true) {
            result = String.fromCharCode((num % 26) + 65) + result;
            num = Math.floor(num / 26) - 1; 
            if (num < 0) break;
        }
        return result;
    }


    function createGrid(width, height) {
        // Clear existing grid items and reset array
        gridContainer.innerHTML = '';
        gridItems = [];
//will generate each block for w*h times and each block will be assigned a click event listener to change its color when clicked, 
//and is then appended to the grid container.
        for (let i = 0; i < width * height; i++) {
            const gridItemElement = document.createElement('div');
            gridItemElement.className = 'grid-item';

            // Create an object to represent the grid item
            const seat = {
                element: gridItemElement,
                color: null, 
                x: i % width,  
                y: Math.floor(i / width),
                price: null,
                letter: numberToLetters(i % width)
            };

            // Add event listener to change color on click
            gridItemElement.addEventListener('click', () => changeColor(seat));

            // Append the grid item to the container
            gridContainer.appendChild(gridItemElement);
            gridItems.push(seat); // Add the item object to the array

        }

        // Update CSS grid-template-columns to fit the new grid size
        gridContainer.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    }

    // change the color and set price
function changeColor(seat) {
    const selectedColor = document.getElementById('color-select').value;
    seat.element.style.backgroundColor = selectedColor;

    console.log(`Changing color to: ${selectedColor} for seat at (${seat.letter}, ${seat.y})`);

    seat.color = selectedColor; 

    if (selectedColor === "yellow") {
        seat.price = 15;
    } else if (selectedColor === "brown") {
        seat.price = 10;
    } else {
        seat.price = null;
    }

    console.log(`Seat updated - Color: ${seat.color}, Price: ${seat.price}`);

    // iterate each seat and store it in the session storage
    sessionStorage.setItem("grid", JSON.stringify(gridItems.map(seat => ({
        x: seat.x,
        y: seat.y,
        seatName: seat.letter + "" + seat.y,  
        color: seat.color,
        price: seat.price,
        letter: seat.letter 
    }))));
    
}

function initializeDragSelect() {
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

                if (selectedColor === "yellow") {
                    seat.price = 15;
                } else if (selectedColor === "brown") {
                    seat.price = 10;
                } else {
                    seat.price = null;
                }

                console.log(`Seat updated - Color: ${seat.color}, Price: ${seat.price}`);
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
});

