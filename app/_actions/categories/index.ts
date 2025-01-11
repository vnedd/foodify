"use server";

import { actionClient, ActionError } from "@/lib/safe-action";
import { categorySchema, deleteCategorySchema } from "./schema";
import { flattenValidationErrors } from "next-safe-action";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return categories;
  } catch {
    return [];
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const categories = await prisma.category.findUnique({
      where: { id },
    });

    return categories;
  } catch {
    return null;
  }
};

export const addCategoryAction = actionClient
  .schema(categorySchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput: { name, image, description } }) => {
    const exitingName = await prisma.category.findUnique({
      where: { name },
    });

    if (exitingName) {
      throw new ActionError("Category name existed!");
    }

    const slug = slugify(name, {
      lower: true,
    });

    await prisma.category.create({
      data: {
        name,
        description,
        slug,
        image,
      },
    });
    revalidatePath("/categories");
    redirect("/categories");
  });

export const updateCategoryAction = actionClient
  .schema(categorySchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput: { name, image, description, id } }) => {
    const currentCategory = await getCategoryById(id as string);

    if (!currentCategory) {
      throw new ActionError("Category not found!");
    }

    if (name !== currentCategory.name) {
      const existingName = await prisma.category.findUnique({
        where: { name },
      });

      if (existingName) {
        throw new ActionError("Category name existed!");
      }

      currentCategory.slug = slugify(name, {
        lower: true,
      });
    }

    await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        slug: currentCategory.slug,
        image,
      },
    });

    revalidatePath("/categories");
    redirect("/categories");
  });

export const deteleCategory = actionClient
  .schema(deleteCategorySchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    await prisma.category.delete({ where: { id } });

    revalidatePath("/categories");
    redirect("/categories");
  });
