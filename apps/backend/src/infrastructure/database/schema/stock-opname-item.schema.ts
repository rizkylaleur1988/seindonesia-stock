import { bigint, bigserial, integer, pgTable, unique, varchar } from "drizzle-orm/pg-core";
import { products } from "./product.schema.ts";
import { stockOpnames } from "./stock-opname.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const stockOpnameItems = pgTable(
  "stock_opname_items",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    stock_opname_id: bigint("stock_opname_id", { mode: "number" })
      .notNull()
      .references(() => stockOpnames.id),
    product_id: bigint("product_id", { mode: "number" })
      .notNull()
      .references(() => products.id),
    counted_qty: integer("counted_qty").notNull(),
    system_qty: integer("system_qty"),
    notes: varchar("notes", { length: 500 }),
  },
  (table) => [unique("stock_opname_items_unique").on(table.stock_opname_id, table.product_id)],
);

export type StockOpnameItemsRecord = typeof stockOpnameItems.$inferSelect;
export type NewStockOpnameItemsRecord = typeof stockOpnameItems.$inferInsert;
