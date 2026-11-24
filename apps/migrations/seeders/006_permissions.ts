import type { MigrationBuilder } from "node-pg-migrate";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const tableName = "permissions";
const permissions = [
  // permission
  { code: "permission:view", name: "View Any Permission" },
  { code: "permission:detail", name: "View Permission" },
  { code: "permission:store", name: "Store Permission" },
  { code: "permission:update", name: "Update Permission" },
  { code: "permission:delete", name: "Delete Permission" },
  // product
  { code: "product:view", name: "View Any Product" },
  { code: "product:detail", name: "View Product" },
  { code: "product:store", name: "Store Product" },
  { code: "product:update", name: "Update Product" },
  { code: "product:delete", name: "Delete Product" },
  // role
  { code: "role:view", name: "View Any Role" },
  { code: "role:detail", name: "View Role" },
  { code: "role:store", name: "Store Role" },
  { code: "role:update", name: "Update Role" },
  { code: "role:delete", name: "Delete Role" },
  // store product
  { code: "store-product:view", name: "View Any Store Product" },
  { code: "store-product:detail", name: "View Store Product" },
  { code: "store-product:store", name: "Store Store Product" },
  { code: "store-product:update", name: "Update Store Product" },
  { code: "store-product:delete", name: "Delete Store Product" },
  // store
  { code: "store:view", name: "View Any Store" },
  { code: "store:detail", name: "View Store" },
  { code: "store:store", name: "Store Store" },
  { code: "store:update", name: "Update Store" },
  { code: "store:delete", name: "Delete Store" },
  // user
  { code: "user:view", name: "View Any User" },
  { code: "user:detail", name: "View User" },
  { code: "user:store", name: "Store User" },
  { code: "user:update", name: "Update User" },
  { code: "user:delete", name: "Delete User" },
  // stock opname shift
  { code: "stock-opname-shift:view", name: "View Any Stock Opname Shift" },
  { code: "stock-opname-shift:detail", name: "View Stock Opname Shift" },
  { code: "stock-opname-shift:store", name: "Store Stock Opname Shift" },
  { code: "stock-opname-shift:update", name: "Update Stock Opname Shift" },
  { code: "stock-opname-shift:delete", name: "Delete Stock Opname Shift" },
  // stock opname
  { code: "stock-opname:view", name: "View Any Stock Opname" },
  { code: "stock-opname:detail", name: "View Stock Opname" },
  { code: "stock-opname:store", name: "Store Stock Opname" },
  { code: "stock-opname:update", name: "Update Stock Opname" },
  { code: "stock-opname:delete", name: "Delete Stock Opname" },
  { code: "stock-opname:approval", name: "Approval Stock Opname" },
  // role permission
  { code: "role-permission:view", name: "View Any Role Permission" },
  { code: "role-permission:detail", name: "View Role Permission" },
  { code: "role-permission:store", name: "Store Role Permission" },
  { code: "role-permission:update", name: "Update Role Permission" },
  { code: "role-permission:delete", name: "Delete Role Permission" },
];

export function up(pgm: MigrationBuilder): void {
  const values = permissions
    .map(({ code, name }) => {
      return `('${code}', '${name}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
    })
    .join(", ");
  pgm.sql(
    `INSERT INTO ${tableName} (code, name, created_at, updated_at) VALUES ${values} ON CONFLICT (code) DO NOTHING`,
  );
}

export function down(pgm: MigrationBuilder): void {
  const codes = permissions.map(({ code }) => `'${code}'`).join(", ");
  pgm.sql(`DELETE FROM ${tableName} WHERE code in (${codes})`);
}
