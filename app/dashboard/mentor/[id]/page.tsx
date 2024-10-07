import { auth } from "@/auth";
import { db } from "@/db";
import { sessionInterests, sessions, subjects, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users, Clock } from "lucide-react";

export default async function MentorSessionView({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session || session?.user?.role !== "mentor") {
    redirect("/login");
  }

  const mentorSession = await db
    .select({
      session: sessions,
      subject: subjects,
      interests: sessionInterests,
      mentee: users,
    })
    .from(sessions)
    .where(
      and(
        eq(sessions.id, Number(params.id)),
        eq(sessions.mentorId, Number(session.user.id))
      )
    )
    .innerJoin(subjects, eq(sessions.subjectId, subjects.id))
    .leftJoin(sessionInterests, eq(sessions.id, sessionInterests.sessionId))
    .leftJoin(users, eq(sessionInterests.menteeId, users.id))
    .limit(1);

  if (mentorSession.length === 0) {
    redirect("/dashboard/mentor");
  }

  const { session: sessionData, subject, interests, mentee } = mentorSession[0];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Mentor Session Details</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{subject.name} Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
            <span>{sessionData.date.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span>Max Participants: {sessionData.maxParticipants}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span>
              Status:{" "}
              <Badge
                variant={
                  sessionData.status === "scheduled" ? "default" : "secondary"
                }
              >
                {sessionData.status}
              </Badge>
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Interests</CardTitle>
        </CardHeader>
        <CardContent>
          {interests ? (
            <ul className="space-y-2">
              <li
                key={interests.id}
                className="flex justify-between items-center"
              >
                <span>{mentee?.name}</span>
                <Badge>{interests.status}</Badge>
              </li>
            </ul>
          ) : (
            <p>No registered interests yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
