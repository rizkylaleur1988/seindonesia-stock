import type { MigrationBuilder } from "node-pg-migrate";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const tableName = "stores";
const stores = [
  {
    code: "STORE001",
    name: "Store Cikunir",
    address: "Jl. Cikunir No. 1, Bekasi, Jawa Barat",
  },
  {
    code: "STORE002",
    name: "Store Kwitang",
    address: "Jl. Kwitang No. 1, Jakarta Pusat, DKI Jakarta",
  },
  {
    code: "STORE003",
    name: "Store Depok",
    address: "Jl. Margonda Raya No. 1, Depok, Jawa Barat",
  },
];

export function up(pgm: MigrationBuilder): void {
  const values = stores
    .map(({ code, name, address }) => {
      return `('${code}', '${name}', '${address}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
    })
    .join(", ");
  pgm.sql(
    `INSERT INTO ${tableName} (code, name, address, created_at, updated_at) VALUES ${values} ON CONFLICT (code) DO NOTHING`,
  );
}

export function down(pgm: MigrationBuilder): void {
  const codes = stores.map(({ code }) => `'${code}'`).join(", ");
  pgm.sql(`DELETE FROM ${tableName} WHERE code in (${codes})`);
}
