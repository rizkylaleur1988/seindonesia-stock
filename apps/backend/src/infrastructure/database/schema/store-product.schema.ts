import { bigint, bigserial, integer, pgTable, timestamp, unique } from "drizzle-orm/pg-core";
import { products } from "./product.schema.ts";
import { stores } from "./store.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const storeProducts = pgTable(
  "store_products",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    store_id: bigint("store_id", { mode: "number" })
      .notNull()
      .references(() => stores.id),
    product_id: bigint("product_id", { mode: "number" })
      .notNull()
      .references(() => products.id),
    previous_stock: integer("previous_stock").notNull().default(0),
    stock: integer("stock").notNull().default(0),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique("store_products_unique").on(table.store_id, table.product_id)],
);

export type StoreProductsRecord = typeof storeProducts.$inferSelect;
export type NewStoreProductsRecord = typeof storeProducts.$inferInsert;
