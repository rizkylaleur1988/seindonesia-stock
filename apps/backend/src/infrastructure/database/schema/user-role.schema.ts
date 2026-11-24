import { bigint, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { roles } from "./role.schema.ts";
import { users } from "./user.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const userRoles = pgTable(
  "user_has_roles",
  {
    user_id: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id),
    role_id: bigint("role_id", { mode: "number" })
      .notNull()
      .references(() => roles.id),
  },
  (table) => [primaryKey({ name: "user_has_roles_pk", columns: [table.user_id, table.role_id] })],
);

export type UserRoleRecord = typeof userRoles.$inferSelect;
export type NewUserRoleRecord = typeof userRoles.$inferInsert;
