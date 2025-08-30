import { Trash2 } from "lucide-react";
import { COLORS } from "../constants";
import Textarea from "./TextArea";
import { cn } from "../utils";
import type { INote } from "../types";

interface INoteProps {
  note: INote;
  onUpdateNote: (updatedNote: INote) => void;
  onDeleteNote: (id: string) => void;
  onSave: () => void;
  isDragging: boolean;
  isBeingDragged: boolean;
  isDraggingOverTrash: boolean;
  lastActive: boolean;
  isResizing: boolean;
  isBeingResized: boolean;
}

export default function Note(props: INoteProps) {
  const {
    note,
    onUpdateNote,
    onDeleteNote,
    onSave,
    isDragging,
    isBeingDragged,
    isDraggingOverTrash,
    lastActive,
    isResizing,
    isBeingResized,
  } = props;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateNote({ ...note, text: e.target.value });
  };

  function handleBlur() {
    onUpdateNote({ ...note, isEditing: false });
    onSave();
  }

  function handleClick() {
    if (isDragging || isResizing) return;
    onUpdateNote({ ...note, isEditing: true });
  }

  function handleDelete() {
    onDeleteNote(note.id);
  }

  return (
    <div
      className={cn(
        "note-container p-2 absolute rounded-md flex flex-col",
        COLORS[note.color],
        isBeingDragged && "z-50 shadow-2xl scale-105",
        isDragging && !isBeingDragged && "opacity-70 pointer-events-none",
        isBeingDragged && isDraggingOverTrash && "opacity-50",
        isBeingResized && "z-50 shadow-2xl",
        isResizing && !isBeingResized && "opacity-70 pointer-events-none",
        lastActive && "z-40 shadow"
      )}
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
      }}
      data-note-id={note.id}
    >
      <div
        className="absolute w-8 h-8 bottom-0 right-0"
        style={{ cursor: "se-resize" }}
        data-resize-handle="bottom-right"
      />

      <div className="note-header flex justify-end items-center cursor-grab active:cursor-grabbing">
        <button
          className="note-close text-red-400 rounded-md p-1 hover:cursor-pointer hover:bg-red-400 hover:text-zinc-100 hover:scale-110 transition-all duration-300"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="note-content p-1 relative w-full grow box-content">
        {note.isEditing ? (
          <Textarea
            value={note.text}
            onBlur={handleBlur}
            onChange={handleTextChange}
          />
        ) : (
          <p
            className="note-text text-zinc-600 hover:cursor-text h-full w-full border border-zinc-900/10 rounded-md p-2"
            onClick={handleClick}
          >
            {note.text}
          </p>
        )}
      </div>
    </div>
  );
}
