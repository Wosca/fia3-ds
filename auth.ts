import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        mentor: { label: "Mentor", type: "checkbox" },
      },
      authorize: async (credentials) => {
        const { email } = credentials as { email: string };
        const { password } = credentials as { password: string };
        const { name } = credentials as { name: string };
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        if (user.length > 0) {
          if (compareSync(password, user[0].passwordHash)) {
            return {
              id: user[0].id.toString(),
              name: user[0].name,
              role: user[0].role, // this will tell if the user is a mentor or mentee
            };
          }
          throw new Error("Invalid Credentials");
        } else {
          try {
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);

            await db.insert(users).values({
              name: name,
              email: email,
              role: credentials.mentor ? "mentor" : "mentee",
              passwordHash: hashedPassword,
            });

            return {
              id: (
                await db
                  .select({ id: users.id })
                  .from(users)
                  .where(eq(users.email, email))
              )[0].id.toString(),
              name: name,
              role: credentials.mentor ? "mentor" : "mentee",
            };
          } catch (error) {
            console.error(error);
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Now this will not throw any error
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add role to JWT token
      if (user) {
        token.id = user.id;
        token.role = user.role; // Include the role in the JWT
      }
      return token;
    },
  },
});
