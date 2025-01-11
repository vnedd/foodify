import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import { getUserById } from "./app/_actions/users";
import { UserRole } from "@prisma/client";

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user, profile }) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          image: user.image ? user.image : profile.image,
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (session.user && token.name) {
        session.user.name = token.name;
      }
      if (session.user && token.role) {
        session.user.role = token.role as UserRole;
      }
      if (session.user && token.bio) {
        session.user.bio = token.bio as UserRole;
      }
      if (session.user && token.email) {
        session.user.email = token.email as string;
      }
      if (session.user && token.picture) {
        session.user.image = token.picture;
      }
      if (session.user && token.name) {
        session.user.name = token.name as string;
      }
      return session;
    },

    async jwt({ token, trigger, user, session }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.picture = existingUser.image;
      token.name = existingUser.name;
      token.role = existingUser.role;
      token.bio = existingUser.bio;
      if (trigger === "update") {
        return {
          ...token,
          ...user,
          ...session,
        };
      }
      return token;
    },
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;
      return isAuthenticated;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 2592000, updateAge: 86400 },
  ...authConfig,
});
