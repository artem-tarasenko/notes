import { useState } from "react";
import type { IColorType, ISizeType, ICustomSize } from "../types";
import { COLORS, NOTE_SIZES, SIZE_CONSTRAINTS } from "../constants";

export function useNoteSettings() {
  const [defaultColor, setDefaultColor] = useState<IColorType>("green");
  const [defaultSize, setDefaultSize] = useState<ISizeType>("medium");
  const [customSize, setCustomSize] = useState<ICustomSize>({
    width: SIZE_CONSTRAINTS.minWidth,
    height: SIZE_CONSTRAINTS.minHeight,
  });

  function isColorType(value: string): value is IColorType {
    return value in COLORS;
  }

  function isSizeType(value: string): value is ISizeType {
    return value in NOTE_SIZES || value === "custom";
  }

  function handleColorChange(selectedColor: string) {
    if (isColorType(selectedColor)) {
      setDefaultColor(selectedColor);
    }
  }

  function handleSizeChange(selectedSize: string) {
    if (isSizeType(selectedSize)) {
      setDefaultSize(selectedSize);
    }
  }

  function handleCustomWidthChange(width: number | null) {
    setCustomSize((prev) => ({ ...prev, width }));
  }

  function handleCustomHeightChange(height: number | null) {
    setCustomSize((prev) => ({ ...prev, height }));
  }

  return {
    defaultColor,
    defaultSize,
    customSize,
    onColorChange: handleColorChange,
    onSizeChange: handleSizeChange,
    onCustomWidthChange: handleCustomWidthChange,
    onCustomHeightChange: handleCustomHeightChange,
  };
}
