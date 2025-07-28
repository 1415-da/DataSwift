import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "your-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "your-google-client-secret",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "your-github-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "your-github-client-secret",
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/", // Stay on homepage for login/signup
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Simplified callback without database dependency
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here-change-this-in-production",
};

export default NextAuth(authOptions); 