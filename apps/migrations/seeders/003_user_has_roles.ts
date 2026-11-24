import type { MigrationBuilder } from "node-pg-migrate";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const tableName = "user_has_roles";
const userHasRoles = [
  { email: "system@seindonesia.com", role_code: "SUPER_ADMIN" },
  { email: "staff.store1@seindonesia.com", role_code: "STORE_STAFF" },
  { email: "staff.manager@seindonesia.com", role_code: "STORE_MANAGER" },
];

export function up(pgm: MigrationBuilder): void {
  const values = userHasRoles
    .map(({ email, role_code }) => {
      return `(SELECT A.id as user_id, B.id as role_id FROM users A CROSS JOIN roles B WHERE A.email = '${email}' AND B.code = '${role_code}')`;
    })
    .join(" UNION ALL ");
  pgm.sql(
    `INSERT INTO ${tableName} (user_id, role_id) ${values} ON CONFLICT (user_id, role_id) DO NOTHING`,
  );
}

export function down(pgm: MigrationBuilder): void {
  const values = userHasRoles
    .map(({ email, role_code }) => {
      return `(user_id = (SELECT id FROM users WHERE email = '${email}') AND role_id = (SELECT id FROM roles WHERE code = '${role_code}'))`;
    })
    .join(" AND ");
  pgm.sql(`DELETE FROM ${tableName} WHERE ${values}`);
}
