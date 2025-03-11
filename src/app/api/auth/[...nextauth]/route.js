import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
// import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        // Create or update user
        const existingUser = await prisma.user.upsert({
          where: { email: profile.email },
          update: {
            firstName: profile.given_name || user.name?.split(" ")[0] || "",
            lastName:
              profile.family_name ||
              user.name?.split(" ").slice(1).join(" ") ||
              "",
            image: profile.picture,
          },
          create: {
            email: profile.email,
            firstName: profile.given_name || user.name?.split(" ")[0] || "",
            lastName:
              profile.family_name ||
              user.name?.split(" ").slice(1).join(" ") ||
              "",
            image: profile.picture,
          },
        });
        return true;
      }
      return true;
    },
    async session({ session, user }) {
      // Include user ID and names in session
      session.user.id = user.id;
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (dbUser) {
        session.user.firstName = dbUser.firstName;
        session.user.lastName = dbUser.lastName;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };
