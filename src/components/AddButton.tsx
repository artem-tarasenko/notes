import { PlusIcon } from "lucide-react";
import { cn } from "../utils";

interface IAddButtonProps {
  isAddingNote: boolean;
  onClick: () => void;
}

export default function AddButton({ isAddingNote, onClick }: IAddButtonProps) {
  return (
    <button
      className={cn(
        "Add-button cursor-pointer text-white p-6 rounded-md",
        isAddingNote
          ? "bg-amber-400 hover:bg-amber-500"
          : "bg-blue-600 hover:bg-blue-700"
      )}
      onClick={onClick}
    >
      {isAddingNote ? <span>ESC</span> : <PlusIcon className="w-6 h-6" />}
    </button>
  );
}
