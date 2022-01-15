import { getNotes } from "./service/notesService.js";

const updateLabel = "updated at:";

const timeEl = document.getElementById("time");
const notesEl = document.getElementById("notes");

const renderTime = () => {
  timeEl.innerHTML = `${updateLabel} ${new Date().toTimeString()}`;
};

const renderNotes = () => {
  renderTime();
  notesEl.innerHTML = "";
  const notes = getNotes();
  const noteElements = [];
  for (const note of notes) {
    const div = document.createElement("div");
    div.classList.add("mb-4", "note");
    const content = document.createElement("p");
    content.classList.add("text");
    content.innerText = note.text ?? "";
    div.append(content);
    noteElements.push(div);
  }
  notesEl.append(...noteElements);
};

const render = () => {
  renderTime();
  renderNotes();
};

window.addEventListener("storage", render);
render();
