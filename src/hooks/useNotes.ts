import { useState, useEffect, useRef, useCallback } from "react";
import type { INote } from "../types";
import { useLocalStorage } from "./index";
import { notesSchema } from "../schemas";
import { apiClient } from "../api";

export function useNotes() {
  const [notes, setNotes] = useState<INote[]>([]);
  const { getValue, setValue } = useLocalStorage("notes");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedNotes = getValue(notesSchema);
    if (storedNotes.length > 0) setNotes(storedNotes);
  }, []);

  useEffect(() => {
    setValue(notes);
  }, [notes]);

  const debouncedSaveToAPI = useCallback((notesToSave: INote[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (notesToSave.length > 0) {
        apiClient.saveNotes(notesToSave).catch((error) => {
          console.error("Failed to save notes to API:", error);
        });
      }
    }, 1000); // 1 second delay
  }, []);

  const handleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (notes.length > 0) {
      apiClient.saveNotes(notes).catch((error) => {
        console.error("Failed to save notes to API:", error);
      });
    }
  }, [notes]);

  useEffect(() => {
    debouncedSaveToAPI(notes);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [notes, debouncedSaveToAPI]);

  function handleUpdateNote(updatedNote: INote) {
    setNotes(
      notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  }

  function handleDeleteNote(id: string) {
    setNotes(notes.filter((note) => note.id !== id));
  }

  function handleAddNote(newNote: INote) {
    setNotes((prevNotes) => [...prevNotes, newNote]);
  }

  return {
    notes,
    setNotes,
    handleUpdateNote,
    handleDeleteNote,
    handleAddNote,
    handleSave,
  };
}
