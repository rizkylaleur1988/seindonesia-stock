import type { MigrationBuilder } from "node-pg-migrate";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const tableName = "user_has_stores";
const userHasStores = [
  { email: "staff.store1@seindonesia.com", store_code: "STORE001" },
  {
    email: "staff.manager@seindonesia.com",
    store_code: "STORE001",
  },
];

export function up(pgm: MigrationBuilder): void {
  const values = userHasStores
    .map(({ email, store_code }) => {
      return `(SELECT A.id as user_id, B.id as store_id FROM users A CROSS JOIN stores B WHERE A.email = '${email}' AND B.code = '${store_code}')`;
    })
    .join(" UNION ALL ");
  pgm.sql(
    `INSERT INTO ${tableName} (user_id, store_id) ${values} ON CONFLICT (user_id, store_id) DO NOTHING`,
  );
}

export function down(pgm: MigrationBuilder): void {
  const values = userHasStores
    .map(({ email, store_code }) => {
      return `(user_id = (SELECT id FROM users WHERE email = '${email}') AND store_id = (SELECT id FROM stores WHERE code = '${store_code}'))`;
    })
    .join(" AND ");
  pgm.sql(`DELETE FROM ${tableName} WHERE ${values}`);
}
