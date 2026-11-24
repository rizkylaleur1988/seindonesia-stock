import type { MigrationBuilder } from "node-pg-migrate";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const tableName = "roles";
const roles = [
  { code: "SUPER_ADMIN", name: "Super Administrator" },
  { code: "STORE_MANAGER", name: "Store Manager" },
  { code: "STORE_STAFF", name: "Store Staff" },
];

export function up(pgm: MigrationBuilder): void {
  const values = roles
    .map(({ code, name }) => {
      return `('${code}', '${name}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
    })
    .join(", ");
  pgm.sql(
    `INSERT INTO ${tableName} (code, name, created_at, updated_at) VALUES ${values} ON CONFLICT (code) DO NOTHING`,
  );
}

export function down(pgm: MigrationBuilder): void {
  const codes = roles.map(({ code }) => `'${code}'`).join(", ");
  pgm.sql(`DELETE FROM ${tableName} WHERE code in (${codes})`);
}
