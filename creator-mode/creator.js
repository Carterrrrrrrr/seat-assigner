import { db, addBlock, addEventDetails } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const generateButton = document.getElementById('generate-grid');

    // Array to store grid block objects
    const gridBlocks = [];

    generateButton.addEventListener('click', () => {
        const gridWidth = parseInt(document.getElementById('grid-width').value);
        const gridHeight = parseInt(document.getElementById('grid-height').value);
        createGrid(gridWidth, gridHeight);
    });

    function createGrid(width, height) {
        // Clear any existing grid items before generating a new one
        gridContainer.innerHTML = '';
        gridBlocks.length = 0;

        // Set the CSS grid template to fit the new width
        gridContainer.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

        // Create grid items (blocks)
        for (let i = 0; i < width * height; i++) {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.style.backgroundColor = "white";  // Default color

            // Create a block object
            const blockObject = {
                id: i,
                position: { row: Math.floor(i / width), column: i % width },
                color: "white" // Default color
            };

            // Add event listener to change color and update Firestore
            gridItem.addEventListener('click', () => changeColor(gridItem, blockObject));

            gridContainer.appendChild(gridItem);
            gridBlocks.push(blockObject); // Add block to the array
        }
    }

    function changeColor(element, blockObject) {
        const selectedColor = document.getElementById('color-select').value;
        element.style.backgroundColor = selectedColor;
        blockObject.color = selectedColor; // Update color in block object

        // Save or update the block data in Firebase
        addBlock(blockObject);
        console.log("Block data:", blockObject);
    }

    // Publish button handler
    document.getElementById('publish-button').addEventListener('click', () => {
        const eventName = document.getElementById('event-name').value;
        const eventDescription = document.getElementById('event-description').value;

        // Save event details to Firebase
        addEventDetails(eventName, eventDescription);

        // Optionally save the grid blocks as well
        gridBlocks.forEach(block => {
            addBlock(block);  // Save each block to Firebase
        });
    });
});

