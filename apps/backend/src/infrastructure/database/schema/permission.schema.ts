import { bigserial, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const permissions = pgTable("permissions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique("permissions_code_key"),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PermissionsRecord = typeof permissions.$inferSelect;
export type NewPermissionsRecord = typeof permissions.$inferInsert;
