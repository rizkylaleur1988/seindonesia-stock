import { bigint, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { stores } from "./store.schema.ts";
import { users } from "./user.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const userStores = pgTable(
  "user_has_stores",
  {
    user_id: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id),
    store_id: bigint("store_id", { mode: "number" })
      .notNull()
      .references(() => stores.id),
  },
  (table) => [primaryKey({ name: "user_has_stores_pk", columns: [table.user_id, table.store_id] })],
);

export type UserStoreRecord = typeof userStores.$inferSelect;
export type NewUserStoreRecord = typeof userStores.$inferInsert;
