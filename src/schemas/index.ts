import { z } from "zod";

// Schema for note position
export const notePositionSchema = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
});

// Schema for note size dimensions
export const noteSizeSchema = z.object({
  width: z.number().min(120).max(360), // Using SIZE_CONSTRAINTS
  height: z.number().min(160).max(480), // Using SIZE_CONSTRAINTS
});

// Schema for a single note
export const noteSchema = z.object({
  id: z.string().min(1),
  color: z.enum(["green", "blue", "red", "yellow", "purple", "orange", "pink"]),
  text: z.string(),
  position: notePositionSchema,
  size: noteSizeSchema, // Actual dimensions
  isEditing: z.boolean(),
});

// Schema for notes array
export const notesSchema = z.array(noteSchema);

// Schema for custom size
export const customSizeSchema = z.object({
  width: z.number().nullable(),
  height: z.number().nullable(),
});

// Schema for user preferences
export const userPreferencesSchema = z.object({
  defaultColor: z.enum([
    "green",
    "blue",
    "red",
    "yellow",
    "purple",
    "orange",
    "pink",
  ]),
  defaultSize: z.enum(["small", "medium", "large", "custom"]),
  customSize: customSizeSchema,
});

// Type exports for use in components
export type INoteSchema = z.infer<typeof noteSchema>;
export type INotesSchema = z.infer<typeof notesSchema>;
export type IUserPreferencesSchema = z.infer<typeof userPreferencesSchema>;
export type ICustomSizeSchema = z.infer<typeof customSizeSchema>;
export type INoteSizeSchema = z.infer<typeof noteSizeSchema>;
