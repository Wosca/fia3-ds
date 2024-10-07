"use client";
import { Calendar, Clock, User } from "lucide-react";

export default function MentorSessionsContent(props: {
  mentorSessions: {
    users: {
      name: string;
      email: string;
      id: number;
      role: "mentor" | "mentee" | "supervisor";
      passwordHash: string;
      createdAt: Date | null;
    };
    sessions: {
      id: number;
      date: Date;
      createdAt: Date | null;
      mentorId: number;
      subjectId: number;
      maxParticipants: number;
      status: "scheduled" | "completed" | "cancelled";
    };
    subjects: {
      name: string;
      id: number;
    };
  }[];
}) {
  return (
    <ul className="space-y-4">
      {props.mentorSessions.map((session) => (
        <li
          key={session.sessions.id}
          className="border rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{session.subjects.name}</p>
              <p className="text-sm text-muted-foreground flex items-center">
                <User className="w-4 h-4 mr-1" /> {session.users.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm flex items-center justify-end">
                <Calendar className="w-4 h-4 mr-1" />{" "}
                {new Date(session.sessions.date).toLocaleDateString()}
              </p>
              <p className="text-sm flex items-center justify-end">
                <Clock className="w-4 h-4 mr-1" />{" "}
                {new Date(session.sessions.date).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
