import { getNotes } from "./service/notesService.js";

const MSG_NOT_SUPPORTED = "Sorry web Storage is not supported";
const UPDATE_LABEL = "updated at:";

if (typeof Storage == "undefined") {
  document.write(MSG_NOT_SUPPORTED);
  window.stop();
}

const timeEl = document.getElementById("time");
const notesEl = document.getElementById("notes");

const renderTime = () => {
  timeEl.innerHTML = `${UPDATE_LABEL} ${new Date().toTimeString()}`;
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
