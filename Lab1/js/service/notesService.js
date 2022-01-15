const NOTES = "notes";

const getNotes = () => {
  const notes = localStorage.getItem(NOTES) ?? "[]";
  try {
    return JSON.parse(notes);
  } catch {
    return [];
  }
};

function _setNotes(notes) {
  localStorage.setItem(NOTES, JSON.stringify(notes));
  window.dispatchEvent(new Event("storage"));
}

const addNote = (note) => {
  if (!note) return;
  const notes = [...getNotes(), note];
  _setNotes(notes);
};

const removeNote = (id) => {
  const notes = getNotes().filter((e) => e.id !== id);
  _setNotes(notes);
};

const updateNotes = (notes) => {
  const localNotes = getNotes().map((e) => {
    const existing = notes?.find((note) => note.id === e.id);
    if (existing) return { ...e, ...existing };
    return e;
  });
  _setNotes(localNotes);
};

export { getNotes, addNote, removeNote, updateNotes };
