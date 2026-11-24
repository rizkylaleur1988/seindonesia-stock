import { bigint, bigserial, date, pgTable, smallint, timestamp, varchar } from "drizzle-orm/pg-core";
import { stockOpnameShifts } from "./stock-opname-shift.schema.ts";
import { stores } from "./store.schema.ts";
import { users } from "./user.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const stockOpnames = pgTable("stock_opnames", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  store_id: bigint("store_id", { mode: "number" })
    .notNull()
    .references(() => stores.id),
  stock_opname_shift_id: bigint("stock_opname_shift_id", { mode: "number" })
    .notNull()
    .references(() => stockOpnameShifts.id),
  stock_opname_date: date("stock_opname_date").notNull(),
  notes: varchar("notes", { length: 500 }),
  status: smallint("status").notNull().default(1),
  statused_by: bigint("statused_by", { mode: "number" })
    .notNull()
    .references(() => users.id),
  statused_at: timestamp("statused_at", { withTimezone: true }).notNull().defaultNow(),
  created_by: bigint("created_by", { mode: "number" })
    .notNull()
    .references(() => users.id),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_by: bigint("updated_by", { mode: "number" })
    .notNull()
    .references(() => users.id),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type StockOpnamesRecord = typeof stockOpnames.$inferSelect;
export type NewStockOpnamesRecord = typeof stockOpnames.$inferInsert;
