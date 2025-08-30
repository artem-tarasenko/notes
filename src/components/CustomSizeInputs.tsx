import { SIZE_CONSTRAINTS } from "../constants";
import NumberInput from "./NumberInput";

interface ICustomSizeInputsProps {
  width: number | null;
  height: number | null;
  onWidthChange: (value: number | null) => void;
  onHeightChange: (value: number | null) => void;
}

export default function CustomSizeInputs({
  width,
  height,
  onWidthChange,
  onHeightChange,
}: ICustomSizeInputsProps) {
  return (
    <div className="mb-4 space-y-3">
      <NumberInput
        label="Width"
        value={width}
        onChange={onWidthChange}
        min={SIZE_CONSTRAINTS.minWidth}
        max={SIZE_CONSTRAINTS.maxWidth}
      />
      <NumberInput
        label="Height"
        value={height}
        onChange={onHeightChange}
        min={SIZE_CONSTRAINTS.minHeight}
        max={SIZE_CONSTRAINTS.maxHeight}
      />
    </div>
  );
}
