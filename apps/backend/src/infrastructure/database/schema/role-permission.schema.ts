import { bigint, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { permissions } from "./permission.schema.ts";
import { roles } from "./role.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const rolePermissions = pgTable(
  "role_has_permissions",
  {
    role_id: bigint("role_id", { mode: "number" })
      .notNull()
      .references(() => roles.id),
    permission_id: bigint("permission_id", { mode: "number" })
      .notNull()
      .references(() => permissions.id),
  },
  (table) => [primaryKey({ name: "role_has_permissions_pk", columns: [table.role_id, table.permission_id] })],
);

export type RolePermissionRecord = typeof rolePermissions.$inferSelect;
export type NewRolePermissionRecord = typeof rolePermissions.$inferInsert;
