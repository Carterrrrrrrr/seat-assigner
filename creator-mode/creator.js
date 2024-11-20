document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const generateButton = document.getElementById('generate-grid');
    var gridItems = []; // Array to store grid item objects
//set up an eventlistener and wait when the waits until the HTML document is fully loaded and parsed before executing the script.
//have constants that is the gridcontainer and the generatebutton. 
    generateButton.addEventListener('click', () => {
        const gridWidth = parseInt(document.getElementById('grid-w').value);
        const gridHeight = parseInt(document.getElementById('grid-h').value);
        createGrid(gridWidth, gridHeight);
        
    });
//when the button is clicked the eventlitener is taking the value of the wdith and height and convert it to integars
//and put the values in the creatgrid function
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
                color: null, // Default color is null or you can set a default color
                x: i%width,// Position in the grid
                y: i/width,
                price: null, 
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

    function changeColor(seat) {
        const selectedColor = document.getElementById('color-select').value;
        seat.element.style.backgroundColor = selectedColor;
        seat.color = selectedColor; // Update the color property of the object
        if(selectedColor = "yellow"){
            seat.price = 15;
        }else if(selectedColor = "brown"){
            seat.price = 10;
        }else{
            seat.price = null; 
        }
    }

    
});

