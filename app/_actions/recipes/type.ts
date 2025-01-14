import {
  Category,
  Cuisine,
  Ingredient,
  Recipe,
  Review,
  Step,
  User,
} from "@prisma/client";

export type RecipeType = Recipe & {
  author: User;
  category: Category;
  cuisine: Cuisine;
  ingredients: Ingredient[];
  steps: Step[];
  reviews: Review[];
  isLiked?: boolean;
  isSaved?: boolean;
};

export interface LikeActionResult {
  success: boolean;
}
