import type { IColorType } from "../types";
import { COLORS } from "../constants";

interface IColorSelectProps {
  value: IColorType;
  onChange: (value: string) => void;
}

function ColorSelect({ value, onChange }: IColorSelectProps) {
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value);
  }

  return (
    <div className="select-color mb-4">
      <label className=" text-white text-sm font-medium mb-2 flex items-center gap-2">
        <span
          className={`w-4 h-4 rounded border border-neutral-400 ${COLORS[value]}`}
        ></span>
        Note Color
      </label>
      <select
        className="w-full bg-neutral-700 text-white border border-neutral-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={handleChange}
      >
        {Object.entries(COLORS).map(([colorName]) => (
          <option key={colorName} value={colorName}>
            {colorName.charAt(0).toUpperCase() + colorName.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ColorSelect;
