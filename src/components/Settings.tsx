import ColorSelect from "./ColorSelect";
import SizeSelect from "./SizeSelect";
import type { IColorType, ISizeType, ICustomSize } from "../types";

interface ISettingsProps {
  defaultColor: IColorType;
  defaultSize: ISizeType;
  customSize: ICustomSize;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  onCustomWidthChange: (width: number | null) => void;
  onCustomHeightChange: (height: number | null) => void;
}

export default function Settings(props: ISettingsProps) {
  const {
    defaultColor,
    defaultSize,
    customSize,
    onColorChange,
    onSizeChange,
    onCustomWidthChange,
    onCustomHeightChange,
  } = props;

  return (
    <div className="notes-settings min-w-64 bg-neutral-600 p-4">
      <ColorSelect value={defaultColor} onChange={onColorChange} />
      <SizeSelect
        value={defaultSize}
        onChange={onSizeChange}
        width={customSize.width}
        height={customSize.height}
        onCustomWidthChange={onCustomWidthChange}
        onCustomHeightChange={onCustomHeightChange}
      />
    </div>
  );
}
