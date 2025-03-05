// import DragSelect from "https://unpkg.com/dragselect@latest/dist/ds.esm.min.js";

// const ds = new DragSelect({
//   selectables: document.querySelectorAll(".grid-item"),
//   area: document.querySelector('#grid-container')
// });

// ds.subscribe("DS:end", (e) => {
//   console.log(e);
// });


import DragSelect from "https://unpkg.com/dragselect@latest/dist/ds.esm.min.js";
import { gridItems } from './creator.js';

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