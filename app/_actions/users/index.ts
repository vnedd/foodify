"use server";
import { revalidatePath } from "next/cache";
import { flattenValidationErrors } from "next-safe-action";

import { auth, unstable_update } from "@/auth";
import { prisma } from "@/lib/prisma";
import { authSchema, userSchema } from "./schema";
import { actionClient, ActionError } from "@/lib/safe-action";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";

export const updateUserAction = actionClient
  .schema(userSchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput: { name, bio, image, id } }) => {
    const session = await auth();
    if (session?.user.id !== id) {
      throw new ActionError("Unauthorized!");
    }

    const updateUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        bio: bio || session?.user.bio,
        image: image || session?.user.image,
      },
    });
    await unstable_update({
      user: {
        bio: updateUser.bio || "",
        image: updateUser.image,
        name: updateUser.name,
        role: updateUser.role,
        email: updateUser.email,
      },
    });

    revalidatePath("/profile");
    redirect("/profile");
  });

export const registerAction = actionClient
  .schema(authSchema, {
    handleValidationErrorsShape: async (v) =>
      flattenValidationErrors(v).fieldErrors,
  })
  .action(async ({ parsedInput: { email, password } }) => {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new ActionError("Email has been taken!");
    }

    const hashedPassword = await hash(password, 10);

    const name = email.split("@")[0];

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    redirect("/auth");
  });

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id }, include: {

      
    } });

    return user;
  } catch {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};
