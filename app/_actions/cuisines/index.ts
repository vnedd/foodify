"use server";

import { actionClient, ActionError } from "@/lib/safe-action";
import { cuisinesSchema, deleteCuisineSchema } from "./schema";
import { flattenValidationErrors } from "next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getCuisines = async () => {
  try {
    const cuisines = await prisma.cuisine.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return cuisines;
  } catch {
    return [];
  }
};

export const getCuisineById = async (id: string) => {
  try {
    const cuisines = await prisma.cuisine.findUnique({
      where: { id },
    });

    return cuisines;
  } catch {
    return null;
  }
};

export const addCuisineAction = actionClient
  .schema(cuisinesSchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput: { name, description, country, region } }) => {
    await prisma.cuisine.create({
      data: {
        name,
        description,
        country,
        region,
      },
    });
    revalidatePath("/cuisines");
    redirect("/cuisines");
  });

export const updateCuisineAction = actionClient
  .schema(cuisinesSchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(
    async ({ parsedInput: { name, country, region, description, id } }) => {
      const currentCuisine = await getCuisineById(id as string);

      if (!currentCuisine) {
        throw new ActionError("Cuisine not found!");
      }

      await prisma.cuisine.update({
        where: { id },
        data: {
          name,
          description,
          country,
          region,
        },
      });

      revalidatePath("/cuisines");
      redirect("/cuisines");
    }
  );

export const deteleCuisine = actionClient
  .schema(deleteCuisineSchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput: { id } }) => {
    await prisma.cuisine.delete({ where: { id } });

    revalidatePath("/cuisines");
    redirect("/cuisines");
  });
