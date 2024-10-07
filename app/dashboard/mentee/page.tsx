import { redirect } from "next/navigation";
import { db } from "@/db/index";
import { sessionInterests, sessions, subjects, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
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
import BookSessionDialog from "./book-session-dialog";
import BookHandler from "./book-handler";

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
                  <BookSessionDialog subject={subject} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avaliable Tutorials</CardTitle>
            <CardDescription>
              View the upcoming tutorials already scheduled by a student mentor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {menteeBookings.map((booking) => (
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
                  {booking.sessions.status === "completed" && (
                    <div className="mt-2">
                      <Link href={`/provide-feedback/${booking.sessions.id}`}>
                        <Button variant="outline" size="sm">
                          Provide Feedback
                        </Button>
                      </Link>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
