// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the default session interface
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Add the `role` property to the user
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string; // Add the `role` property to the user
  }
}

// Extend the default JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string; // Add the `role` property to the JWT token
  }
}
