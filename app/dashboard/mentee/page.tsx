import { redirect } from "next/navigation";
import { db } from "@/db/index";
import {
  sessionInterests,
  sessions,
  subjects,
  users,
  feedback,
} from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import Link from "next/link";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";
import BookHandler from "./book-handler";
import FeedbackDialog from "./feedback-dialog";

export default async function MenteeDashboard() {
  const session = await auth();

  if (!session || session?.user?.role !== "mentee") {
    redirect("/dashboard");
  }

  const availableSubjects = await db.select().from(subjects);

  const menteeBookings = await db
    .select()
    .from(sessions)
    .innerJoin(users, eq(sessions.mentorId, users.id))
    .innerJoin(subjects, eq(sessions.subjectId, subjects.id))
    .leftJoin(
      sessionInterests,
      and(
        eq(sessions.id, sessionInterests.sessionId),
        eq(sessionInterests.menteeId, Number(session.user.id))
      )
    );

  const lastThreeSessions = await (
    await db
      .select({
        session: sessions,
        mentor: users,
        subject: subjects,
      })
      .from(sessions)
      .innerJoin(sessionInterests, eq(sessions.id, sessionInterests.sessionId))
      .innerJoin(users, eq(sessions.mentorId, users.id))
      .innerJoin(subjects, eq(sessions.subjectId, subjects.id))
      .where(eq(sessionInterests.menteeId, Number(session.user.id)))
      .orderBy(desc(sessions.date))
      .limit(3)
  ).filter((session) => session.session.date < new Date());

  const handleBookDB = async (sessionId: number, type: "book" | "remove") => {
    "use server";
    if (type === "book") {
      try {
        await db.insert(sessionInterests).values({
          sessionId: sessionId,
          menteeId: Number(session.user.id),
          status: "interested",
        });
        return { success: true };
      } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to book session" };
      }
    } else {
      try {
        await db
          .delete(sessionInterests)
          .where(
            and(
              eq(sessionInterests.sessionId, sessionId),
              eq(sessionInterests.menteeId, Number(session.user.id))
            )
          );
        return { success: true };
      } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to remove booking" };
      }
    }
  };

  const submitFeedback = async (
    sessionId: number,
    rating: number,
    comment: string
  ) => {
    "use server";
    try {
      await db.insert(feedback).values({
        sessionId: sessionId,
        menteeId: Number(session.user.id),
        rating: rating,
        comment: comment,
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: "Failed to submit feedback" };
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Mentee Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Subjects</CardTitle>
            <CardDescription>
              Choose a subject to book a session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {availableSubjects.map((subject) => (
                <li key={subject.id}>
                  <Button variant="outline">{subject.name}</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available Tutorials</CardTitle>
            <CardDescription>
              View the upcoming tutorials already scheduled by a student mentor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {menteeBookings.map((booking) => {
                if (new Date(booking.sessions.date) < new Date()) return null;
                return (
                  <li
                    key={booking.sessions.id}
                    className="border rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{booking.subjects.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <User className="w-4 h-4 mr-1" /> {booking.users.name}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm flex items-center justify-end">
                          <Calendar className="w-4 h-4 mr-1" />{" "}
                          {new Date(booking.sessions.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm flex items-center justify-end">
                          <Clock className="w-4 h-4 mr-1" />{" "}
                          {new Date(booking.sessions.date).toLocaleTimeString()}
                        </p>
                      </div>
                      <BookHandler
                        sessionInfo={{
                          sessionId: booking.sessions.id,
                          booked: booking.session_interests ? true : false,
                        }}
                        handleBookDB={handleBookDB}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>
              Your last three completed sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {lastThreeSessions.map((session) => (
                <li
                  key={session.session.id}
                  className="border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{session.subject.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <User className="w-4 h-4 mr-1" /> {session.mentor.name}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm flex items-center justify-end">
                        <Calendar className="w-4 h-4 mr-1" />{" "}
                        {new Date(session.session.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm flex items-center justify-end">
                        <Clock className="w-4 h-4 mr-1" />{" "}
                        {new Date(session.session.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <FeedbackDialog
                      sessionId={session.session.id}
                      submitFeedback={submitFeedback}
                    />
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
