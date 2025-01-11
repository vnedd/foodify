import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, {
    message: "Name is required!",
  }),
  image: z.string().min(1, {
    message: "Image is required!",
  }),
  description: z.string().min(1, {
    message: "Description is required!",
  }),
});

export const deleteCategorySchema = z.object({
  id: z.string(),
});

export type TcategorySchema = z.infer<typeof categorySchema>;
