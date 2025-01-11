import { z } from "zod";

export const cuisinesSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, {
    message: "Name is required!",
  }),
  region: z.string().min(1, {
    message: "Region is required!",
  }),
  country: z.string().min(1, {
    message: "Country is required!",
  }),
  description: z.string().min(1, {
    message: "Description is required!",
  }),
});

export const deleteCuisineSchema = z.object({
  id: z.string(),
});

export type TCuisinesSchema = z.infer<typeof cuisinesSchema>;
