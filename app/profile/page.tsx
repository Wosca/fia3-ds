import { db } from "@/db";
import { Client } from "./client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const updateFunction = async (
    name: string,
    email: string,
    sessionId: number
  ) => {
    "use server";
    try {
      await db
        .update(users)
        .set({ name, email })
        .where(eq(users.id, sessionId));
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return (
    <Client updateFunction={updateFunction} session={session as Session} />
  );
}
