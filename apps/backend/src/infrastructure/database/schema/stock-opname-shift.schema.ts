import { bigserial, pgTable, smallint, timestamp, varchar } from "drizzle-orm/pg-core";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const stockOpnameShifts = pgTable("stock_opname_shifts", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique("stock_opname_shifts_code_key"),
  name: varchar("name", { length: 255 }).notNull(),
  ordering: smallint("ordering").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type StockOpnameShiftsRecord = typeof stockOpnameShifts.$inferSelect;
export type NewStockOpnameShiftsRecord = typeof stockOpnameShifts.$inferInsert;
