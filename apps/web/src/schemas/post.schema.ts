import { z } from "zod";

export const createPostSchema = z
  .object({
    content: z
      .string({
        required_error: "Content is required",
        invalid_type_error: "Content must be a string",
      })
      .min(1, "Content cannot be empty"),

    platform: z.enum(["LINKEDIN", "X", "BLUESKY"], {
      required_error: "Platform is required",
      invalid_type_error:
        "Platform must be either 'linkedin', 'x', or 'bluesky'",
    }),

    published: z.boolean({
      required_error: "Published status is required",
      invalid_type_error: "Published must be a boolean value",
    }),

    scheduledFor: z.coerce
      .date({
        invalid_type_error: "Scheduled date must be a valid date",
      })
      .optional(),

    publishedAt: z.coerce
      .date({
        invalid_type_error: "Published date must be a valid date",
      })
      .optional(),

    noteId: z
      .string({
        required_error: "Note ID is required",
        invalid_type_error: "Note ID must be a string",
      })
      .min(1, "Note ID cannot be empty"),

    title: z
      .string({
        invalid_type_error: "Title must be a string",
      })
      .min(1, "Title cannot be empty when provided")
      .optional(),

    tags: z
      .array(
        z
          .string({
            invalid_type_error: "Each tag must be a string",
          })
          .min(1, "Tags cannot be empty strings"),
      )
      .optional(),

    imageUrl: z
      .string({
        invalid_type_error: "Image URL must be a string",
      })
      .url("Please provide a valid URL")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.scheduledFor) {
      const scheduledDate = new Date(data.scheduledFor);
      const now = new Date();

      if (scheduledDate < now) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Scheduled date must be in the future",
          path: ["scheduledFor"],
        });
      }
    }

    if (data.published && !data.publishedAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Published date is required when post is published",
        path: ["publishedAt"],
      });
    }
  });


export const updatePostSchema = z
  .object({
    content: z
      .string({
        required_error: "Content is required",
        invalid_type_error: "Content must be a string",
      })
      .min(1, "Content cannot be empty"),

    platform: z.enum(["LINKEDIN", "X", "BLUESKY"], {
      required_error: "Platform is required",
      invalid_type_error:
        "Platform must be either 'linkedin', 'x', or 'bluesky'",
    }),

    published: z.boolean({
      required_error: "Published status is required",
      invalid_type_error: "Published must be a boolean value",
    }),

    scheduledFor: z.coerce
      .date({
        invalid_type_error: "Scheduled date must be a valid date",
      })
      .optional(),

    publishedAt: z.coerce
      .date({
        invalid_type_error: "Published date must be a valid date",
      })
      .optional(),

    title: z
      .string({
        invalid_type_error: "Title must be a string",
      })
      .min(1, "Title cannot be empty when provided")
      .nullable()
      .optional(),

    tags: z
      .array(
        z
          .string({
            invalid_type_error: "Each tag must be a string",
          })
          .min(1, "Tags cannot be empty strings"),
      )
      .optional(),

    imageUrl: z
      .string({
        invalid_type_error: "Image URL must be a string",
      })
      .url("Please provide a valid URL")
      .nullable()
      .optional(),
  })
  // .superRefine((data, ctx) => {
  //   if (data.scheduledFor) {
  //     const scheduledDate = new Date(data.scheduledFor);
  //     const now = new Date();

  //     if (scheduledDate < now) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         message: "Scheduled date must be in the future",
  //         path: ["scheduledFor"],
  //       });
  //     }
  //   }

  //   if (data.published && !data.publishedAt) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: "Published date is required when post is published",
  //       path: ["publishedAt"],
  //     });
  //   }
  // });
