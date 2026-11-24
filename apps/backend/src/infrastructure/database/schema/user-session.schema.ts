import { bigint, bigserial, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./user.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const userSessions = pgTable("user_sessions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  user_id: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => users.id),
  access_token_hash: varchar("access_token_hash", { length: 255 }).notNull(),
  refresh_token_hash: varchar("refresh_token_hash", { length: 255 }).notNull(),
  access_token_expires_at: timestamp("access_token_expires_at", { withTimezone: true }).notNull(),
  refresh_token_expires_at: timestamp("refresh_token_expires_at", { withTimezone: true }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UserSessionRecord = typeof userSessions.$inferSelect;
export type NewUserSessionRecord = typeof userSessions.$inferInsert;
