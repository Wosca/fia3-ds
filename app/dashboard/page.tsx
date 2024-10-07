import { auth } from "@/auth";
import { redirect, RedirectType } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  } else if (session.user?.role === "mentor") {
    redirect("/dashboard/mentor", RedirectType.push);
  } else if (session.user?.role === "mentee") {
    redirect("/dashboard/mentee", RedirectType.push);
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard, {session.user?.role}!</p>
    </div>
  );
}
