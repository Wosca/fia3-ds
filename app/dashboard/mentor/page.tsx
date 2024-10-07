import { redirect } from "next/navigation";
import { db } from "@/db/index";
import {
  sessions,
  feedback,
  users,
  subjects,
  sessionInterests,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import CreateSessionDialog from "./create-session-dialog";
import MentorSessionsContent from "./mentor-sessions-content";

export default async function MentorDashboard() {
  const session = await auth();

  if (!session || session?.user?.role !== "mentor") {
    redirect("/login");
  }

  const mentorSessions = await db
    .select()
    .from(sessions)
    .innerJoin(users, eq(sessions.mentorId, users.id))
    .where(eq(users.id, Number(session.user.id)))
    .innerJoin(subjects, eq(sessions.subjectId, subjects.id));

  const mentorFeedback = await db
    .select()
    .from(feedback)
    .where(eq(feedback.menteeId, Number(session.user.id)));

  const subjectsArray = await db.select().from(subjects);

  const createSession = async (
    subject: { name: string; id: number },
    date: string,
    time: string,
    maxParticipants: number
  ) => {
    "use server";
    console.log(new Date(`${date}T${time}`));
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
        error: "An unexpected error occured creating that session.",
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
            <MentorSessionsContent mentorSessions={mentorSessions} />
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
                <li key={fb.id} className="border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      Rating: {fb.rating}/5
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {fb.createdAt?.toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm">{fb.comment}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
