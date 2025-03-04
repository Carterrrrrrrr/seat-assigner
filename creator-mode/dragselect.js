import DragSelect from "https://unpkg.com/dragselect@latest/dist/ds.esm.min.js";

const ds = new DragSelect({
  selectables: document.querySelectorAll(".grid-item"),
  area: document.querySelector('#grid-container')
});

ds.subscribe("DS:end", (e) => {
  console.log(e);
});