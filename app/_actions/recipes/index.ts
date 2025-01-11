"use server";

import { deleteRecipeSchema, recipeSchema } from "./schema";
import { flattenValidationErrors } from "next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { actionClient, ActionError } from "@/lib/safe-action";
import { RecipeType } from "./type";

export interface IRecipeQueryParams {
  offset?: number;
  limit?: number;
  title?: string;
  categoryId?: string;
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
    const { offset, limit, title, categoryId, cuisineId } = params;

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
        ...(categoryId && { categoryId }),
        ...(cuisineId && { cuisineId }),
      },
      skip: offset,
      take: limit || 10,
    });

    return recipes;
  } catch {
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

export const getRecipeById = async (id: string) => {
  try {
    const recipes = await prisma.recipe.findUnique({
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

    return recipes;
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
  .schema(deleteRecipeSchema, {
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
