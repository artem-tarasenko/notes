export const COLORS: Record<string, string> = {
  green: "bg-green-300",
  blue: "bg-blue-300",
  red: "bg-red-300",
  yellow: "bg-yellow-300",
  purple: "bg-purple-300",
  orange: "bg-orange-300",
  pink: "bg-pink-300",
};

export const NOTE_SIZES: Record<string, string> = {
  small: "w-40 h-50",
  medium: "w-60 h-80",
  large: "w-80 h-110",
};

// Actual pixel dimensions for each size type
export const NOTE_DIMENSIONS: Record<
  string,
  { width: number; height: number }
> = {
  small: { width: 160, height: 200 }, // w-40 h-50
  medium: { width: 240, height: 320 }, // w-60 h-80
  large: { width: 320, height: 440 }, // w-80 h-110
};

export const SIZE_CONSTRAINTS = {
  minWidth: 120,
  minHeight: 160,
  maxWidth: 360, // 3x minWidth
  maxHeight: 480, // 3x minHeight
};
