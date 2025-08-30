import { Trash2 } from "lucide-react";
import { cn } from "../utils";
import { forwardRef } from "react";

interface IDeleteButtonProps {
  isDraggingOverTrash: boolean;
  onDelete: () => void;
}

const DeleteButton = forwardRef<HTMLButtonElement, IDeleteButtonProps>(
  function DeleteButton({ isDraggingOverTrash, onDelete }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          "Delete-button cursor-pointer text-white p-6 rounded-md transition-all duration-200",
          "bg-amber-400 hover:bg-amber-500",
          isDraggingOverTrash && "scale-125 bg-red-500"
        )}
        onClick={onDelete}
      >
        <Trash2 />
      </button>
    );
  }
);

export default DeleteButton;
