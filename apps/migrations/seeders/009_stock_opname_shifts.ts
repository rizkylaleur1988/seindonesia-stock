import type { MigrationBuilder } from "node-pg-migrate";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const tableName = "stock_opname_shifts";
const stockOpnameShifts = [
  {
    code: "morning",
    name: "Pagi Hari (08:00 - 09:00)",
    ordering: 1,
  },
  {
    code: "afternoon",
    name: "Sore Hari (19:00 - 20:00)",
    ordering: 2,
  },
];

export function up(pgm: MigrationBuilder): void {
  const values = stockOpnameShifts
    .map(({ code, name, ordering }) => {
      return `('${code}', '${name}', '${ordering}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
    })
    .join(", ");
  pgm.sql(
    `INSERT INTO ${tableName} (code, name, ordering, created_at, updated_at) VALUES ${values} ON CONFLICT (code) DO NOTHING`,
  );
}

export function down(pgm: MigrationBuilder): void {
  const codes = stockOpnameShifts.map(({ code }) => `'${code}'`).join(", ");
  pgm.sql(`DELETE FROM ${tableName} WHERE code in (${codes})`);
}
