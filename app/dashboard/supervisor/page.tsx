import { redirect } from "next/navigation";
import { db } from "@/db/index";
import {
  sessions,
  subjects,
  users,
  sessionInterests,
  feedback,
} from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, User, BookOpen, Star } from "lucide-react";

export default async function SupervisorDashboard() {
  const session = await auth();
  if (!session || session?.user?.role !== "supervisor") {
    redirect("/login");
  }

  const allSessions = await db
    .select({
      session: sessions,
      mentor: {
        id: users.id,
        name: users.name,
      },
      mentee: {
        id: sessionInterests.menteeId,
      },
      subject: subjects,
      interestStatus: sessionInterests.status,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.mentorId, users.id))
    .innerJoin(subjects, eq(sessions.subjectId, subjects.id))
    .leftJoin(sessionInterests, eq(sessions.id, sessionInterests.sessionId))
    .orderBy(desc(sessions.date));

  // Fetch mentee names separately
  const menteeIds = allSessions
    .map((session) => session.mentee?.id)
    .filter(Boolean);
  const menteeNames = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .where(sql`${users.id} IN ${menteeIds}`);

  // Create a map of mentee ids to names
  const menteeNameMap = new Map(
    menteeNames.map((mentee) => [mentee.id, mentee.name])
  );

  // Add mentee names to allSessions
  const sessionsWithMenteeNames = allSessions.map((session) => ({
    ...session,
    mentee: session.mentee?.id
      ? {
          id: session.mentee.id,
          name: menteeNameMap.get(session.mentee.id) || "Unknown",
        }
      : null,
  }));

  const sessionReport = await db
    .select({
      subjectName: subjects.name,
      sessionCount: sql<number>`count(*)`,
    })
    .from(sessions)
    .innerJoin(subjects, eq(sessions.subjectId, subjects.id))
    .groupBy(subjects.name);

  const recentFeedback = await db
    .select({
      feedback: feedback,
      mentee: {
        id: users.id,
        name: users.name,
      },
      mentor: {
        id: sessions.mentorId,
      },
      subject: subjects,
    })
    .from(feedback)
    .innerJoin(sessions, eq(feedback.sessionId, sessions.id))
    .innerJoin(users, eq(feedback.menteeId, users.id))
    .innerJoin(subjects, eq(sessions.subjectId, subjects.id))
    .orderBy(desc(feedback.createdAt))
    .limit(5);

  // Fetch mentor names separately
  const mentorIds = recentFeedback.map((fb) => fb.mentor.id);
  const mentorNames = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .where(sql`${users.id} IN ${mentorIds}`);

  // Create a map of mentor ids to names
  const mentorNameMap = new Map(
    mentorNames.map((mentor) => [mentor.id, mentor.name])
  );

  // Add mentor names to recentFeedback
  const feedbackWithMentorNames = recentFeedback.map((fb) => ({
    ...fb,
    mentor: {
      id: fb.mentor.id,
      name: mentorNameMap.get(fb.mentor.id) || "Unknown",
    },
  }));

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>All Sessions</CardTitle>
            <CardDescription>
              Overview of all mentoring sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <ul className="space-y-4">
              {sessionsWithMenteeNames.map((session) => (
                <li
                  key={`${session.session.id}-${
                    session.mentee?.id || "unbooked"
                  }`}
                  className="border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{session.subject.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <User className="w-4 h-4 mr-1" /> Mentor:{" "}
                        {session.mentor.name}
                      </p>
                      {session.mentee && (
                        <p className="text-sm text-muted-foreground flex items-center">
                          <User className="w-4 h-4 mr-1" /> Mentee:{" "}
                          {session.mentee.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm flex items-center justify-end">
                        <Calendar className="w-4 h-4 mr-1" />{" "}
                        {new Date(session.session.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm flex items-center justify-end">
                        <Clock className="w-4 h-4 mr-1" />{" "}
                        {new Date(session.session.date).toLocaleTimeString()}
                      </p>
                      <p className="text-sm flex items-center justify-end">
                        Status: {session.session.status}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Session Report</CardTitle>
            <CardDescription>Number of sessions per subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sessionReport.map((report, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {report.subjectName}
                  </span>
                  <span className="font-semibold">
                    {report.sessionCount} sessions
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>Latest feedback from mentees</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {feedbackWithMentorNames.map((fb) => (
              <li
                key={fb.feedback.id}
                className="border rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    Rating: {fb.feedback.rating}/5
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {fb.feedback.createdAt?.toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm mb-2">{fb.feedback.comment}</p>
                <div className="text-xs text-muted-foreground">
                  <p>Mentee: {fb.mentee.name}</p>
                  <p>Mentor: {fb.mentor.name}</p>
                  <p>Subject: {fb.subject.name}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
