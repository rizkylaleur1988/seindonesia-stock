import type { MigrationBuilder } from "node-pg-migrate";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const tableName = "products";
const products = [
  { code: "PRD001", name: "Indomie Goreng", stock: 0 },
  { code: "PRD002", name: "Aqua 600ml", stock: 0 },
  { code: "PRD003", name: "Mie Sedaap Goreng", stock: 0 },
  { code: "PRD004", name: "Teh Botol Sosro", stock: 0 },
  { code: "PRD005", name: "Kopi Kapal Api", stock: 0 },
  { code: "PRD006", name: "Chitato Original", stock: 0 },
  { code: "PRD007", name: "Beras 5kg", stock: 0 },
  { code: "PRD008", name: "Minyak Goreng 1L", stock: 0 },
  { code: "PRD009", name: "Gula Pasir 1kg", stock: 0 },
  { code: "PRD010", name: "Susu Ultra Milk 1L", stock: 0 },
];

export function up(pgm: MigrationBuilder): void {
  const values = products
    .map(({ code, name, stock }) => {
      return `('${code}', '${name}', '${stock}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
    })
    .join(", ");
  pgm.sql(
    `INSERT INTO ${tableName} (code, name, stock, created_at, updated_at) VALUES ${values} ON CONFLICT (code) DO NOTHING`,
  );
}

export function down(pgm: MigrationBuilder): void {
  const codes = products.map(({ code }) => `'${code}'`).join(", ");
  pgm.sql(`DELETE FROM ${tableName} WHERE code in (${codes})`);
}
