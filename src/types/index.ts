import { COLORS, NOTE_SIZES } from "../constants";
import type {
  INoteSchema,
  ICustomSizeSchema,
  INoteSizeSchema,
} from "../schemas";

// Re-export Zod-derived types for convenience
export type INote = INoteSchema;
export type ICustomSize = ICustomSizeSchema;
export type INoteSize = INoteSizeSchema;

//derived from constants
export type IColorType = keyof typeof COLORS;
export type ISizeType = keyof typeof NOTE_SIZES | "custom";
