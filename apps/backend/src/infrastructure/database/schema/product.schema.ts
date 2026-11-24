import { bigserial, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const products = pgTable("products", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique("products_code_key"),
  name: varchar("name", { length: 255 }).notNull(),
  stock: integer("stock").notNull().default(0),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProductsRecord = typeof products.$inferSelect;
export type NewProductsRecord = typeof products.$inferInsert;
