import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import { authSchema } from "./app/_actions/users/schema";
import { compare } from "bcryptjs";

export default {
  providers: [
    Google,
    Github,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const validatedFields = authSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await prisma.user.findFirst({
            where: {
              email,
            },
          });
          if (!user || !user.password) return null;

          const passwordCorrect = await compare(password, user.password);

          if (passwordCorrect) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
  debug: false,
  trustHost: true,
} satisfies NextAuthConfig;
