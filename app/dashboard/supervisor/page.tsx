import { redirect } from "next/navigation";
import { db } from "@/db/index";
import { sessions, subjects, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/auth";

export default async function SupervisorDashboard() {
  // const session = await auth();
  // if (!session || session?.user?.role !== "mentor") {
  //   redirect("/signin");
  // }

  // const allSessions = await db
  //   .select({
  //     session: sessions,
  //     mentor: users,
  //     mentee: users,
  //     subject: subjects,
  //   })
  //   .from(sessions)
  //   .leftJoin(users, eq(sessions.mentorId, users.id))
  //   .leftJoin(users, eq(sessions.menteeId, users.id))
  //   .leftJoin(subjects, eq(sessions.subjectId, subjects.id));

  // const sessionReport = await db
  //   .select({
  //     subjectName: subjects.name,
  //     sessionCount: sql<number>`count(*)`,
  //   })
  //   .from(sessions)
  //   .leftJoin(subjects, eq(sessions.subjectId, subjects.id))
  //   .groupBy(subjects.name);

  return (
    // <div className="container mx-auto p-4">
    //   <h1 className="text-2xl font-bold mb-4">Supervisor Dashboard</h1>
    //   <h2 className="text-xl font-semibold mb-2">All Sessions</h2>
    //   <ul>
    //     {allSessions.map((session) => (
    //       <li key={session.session.id} className="mb-2">
    //         {session?.subject?.name}: {session?.mentor?.name} (Mentor) -{" "}
    //         {session?.mentee?.name} (Mentee) -{" "}
    //         {new Date(session.session.date).toLocaleString()}
    //       </li>
    //     ))}
    //   </ul>
    //   <h2 className="text-xl font-semibold mt-4 mb-2">Session Report</h2>
    //   <ul>
    //     {sessionReport.map((report, index) => (
    //       <li key={index} className="mb-2">
    //         {report.subjectName}: {report.sessionCount} sessions
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    <h1>Not completed.</h1>
  );
}
