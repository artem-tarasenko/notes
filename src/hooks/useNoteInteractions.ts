import { useState, useRef, useEffect } from "react";
import type { INote, ISizeType, IColorType } from "../types";
import { SIZE_CONSTRAINTS, NOTE_DIMENSIONS } from "../constants";
import { generateId } from "../utils";

interface INoteInteractionsProps {
  notes: INote[];
  setNotes: React.Dispatch<React.SetStateAction<INote[]>>;
  handleDeleteNote: (id: string) => void;
  isAddingNote: boolean;
  defaultColor: IColorType;
  defaultSize: ISizeType;
  customSize: { width: number | null; height: number | null };
  handleSave: () => void;
}

const DEFAULT_SIZE = {
  width: 0,
  height: 0,
};

const DEFAULT_COORDS = {
  x: 0,
  y: 0,
};

export function useNoteInteractions({
  notes,
  setNotes,
  handleDeleteNote,
  handleSave,
  isAddingNote,
  defaultColor,
  defaultSize,
  customSize,
}: INoteInteractionsProps) {
  // Drag state management
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDraggingOverTrash, setIsDraggingOverTrash] = useState(false);
  const [lastActiveNoteId, setLastActiveNoteId] = useState<string | null>(null);

  // Resize state management
  const [isResizing, setIsResizing] = useState(false);
  const [resizedNoteId, setResizedNoteId] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStartDimensions, setResizeStartDimensions] =
    useState(DEFAULT_SIZE);
  const [resizeStartPosition, setResizeStartPosition] =
    useState(DEFAULT_COORDS);
  const [resizeStartMouse, setResizeStartMouse] = useState(DEFAULT_COORDS);

  const notesAreaRef = useRef<HTMLDivElement>(null);
  const trashButtonRef = useRef<HTMLButtonElement>(null);

  // Utility function to check if two rectangles intersect
  function doRectanglesIntersect(rect1: DOMRect, rect2: DOMRect): boolean {
    return (
      rect1.right >= rect2.left &&
      rect1.left <= rect2.right &&
      rect1.bottom >= rect2.top &&
      rect1.top <= rect2.bottom
    );
  }

  function handleAddNewNote(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    if (!isAddingNote) return;

    const { clientX, clientY } = e;

    const rect = notesAreaRef.current?.getBoundingClientRect();
    if (!rect) throw new Error("Failed to add a new note");

    // Get note dimensions based on size
    let noteSize;
    if (defaultSize === "custom") {
      // Use custom size values, fallback to medium if not set
      noteSize = {
        width: customSize.width || NOTE_DIMENSIONS.medium.width,
        height: customSize.height || NOTE_DIMENSIONS.medium.height,
      };
    } else {
      noteSize =
        NOTE_DIMENSIONS[defaultSize as keyof typeof NOTE_DIMENSIONS] ||
        NOTE_DIMENSIONS.medium;
    }

    // Calculate position so that the click point is at the top-left corner of the note
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // Apply boundary constraints
    const minX = 0;
    const maxX = rect.width - noteSize.width;
    const minY = 0;
    const maxY = rect.height - noteSize.height;

    x = Math.max(minX, Math.min(maxX, x));
    y = Math.max(minY, Math.min(maxY, y));

    const newNote: INote = {
      id: generateId(),
      color: defaultColor as INote["color"],
      text: "",
      position: { x, y },
      size: { width: noteSize.width, height: noteSize.height },
      isEditing: false,
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
    return false; // Signal to parent to set isAddingNote to false
  }

  // Drag event handlers
  function handleMouseDown(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    // Check if we clicked on a note (not the background)
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const noteElement = target.closest("[data-note-id]");
    if (!(noteElement instanceof HTMLElement)) return; // Clicked on background, not a note

    const noteId = noteElement.getAttribute("data-note-id");
    if (!noteId) return;

    // Check if we're in note adding mode
    if (isAddingNote) return;

    // Check if the click is on text content or delete button - don't drag in these cases
    const isTextContent = target.classList.contains("note-text");
    const isDeleteButton = target.closest(".note-close");

    if (isTextContent || isDeleteButton) return;

    // Check if we clicked on a resize handle
    const resizeHandle = target.closest("[data-resize-handle]");
    if (resizeHandle) {
      const handlePosition = resizeHandle.getAttribute("data-resize-handle");
      if (handlePosition) {
        const note = notes.find((n) => n.id === noteId);
        if (!note) return;

        const rect = notesAreaRef.current?.getBoundingClientRect();
        if (!rect) return;

        setIsResizing(true);
        setResizedNoteId(noteId);
        setResizeHandle(handlePosition);
        setResizeStartDimensions({
          width: note.size.width,
          height: note.size.height,
        });
        setResizeStartPosition({ x: note.position.x, y: note.position.y });
        setResizeStartMouse({ x: e.clientX, y: e.clientY });
        setLastActiveNoteId(noteId);
        e.preventDefault();
        return;
      }
    }

    // Check if the note is currently being edited
    const note = notes.find((n) => n.id === noteId);
    if (note?.isEditing) {
      // Save the text and stop editing when starting to drag
      const textarea = noteElement.querySelector("textarea");
      if (textarea) {
        const updatedNote = { ...note, text: textarea.value, isEditing: false };
        setNotes((prevNotes) =>
          prevNotes.map((n) => (n.id === noteId ? updatedNote : n))
        );
        setLastActiveNoteId(noteId);
      }
    }

    // Prevent text selection during drag
    e.preventDefault();

    // Calculate offset from note position to mouse position
    const rect = notesAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const noteRect = noteElement.getBoundingClientRect();
    const offsetX = e.clientX - noteRect.left;
    const offsetY = e.clientY - noteRect.top;

    // Set drag state
    setDraggedNoteId(noteId);
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    setLastActiveNoteId(noteId);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    // Handle resize operation
    if (isResizing && resizedNoteId && resizeHandle) {
      const rect = notesAreaRef.current?.getBoundingClientRect();
      if (!rect) return;

      const deltaX = e.clientX - resizeStartMouse.x;
      const deltaY = e.clientY - resizeStartMouse.y;

      // Calculate new dimensions (only bottom-right corner resize)
      let newWidth = resizeStartDimensions.width + deltaX;
      let newHeight = resizeStartDimensions.height + deltaY;

      // Apply size constraints
      newWidth = Math.max(
        SIZE_CONSTRAINTS.minWidth,
        Math.min(SIZE_CONSTRAINTS.maxWidth, newWidth)
      );
      newHeight = Math.max(
        SIZE_CONSTRAINTS.minHeight,
        Math.min(SIZE_CONSTRAINTS.maxHeight, newHeight)
      );

      // Apply boundary constraints (prevent note from going outside canvas)
      const maxWidth = rect.width - resizeStartPosition.x;
      const maxHeight = rect.height - resizeStartPosition.y;
      newWidth = Math.min(newWidth, maxWidth);
      newHeight = Math.min(newHeight, maxHeight);

      // Update note dimensions
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === resizedNoteId
            ? { ...note, size: { width: newWidth, height: newHeight } }
            : note
        )
      );
      return;
    }

    // Handle drag operation
    if (!isDragging || !draggedNoteId) return;

    const rect = notesAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate new position
    let newX = e.clientX - rect.left - dragOffset.x;
    let newY = e.clientY - rect.top - dragOffset.y;

    // Get the dragged note to calculate its dimensions
    const draggedNote = notes.find((note) => note.id === draggedNoteId);
    if (!draggedNote) return;

    // Use actual note dimensions instead of calculating from size
    const noteSize = draggedNote.size;

    // Apply boundary constraints
    const minX = 0;
    const maxX = rect.width - noteSize.width;
    const minY = 0;
    const maxY = rect.height - noteSize.height;

    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    // Update note position
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === draggedNoteId
          ? { ...note, position: { x: newX, y: newY } }
          : note
      )
    );

    // Check if dragged note intersects with trash button
    const trashButton = trashButtonRef.current;
    const draggedNoteElement = document.querySelector(
      `[data-note-id="${draggedNoteId}"]`
    );

    if (trashButton && draggedNoteElement) {
      const trashRect = trashButton.getBoundingClientRect();
      const noteRect = draggedNoteElement.getBoundingClientRect();

      // Check for rectangle intersection (more accurate than point-in-rectangle)
      const isIntersecting = doRectanglesIntersect(trashRect, noteRect);
      setIsDraggingOverTrash(isIntersecting);
    }
  }

  function handleMouseUp() {
    // Handle resize completion
    if (isResizing) {
      setIsResizing(false);
      setResizedNoteId(null);
      setResizeHandle(null);
      setResizeStartDimensions({ width: 0, height: 0 });
      setResizeStartPosition({ x: 0, y: 0 });
      setResizeStartMouse({ x: 0, y: 0 });

      // Save to API after resize ends
      handleSave();
      return;
    }

    // Handle drag completion
    if (!isDragging) return;

    // Check if we're dropping on trash using rectangle intersection
    const trashButton = trashButtonRef.current;
    const draggedNoteElement = document.querySelector(
      `[data-note-id="${draggedNoteId}"]`
    );

    if (trashButton && draggedNoteElement && draggedNoteId) {
      const trashRect = trashButton.getBoundingClientRect();
      const noteRect = draggedNoteElement.getBoundingClientRect();

      if (doRectanglesIntersect(trashRect, noteRect)) {
        handleDeleteNote(draggedNoteId);
      }
    }

    // Reset drag state
    setIsDragging(false);
    setDraggedNoteId(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDraggingOverTrash(false);

    // Save to API after drag ends
    handleSave();
  }

  function handleMouseLeave() {
    // Cancel resize if mouse leaves the area
    if (isResizing) {
      setIsResizing(false);
      setResizedNoteId(null);
      setResizeHandle(null);
      setResizeStartDimensions({ width: 0, height: 0 });
      setResizeStartPosition({ x: 0, y: 0 });
      setResizeStartMouse({ x: 0, y: 0 });
      return;
    }

    // Cancel drag if mouse leaves the area
    if (!isDragging) return;

    setIsDragging(false);
    setDraggedNoteId(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDraggingOverTrash(false);
  }

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAddingNote) {
        // Signal to parent to set isAddingNote to false
        return;
      }
      // Cancel drag on Escape key
      if (e.key === "Escape" && isDragging) {
        setIsDragging(false);
        setDraggedNoteId(null);
        setDragOffset({ x: 0, y: 0 });
      }
      // Cancel resize on Escape key
      if (e.key === "Escape" && isResizing) {
        setIsResizing(false);
        setResizedNoteId(null);
        setResizeHandle(null);
        setResizeStartDimensions({ width: 0, height: 0 });
        setResizeStartPosition({ x: 0, y: 0 });
        setResizeStartMouse({ x: 0, y: 0 });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isAddingNote, isDragging, isResizing]);

  return {
    isDragging,
    draggedNoteId,
    isDraggingOverTrash,
    lastActiveNoteId,
    isResizing,
    resizedNoteId,
    isBeingResized: resizedNoteId !== null,
    isBeingDragged: draggedNoteId !== null,

    notesAreaRef,
    trashButtonRef,

    handleAddNewNote,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,

    notesAreaProps: {
      ref: notesAreaRef,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
  };
}
