import type { MigrationBuilder } from "node-pg-migrate";
import { PasswordHasherService } from "../utils/password-hasher.service";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const tableName = "users";
const passwordHasher = new PasswordHasherService();
const users = [
  { name: "System", email: "system@seindonesia.com" },
  { name: "Staff Store 1", email: "staff.store1@seindonesia.com" },
  { name: "Staff Manager", email: "staff.manager@seindonesia.com" },
];

export async function up(pgm: MigrationBuilder): Promise<void> {
  const values = (
    await Promise.all(
      users.map(async ({ name, email }) => {
        const password = await passwordHasher.hash("P@ssw0rd");
        return `('${name}', '${email}', '${password}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
      }),
    )
  ).join(", ");
  pgm.sql(
    `INSERT INTO ${tableName} (name, email, password, created_at, updated_at) VALUES ${values} ON CONFLICT (email) DO NOTHING`,
  );
}

export function down(pgm: MigrationBuilder): void {
  const emails = users.map(({ email }) => `'${email}'`).join(", ");
  pgm.sql(`DELETE FROM ${tableName} WHERE email in (${emails})`);
}
