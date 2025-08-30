import type { ISizeType } from "../types";
import { NOTE_SIZES } from "../constants";
import CustomSizeInputs from "./CustomSizeInputs";

interface ISizeSelectProps {
  value: ISizeType;
  onChange: (value: string) => void;
  width: number | null;
  height: number | null;
  onCustomWidthChange: (value: number | null) => void;
  onCustomHeightChange: (value: number | null) => void;
}

function SizeSelect({
  value,
  onChange,
  width,
  height,
  onCustomWidthChange,
  onCustomHeightChange,
}: ISizeSelectProps) {
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value);
  }

  return (
    <div className="select-size mb-4">
      <label className="text-white text-sm font-medium mb-2">Note Size</label>
      <select
        className="w-full bg-neutral-700 text-white border border-neutral-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={handleChange}
      >
        {Object.entries(NOTE_SIZES).map(([sizeName]) => (
          <option key={sizeName} value={sizeName}>
            {sizeName.charAt(0).toUpperCase() + sizeName.slice(1)}
          </option>
        ))}
        <option value="custom">Custom</option>
      </select>
      {value === "custom" && (
        <CustomSizeInputs
          width={width}
          height={height}
          onWidthChange={onCustomWidthChange}
          onHeightChange={onCustomHeightChange}
        />
      )}
    </div>
  );
}

export default SizeSelect;
