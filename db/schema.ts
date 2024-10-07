import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["mentor", "mentee", "supervisor"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id")
    .notNull()
    .references(() => users.id),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id),
  date: timestamp("date").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  status: text("status", {
    enum: ["scheduled", "completed", "cancelled"],
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessionInterests = pgTable(
  "session_interests",
  {
    id: serial("id").primaryKey(),
    sessionId: integer("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    menteeId: integer("mentee_id")
      .notNull()
      .references(() => users.id),
    status: text("status", {
      enum: ["interested", "confirmed", "attended"],
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      sessionMenteeUnique: uniqueIndex("session_mentee_unique").on(
        table.sessionId,
        table.menteeId
      ),
    };
  }
);

export const feedback = pgTable(
  "feedback",
  {
    id: serial("id").primaryKey(),
    sessionId: integer("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    menteeId: integer("mentee_id")
      .notNull()
      .references(() => users.id),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      sessionMenteeUnique: uniqueIndex("feedback_session_mentee_unique").on(
        table.sessionId,
        table.menteeId
      ),
    };
  }
);
