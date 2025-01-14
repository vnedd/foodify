"use server";

import { recipeIdSchema, recipeSchema } from "./schema";
import { flattenValidationErrors } from "next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { actionClient, ActionError } from "@/lib/safe-action";
import { LikeActionResult, RecipeType } from "./type";

export interface IRecipeQueryParams {
  offset?: number;
  limit?: number;
  title?: string;
  categorySlug?: string;
  cuisineId?: string;
}

export const getRecipes = async () => {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        category: true,
        cuisine: true,
        ingredients: true,
        steps: true,
        reviews: true,
      },
    });

    return recipes;
  } catch {
    return [];
  }
};

export const getInfinityRecipes = async (params: IRecipeQueryParams) => {
  try {
    const { offset, limit, title, categorySlug, cuisineId } = params;
    const session = await auth();

    const recipes = await prisma.recipe.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        category: true,
        cuisine: true,
        ingredients: true,
        steps: true,
        reviews: true,
      },
      where: {
        ...(title && {
          title: {
            contains: title,
            mode: "insensitive",
          },
        }),
        ...(categorySlug && {
          category: {
            slug: {
              equals: categorySlug,
              mode: "insensitive",
            },
          },
        }),
        ...(cuisineId && { cuisineId }),
      },
      skip: offset,
      take: limit || 6,
    });

    if (!session?.user) {
      return recipes.map((recipe) => ({
        ...recipe,
        isLiked: false,
      }));
    }

    const likes = await prisma.like.findMany({
      where: {
        userId: session.user.id,
        recipeId: {
          in: recipes.map((recipe) => recipe.id),
        },
      },
    });

    const savedRecipes = await prisma.savedRecipe.findMany({
      where: {
        userId: session.user.id,
        recipeId: {
          in: recipes.map((recipe) => recipe.id),
        },
      },
    });

    const likedRecipeIds = new Set(likes.map((like) => like.recipeId));
    const savedRecipeIds = new Set(savedRecipes.map((saved) => saved.recipeId));

    return recipes.map((recipe) => ({
      ...recipe,
      isLiked: likedRecipeIds.has(recipe.id),
      isSaved: savedRecipeIds.has(recipe.id),
    }));
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

export const getRecipesByUser = async (): Promise<RecipeType[]> => {
  try {
    const session = await auth();
    const recipes = await prisma.recipe.findMany({
      where: {
        authorId: session?.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        category: true,
        cuisine: true,
        ingredients: true,
        steps: true,
        reviews: true,
      },
    });

    return recipes;
  } catch {
    return [];
  }
};

export const getRecipeById = async (id: string): Promise<RecipeType | null> => {
  try {
    const session = await auth();
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        cuisine: true,
        ingredients: true,
        steps: true,
        reviews: true,
      },
    });

    const isLiked = session?.user ? await checkUserLikedRecipe(id) : false;
    const isSaved = session?.user ? await checkUserSavedRecipe(id) : false;

    if (!recipe) {
      return null;
    }

    const recipeWithLikeStatus = {
      ...recipe,
      isLiked,
      isSaved,
    };

    return recipeWithLikeStatus;
  } catch {
    return null;
  }
};

export const addRecipeAction = actionClient
  .schema(recipeSchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const session = await auth();

    if (!session?.user) {
      throw new ActionError("Unauthorized!");
    }
    const {
      title,
      description,
      image,
      cuisineId,
      categoryId,
      prepTime,
      cookTime,
      servings,
      difficulty,
      ingredients,
      steps,
    } = parsedInput;

    await prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({
        data: {
          title,
          description,
          prepTime,
          cookTime,
          servings,
          difficulty,
          image,
          authorId: session?.user.id as string,
          cuisineId,
          categoryId,
        },
      });

      await tx.ingredient.createMany({
        data: ingredients.map((ingredient) => ({
          label: ingredient.label,
          order: ingredient.id,
          recipeId: recipe.id,
        })),
      });

      await tx.step.createMany({
        data: steps.map((step) => ({
          label: step.label,
          order: step.id,
          image: step.image || null,
          recipeId: recipe.id,
        })),
      });
    });

    revalidatePath("/profile/published");
    redirect("/profile/published");
  });

export const updateRecipeAction = actionClient
  .schema(recipeSchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ActionError("Unauthorized!");
    }

    const {
      id,
      title,
      description,
      image,
      cuisineId,
      categoryId,
      prepTime,
      cookTime,
      servings,
      difficulty,
      ingredients,
      steps,
    } = parsedInput;

    if (!id) {
      throw new ActionError("Recipe ID is required!");
    }

    const currentRecipe = await prisma.recipe.findUnique({
      where: { id },
      include: { ingredients: true, steps: true },
    });

    if (!currentRecipe) {
      throw new ActionError("Recipe not found!");
    }

    if (currentRecipe.authorId !== session.user.id) {
      throw new ActionError("Not authorized to edit this recipe!");
    }

    await prisma.$transaction(async (tx) => {
      await tx.recipe.update({
        where: { id },
        data: {
          title,
          description,
          prepTime,
          cookTime,
          servings,
          difficulty,
          image,
          cuisineId,
          categoryId,
        },
      });

      await tx.ingredient.deleteMany({
        where: { recipeId: id },
      });

      await tx.ingredient.createMany({
        data: ingredients.map((ingredient) => ({
          label: ingredient.label,
          order: ingredient.id,
          recipeId: id,
        })),
      });

      await tx.step.deleteMany({
        where: { recipeId: id },
      });

      await tx.step.createMany({
        data: steps.map((step) => ({
          label: step.label,
          order: step.id,
          image: step.image,
          recipeId: id,
        })),
      });
    });

    revalidatePath("/profile/published");
    redirect("/profile/published");
  });

export const deteleRecipeAction = actionClient
  .schema(recipeIdSchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ActionError("Unauthorized!");
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new ActionError("Recipe not found!");
    }

    if (recipe.authorId !== session.user.id) {
      throw new ActionError("Not authorized to delete this recipe!");
    }

    await prisma.$transaction(async (tx) => {
      await tx.ingredient.deleteMany({
        where: { recipeId: id },
      });

      await tx.step.deleteMany({
        where: { recipeId: id },
      });

      await tx.recipe.delete({
        where: { id },
      });
    });

    revalidatePath("/profile/published");
    redirect("/profile/published");
  });

export const likeRecipeAction = actionClient
  .schema(recipeIdSchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }): Promise<LikeActionResult> => {
    try {
      const session = await auth();

      if (!session?.user) {
        throw new ActionError("You must be logged in to like recipes");
      }

      const userId = session.user.id!;

      // Check if like already exists
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_recipeId: {
            userId,
            recipeId: id,
          },
        },
      });

      if (existingLike) {
        throw new ActionError("Recipe already liked");
      }

      // Create like and increment count in a transaction
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            recipeId: id,
          },
        }),
        prisma.recipe.update({
          where: { id },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        }),
      ]);

      return { success: true };
    } catch (error) {
      console.error("Error liking recipe:", error);
      throw new ActionError("Failed to like recipe");
    }
  });

export const unlikeRecipeAction = actionClient
  .schema(recipeIdSchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }): Promise<LikeActionResult> => {
    try {
      const session = await auth();

      if (!session?.user) {
        throw new ActionError("You must be logged in to unlike recipes");
      }

      const userId = session.user.id!;

      await prisma.$transaction([
        prisma.like.delete({
          where: {
            userId_recipeId: {
              userId,
              recipeId: id,
            },
          },
        }),
        prisma.recipe.update({
          where: { id },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        }),
      ]);

      return { success: true };
    } catch (error) {
      console.error("Error unliking recipe:", error);
      throw new ActionError("Failed to unlike recipe");
    }
  });

export const savedRecipeAction = actionClient
  .schema(recipeIdSchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }): Promise<LikeActionResult> => {
    try {
      const session = await auth();

      if (!session?.user) {
        throw new ActionError("You must be logged in to saved recipes");
      }

      const userId = session.user.id!;

      // Check if like already exists
      const existingLike = await prisma.savedRecipe.findUnique({
        where: {
          userId_recipeId: {
            userId,
            recipeId: id,
          },
        },
      });

      if (existingLike) {
        throw new ActionError("Recipe already saved");
      }

      // Create like and increment count in a transaction
      await prisma.$transaction([
        prisma.savedRecipe.create({
          data: {
            userId,
            recipeId: id,
          },
        }),
      ]);

      return { success: true };
    } catch (error) {
      console.error("Error unsaved recipe:", error);
      throw new ActionError("Failed to unsaved recipe");
    }
  });

export const unSavedRecipeAction = actionClient
  .schema(recipeIdSchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }): Promise<LikeActionResult> => {
    try {
      const session = await auth();

      if (!session?.user) {
        throw new ActionError("You must be logged in to unsaved recipes");
      }

      const userId = session.user.id!;

      await prisma.$transaction([
        prisma.savedRecipe.delete({
          where: {
            userId_recipeId: {
              userId,
              recipeId: id,
            },
          },
        }),
      ]);

      return { success: true };
    } catch (error) {
      console.error("Error unsaved recipe:", error);
      throw new ActionError("Failed to unsaved recipe");
    }
  });

export const checkUserLikedRecipe = async (id: string) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return false;
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_recipeId: {
          userId: session.user.id!,
          recipeId: id,
        },
      },
    });

    return !!like;
  } catch {
    return false;
  }
};

export const checkUserSavedRecipe = async (id: string) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return false;
    }

    const saved = await prisma.savedRecipe.findUnique({
      where: {
        userId_recipeId: {
          userId: session.user.id!,
          recipeId: id,
        },
      },
    });

    return !!saved;
  } catch {
    return false;
  }
};
