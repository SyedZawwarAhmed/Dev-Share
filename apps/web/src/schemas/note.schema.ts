import { z } from "zod";

export const getNotesBodySchema = z.object({
  search: z
    .string({
      invalid_type_error: "Content must be a string",
    })
    .optional(),
  orderBy: z.enum(["asc", "desc"]).optional(),
});
