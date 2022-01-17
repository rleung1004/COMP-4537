import Note from "./model/note.js";
import {
  getNotes,
  addNote,
  removeNote,
  updateNotes,
} from "./service/notesService.js";

const MSG_NOT_SUPPORTED = "Sorry web Storage is not supported";

if (typeof Storage == "undefined") {
  document.write(MSG_NOT_SUPPORTED);
  window.stop();
}

const timeEl = document.getElementById("time");
const notesEl = document.getElementById("notes");
const addEl = document.getElementById("add");

let timer = null;
let editedNotes = [];
let editingNote = null;

const labels = {
  time: "stored at:",
  placeholder: "Type something...",
  remove: "Remove",
  add: "Add",
};

const updateNote = (note, e) => {
  if (timer) {
    clearTimeout(timer);
  }
  const newNote = {
    ...note,
    text: e.target?.value ?? "",
  };

  const index = editedNotes.findIndex((e) => e.id === note.id);
  if (index != -1) {
    editedNotes.splice(index, 1, newNote);
  } else {
    editedNotes.push(newNote);
  }
  timer = setTimeout(() => updateNotes(editedNotes), 500);
};

const renderTime = () => {
  timeEl.innerHTML = `${labels.time} ${new Date().toTimeString()}`;
};

const renderNoteTextArea = (note) => {
  const textArea = document.createElement("textarea");
  textArea.classList.add("note");
  textArea.placeholder = labels.placeholder;
  textArea.value = note.text ?? "";
  textArea.id = note.id;
  textArea.oninput = (e) => updateNote(note, e);
  return textArea;
};

const renderNoteRemoveButton = (note) => {
  const btn = document.createElement("button");
  btn.classList.add("button");
  btn.innerText = labels.remove;
  btn.onclick = () => {
    editedNotes.filter((e) => e.id === note.id);
    removeNote(note.id);
  };
  return btn;
};

const renderNotes = () => {
  renderTime();
  notesEl.innerHTML = "";
  const notes = getNotes();
  const noteElements = [];
  for (const note of notes) {
    const div = document.createElement("div");
    div.classList.add("w-100", "d-flex", "mb-4", "align-items-center");
    const textArea = renderNoteTextArea(note);
    const btn = renderNoteRemoveButton(note);
    div.append(textArea, btn);
    noteElements.push(div);
  }
  notesEl.append(...noteElements);
};

const renderAddButton = () => {
  const btn = document.createElement("button");
  btn.classList.add("button", "add");
  btn.innerText = labels.add;
  btn.onclick = () => addNote(new Note());
  addEl.innerHTML = "";
  addEl.appendChild(btn);
};

const render = () => {
  renderTime();
  renderNotes();
  renderAddButton();
  if (editingNote) {
    document.getElementById(editingNote)?.focus();
  }
};

window.addEventListener("storage", render);
window.addEventListener("focusin", (e) => {
  editingNote = e.target.id;
});

render();
