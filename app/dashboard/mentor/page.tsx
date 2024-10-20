import { redirect } from "next/navigation";
import { db } from "@/db/index";
import {
  sessions,
  feedback,
  users,
  subjects,
  sessionInterests,
} from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, Calendar, Clock, Users } from "lucide-react";
import CreateSessionDialog from "./create-session-dialog";

export default async function MentorDashboard() {
  const session = await auth();

  if (!session || session?.user?.role !== "mentor") {
    redirect("/login");
  }

  const mentorSessions = await db
    .select({
      session: sessions,
      subject: subjects,
      attendeeCount: count(sessionInterests.id).as("attendeeCount"),
    })
    .from(sessions)
    .innerJoin(subjects, eq(sessions.subjectId, subjects.id))
    .leftJoin(sessionInterests, eq(sessions.id, sessionInterests.sessionId))
    .where(eq(sessions.mentorId, Number(session.user.id)))
    .groupBy(sessions.id, subjects.id)
    .orderBy(desc(sessions.date));

  const mentorFeedback = await db
    .select({
      feedback: feedback,
      mentee: users,
      subject: subjects,
    })
    .from(feedback)
    .innerJoin(sessions, eq(feedback.sessionId, sessions.id))
    .innerJoin(users, eq(feedback.menteeId, users.id))
    .innerJoin(subjects, eq(sessions.subjectId, subjects.id))
    .where(eq(sessions.mentorId, Number(session.user.id)))
    .orderBy(desc(feedback.createdAt));

  const subjectsArray = await db.select().from(subjects);

  const createSession = async (
    subject: { name: string; id: number },
    date: string,
    time: string,
    maxParticipants: number
  ) => {
    "use server";
    try {
      await db.insert(sessions).values({
        mentorId: Number(session.user.id),
        subjectId: subject.id,
        date: new Date(`${date}T${time}`),
        maxParticipants: maxParticipants,
        status: "scheduled",
      });
    } catch (error) {
      console.error(error);
      return {
        error: "An unexpected error occurred creating that session.",
        success: false,
      };
    }
    return { success: true };
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
        <CreateSessionDialog
          createSession={createSession}
          subjects={subjectsArray}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled mentoring sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {mentorSessions.map((session) => (
                <li
                  key={session.session.id}
                  className="border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <a
                        href={"/dashboard/mentor/" + session.session.id}
                        className="font-semibold hover:underline"
                      >
                        {session.subject.name}
                      </a>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(session.session.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(session.session.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm flex items-center justify-end">
                        <Users className="w-4 h-4 mr-1" />
                        Attendees: {session.attendeeCount} /{" "}
                        {session.session.maxParticipants}
                      </p>
                      <p className="text-sm">
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
            <CardTitle>Feedback Received</CardTitle>
            <CardDescription>What your mentees are saying</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {mentorFeedback.map((fb) => (
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
                    <p>Subject: {fb.subject.name}</p>
                    <p>Mentee: {fb.mentee.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
