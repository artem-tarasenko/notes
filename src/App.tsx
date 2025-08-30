import { useState } from "react";
import Note from "./components/Note";
import AddButton from "./components/AddButton";
import DeleteButton from "./components/DeleteButton";
import Settings from "./components/Settings";
import AppHeader from "./components/AppHeader";
import { useNotes, useNoteInteractions, useNoteSettings } from "./hooks";

/**
 * Main app, did not use any state management libs for simplicity.
 * Although, hooks are not reused anywhere else, I still prefer to use hooks for simplicity and readability of the components
 * There is a bunch of state stored in 3 hooks, separated appropiately
 *
 * API is fake as asked, there are logs to show debounced saving on dragEnd, onEdit, onResize etc, whenever the notes are updated
 *
 * Folder structure is pretty straigforward: hooks, components, utils, types, constants, api.
 * With a real project expected to be bigger, I would add a folder for features/pages, ui with reusable components, styles if applicable
 */
export default function App() {
  const [isAddingNote, setIsAddingNote] = useState(false);

  const notesData = useNotes();
  const settingsData = useNoteSettings();
  const { notesAreaProps, ...interactionsData } = useNoteInteractions({
    notes: notesData.notes,
    setNotes: notesData.setNotes,
    handleDeleteNote: notesData.handleDeleteNote,
    handleSave: notesData.handleSave,
    isAddingNote,
    defaultColor: settingsData.defaultColor,
    defaultSize: settingsData.defaultSize,
    customSize: settingsData.customSize,
  });

  function handleAddNewNoteCoordinated(
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) {
    const result = interactionsData.handleAddNewNote(e);
    if (result === false) {
      setIsAddingNote(false);
    }
  }

  function handleSetAddingNote(value?: boolean) {
    setIsAddingNote((prevState) => value ?? !prevState);
  }

  return (
    <div className="notes-app bg-neutral-700 flex flex-col h-full">
      <AppHeader />
      <main className="notes-container grow bg-neutral-800 flex">
        <Settings {...settingsData} />
        <div
          className="notes-area w-full h-full relative"
          onClick={handleAddNewNoteCoordinated}
          {...notesAreaProps}
        >
          {notesData.notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              onUpdateNote={notesData.handleUpdateNote}
              onDeleteNote={notesData.handleDeleteNote}
              onSave={notesData.handleSave}
              isDragging={interactionsData.isDragging}
              isBeingDragged={
                interactionsData.isBeingDragged &&
                interactionsData.draggedNoteId === note.id
              }
              isDraggingOverTrash={
                interactionsData.isDraggingOverTrash &&
                interactionsData.draggedNoteId === note.id
              }
              lastActive={interactionsData.lastActiveNoteId === note.id}
              isResizing={interactionsData.isResizing}
              isBeingResized={
                interactionsData.isBeingResized &&
                interactionsData.resizedNoteId === note.id
              }
            />
          ))}
        </div>
        <div className="notes-controls absolute bottom-5 right-5">
          {interactionsData.isDragging && interactionsData.draggedNoteId ? (
            <DeleteButton
              ref={interactionsData.trashButtonRef}
              isDraggingOverTrash={interactionsData.isDraggingOverTrash}
              onDelete={() =>
                notesData.handleDeleteNote(interactionsData.draggedNoteId!)
              }
            />
          ) : (
            <AddButton
              isAddingNote={isAddingNote}
              onClick={() => handleSetAddingNote()}
            />
          )}
        </div>
      </main>
    </div>
  );
}
