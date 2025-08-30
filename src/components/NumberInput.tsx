import { cn } from "../utils";

interface INumberInputProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min: number;
  max: number;
}

export default function NumberInput(props: INumberInputProps) {
  const { label, value, onChange, min, max } = props;

  // Check for validation errors
  const hasError = value !== null && (value < min || value > max);

  // Generate error message
  const errorMessage = `${label} must be between ${min}px and ${max}px`;

  return (
    <div>
      <label className="text-white text-sm font-medium mb-2 block">
        {label} (px)
      </label>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? null : Number(e.target.value))
        }
        min={min}
        max={max}
        className={cn(
          "w-full bg-neutral-700 text-white border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
          hasError ? "border-red-500" : "border-neutral-500"
        )}
      />
      {hasError && <p className="text-red-400 text-xs mt-1">{errorMessage}</p>}
    </div>
  );
}
