import { bigserial, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const stores = pgTable("stores", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique("stores_code_key"),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type StoresRecord = typeof stores.$inferSelect;
export type NewStoresRecord = typeof stores.$inferInsert;
