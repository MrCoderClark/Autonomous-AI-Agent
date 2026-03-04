import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const subscriptionsStatusEnum = pgEnum("subscriptions_status", [
  "none",
  "active",
  "canceled",
  "past_due",
]);

export const integrationProvidersEnum = pgEnum("integration_providers", [
  "gmail",
  "google_calendar",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "completed",
  "canceled",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
]);

export const agentRunStatusEnum = pgEnum("agent_run_status", [
  "running",
  "success",
  "failed",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name"),
  subscriptionStatus: subscriptionsStatusEnum("subscription_status")
    .notNull()
    .default("none"),
  subscriptionId: text("subscription_id"),
  agentEnabled: boolean("agent_enabled").notNull().default(true),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  preferences: jsonb("preferences").notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const integrations = pgTable("integrations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  provider: integrationProvidersEnum("provider").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  scope: text("scope").array().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: taskStatusEnum("status").notNull().default("pending"),
  priority: taskPriorityEnum("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export interface ActionLogEntry {
  emailId: string;
  subject: string;
  from: string;
  date: string;
  status: "success" | "error";
  summary?: string;
  priority?: string;
  category?: string;
  needsReply?: boolean;
  draftReply?: string | null;
  actionItems?: {
    title: string;
    description: string;
    dueDate: string | null;
  }[];
  tasksCreated?: number;
  draftCreated?: boolean;
  eventCreated?: boolean;
  error?: string;
}

export const agenRuns = pgTable("agent_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: agentRunStatusEnum("status").notNull().default("running"),
  summary: text("summary"),
  actionsLog: jsonb("actions_log")
    .$type<ActionLogEntry[]>()
    .notNull()
    .default([]),
  emailsProcessed: integer("emails_processed").notNull().default(0),
  tasksCreated: integer("tasks_created").notNull().default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  durationMs: integer("duration_ms"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Integration = typeof integrations.$inferSelect;
export type NewIntegration = typeof integrations.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type AgentRun = typeof agenRuns.$inferSelect;
export type NewAgentRun = typeof agenRuns.$inferInsert;

export type ProcessedEmail = ActionLogEntry & { processedAt: Date };
