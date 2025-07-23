import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";
import { getDb } from '../../../lib/db';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Your name" },
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
        isSignUp: { label: "SignUp", type: "hidden" },
      },
      async authorize(credentials, req) {
        // Mock: Accept any email/password, return user object
        if (credentials?.email && credentials?.password) {
          return {
            id: credentials.email,
            name: credentials.name || credentials.email.split("@")[0],
            email: credentials.email,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/", // Stay on homepage for login/signup
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "credentials") {
        const db = await getDb();
        const users = db.collection("users");
        const existing = await users.findOne({ email: user.email });
        if (!existing) {
          await users.insertOne({
            name: user.name,
            email: user.email,
            avatarUrl: user.image,
            category: "free",
            createdAt: new Date(),
            lastLogin: new Date(),
          });
        } else {
          await users.updateOne(
            { email: user.email },
            { $set: { lastLogin: new Date() } }
          );
        }
      }
      return true;
    },
  },
}); 