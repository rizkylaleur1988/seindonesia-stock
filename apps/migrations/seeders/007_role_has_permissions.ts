import type { MigrationBuilder } from "node-pg-migrate";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const tableName = "role_has_permissions";
const roleHasPermissions = [
  // Store Staff
  { permission_code: "product:view", role_code: "STORE_STAFF" },
  { permission_code: "stock-opname-shift:view", role_code: "STORE_STAFF" },
  { permission_code: "store-product:view", role_code: "STORE_STAFF" },
  { permission_code: "store-product:detail", role_code: "STORE_STAFF" },
  { permission_code: "stock-opname:view", role_code: "STORE_STAFF" },
  { permission_code: "stock-opname:detail", role_code: "STORE_STAFF" },
  { permission_code: "stock-opname:store", role_code: "STORE_STAFF" },
  { permission_code: "stock-opname:update", role_code: "STORE_STAFF" },
  { permission_code: "stock-opname:delete", role_code: "STORE_STAFF" },
  { permission_code: "stock-opname:approval", role_code: "STORE_STAFF" },
  // Store Manager
  { permission_code: "store:view", role_code: "STORE_MANAGER" },
  { permission_code: "product:view", role_code: "STORE_MANAGER" },
  { permission_code: "stock-opname-shift:view", role_code: "STORE_MANAGER" },
  { permission_code: "store-product:view", role_code: "STORE_MANAGER" },
  { permission_code: "store-product:detail", role_code: "STORE_MANAGER" },
  { permission_code: "store-product:store", role_code: "STORE_MANAGER" },
  { permission_code: "store-product:update", role_code: "STORE_MANAGER" },
  { permission_code: "store-product:delete", role_code: "STORE_MANAGER" },
  { permission_code: "stock-opname:view", role_code: "STORE_MANAGER" },
  { permission_code: "stock-opname:detail", role_code: "STORE_MANAGER" },
  { permission_code: "stock-opname:approval", role_code: "STORE_MANAGER" },
  // SUPERADMIN
  { permission_code: "permission:view", role_code: "SUPER_ADMIN" }, //
  { permission_code: "permission:detail", role_code: "SUPER_ADMIN" },
  { permission_code: "permission:store", role_code: "SUPER_ADMIN" },
  { permission_code: "permission:update", role_code: "SUPER_ADMIN" },
  { permission_code: "permission:delete", role_code: "SUPER_ADMIN" },
  { permission_code: "product:view", role_code: "SUPER_ADMIN" },
  { permission_code: "product:detail", role_code: "SUPER_ADMIN" },
  { permission_code: "product:store", role_code: "SUPER_ADMIN" },
  { permission_code: "product:update", role_code: "SUPER_ADMIN" },
  { permission_code: "product:delete", role_code: "SUPER_ADMIN" },
  { permission_code: "role:view", role_code: "SUPER_ADMIN" },
  { permission_code: "role:detail", role_code: "SUPER_ADMIN" },
  { permission_code: "role:store", role_code: "SUPER_ADMIN" },
  { permission_code: "role:update", role_code: "SUPER_ADMIN" },
  { permission_code: "role:delete", role_code: "SUPER_ADMIN" },
  { permission_code: "store-product:view", role_code: "SUPER_ADMIN" },
  { permission_code: "store-product:detail", role_code: "SUPER_ADMIN" },
  { permission_code: "store-product:store", role_code: "SUPER_ADMIN" },
  { permission_code: "store-product:update", role_code: "SUPER_ADMIN" },
  { permission_code: "store-product:delete", role_code: "SUPER_ADMIN" },
  { permission_code: "store:view", role_code: "SUPER_ADMIN" },
  { permission_code: "store:detail", role_code: "SUPER_ADMIN" },
  { permission_code: "store:store", role_code: "SUPER_ADMIN" },
  { permission_code: "store:update", role_code: "SUPER_ADMIN" },
  { permission_code: "store:delete", role_code: "SUPER_ADMIN" },
  { permission_code: "user:view", role_code: "SUPER_ADMIN" },
  { permission_code: "user:detail", role_code: "SUPER_ADMIN" },
  { permission_code: "user:store", role_code: "SUPER_ADMIN" },
  { permission_code: "user:update", role_code: "SUPER_ADMIN" },
  { permission_code: "user:delete", role_code: "SUPER_ADMIN" },
  { permission_code: "stock-opname-shift:view", role_code: "SUPER_ADMIN" },
  { permission_code: "stock-opname-shift:detail", role_code: "SUPER_ADMIN" },
  { permission_code: "stock-opname-shift:store", role_code: "SUPER_ADMIN" },
  { permission_code: "stock-opname-shift:update", role_code: "SUPER_ADMIN" },
  { permission_code: "stock-opname-shift:delete", name: "SUPER_ADMIN" },
  { permission_code: "stock-opname:view", role_code: "SUPER_ADMIN" },
  { permission_code: "stock-opname:detail", role_code: "SUPER_ADMIN" },
  { permission_code: "stock-opname:store", role_code: "SUPER_ADMIN" },
  { permission_code: "stock-opname:update", role_code: "SUPER_ADMIN" },
  { permission_code: "stock-opname:delete", role_code: "SUPER_ADMIN" },
  { permission_code: "stock-opname:approval", role_code: "SUPER_ADMIN" },
  { permission_code: "role-permission:view", role_code: "SUPER_ADMIN" },
  { permission_code: "role-permission:detail", role_code: "SUPER_ADMIN" },
  { permission_code: "role-permission:store", role_code: "SUPER_ADMIN" },
  { permission_code: "role-permission:update", role_code: "SUPER_ADMIN" },
  { permission_code: "role-permission:delete", role_code: "SUPER_ADMIN" },
];

export function up(pgm: MigrationBuilder): void {
  const values = roleHasPermissions
    .map(({ permission_code, role_code }) => {
      return `(SELECT A.id as permission_id, B.id as role_id FROM permissions A CROSS JOIN roles B WHERE A.code = '${permission_code}' AND B.code = '${role_code}')`;
    })
    .join(" UNION ALL ");
  pgm.sql(
    `INSERT INTO ${tableName} (permission_id, role_id) ${values} ON CONFLICT (permission_id, role_id) DO NOTHING`,
  );
}

export function down(pgm: MigrationBuilder): void {
  const values = roleHasPermissions
    .map(({ permission_code, role_code }) => {
      return `(permission_id = (SELECT id FROM permissions WHERE code = '${permission_code}') AND role_id = (SELECT id FROM roles WHERE code = '${role_code}'))`;
    })
    .join(" AND ");
  pgm.sql(`DELETE FROM ${tableName} WHERE ${values}`);
}
