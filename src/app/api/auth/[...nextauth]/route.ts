import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import { connectToDatabase } from "@/lib/db";
import bcrypt from "bcrypt";
import User from "@/db/models/User";

const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if credentials are defined
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          const newUser = await User.create({
            name: credentials.name, // Default name from email
            email: credentials.email,
            password: await bcrypt.hash(credentials.password, 10), // Hash the password
            provider: "credentials",
          });

          
        return { id: newUser._id.toString(), name: newUser.name, email: newUser.email, image: newUser.image, provider: newUser.provider };
        }

        if (!user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        

        return { id: user._id.toString(), name: user.name, email: user.email, image: user.image, provider: user.provider };
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },
    async signIn({ user, account }) {
      await connectToDatabase();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        if (account?.provider === "credentials") {
          // Credentials users should already exist (created via /api/auth/register)
          return false; // Prevent sign-in if user doesn't exist
        }

        // Create user only for OAuth logins
        await User.create({
          name: user.name || user.email?.split("@")[0],
          email: user.email,
          image: user.image || "",
          provider: account?.provider || "credentials",
        });
      }

      return true; // Allow sign-in
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
