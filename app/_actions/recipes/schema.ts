import { z } from "zod";

export const recipeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string(),
  cuisineId: z.string().min(1, "Cuisine is required"),
  categoryId: z.string().min(1, "Category is required"),
  prepTime: z.number().min(0, "Prep time cannot be negative"),
  cookTime: z.number().min(0, "Cook time cannot be negative"),
  servings: z.number().min(1, "Must have at least 1 serving"),
  difficulty: z.enum(["EASY", "MEDIUM", "DIFFICULT"], {
    required_error: "Difficulty is required",
  }),
  ingredients: z
    .array(
      z.object({
        id: z.number(),
        label: z.string().min(1, "Ingredient cannot be empty"),
      })
    )
    .min(1, "At least one ingredient is required"),
  steps: z
    .array(
      z.object({
        id: z.number(),
        label: z.string().min(1, "Step cannot be empty"),
        image: z.string().optional(),
      })
    )
    .min(1, "At least one step is required"),
});

export const recipeIdSchema = z.object({
  id: z.string(),
});

export type TRecipeSchema = z.infer<typeof recipeSchema>;
