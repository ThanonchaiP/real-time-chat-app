import { z } from "zod";

export const ResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  meta: z
    .object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPage: z.number(),
      hasNextPage: z.boolean(),
      hasPreviousPage: z.boolean(),
    })
    .optional(),
});
