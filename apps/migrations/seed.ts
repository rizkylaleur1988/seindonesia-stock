import { runner } from "node-pg-migrate";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

async function main(): Promise<void> {
  await runner({
    databaseUrl: process.env.DATABASE_URL,
    dir: "seeders",
    migrationsTable: "pgmseeds",
    direction: "up",
    count: Infinity,
    verbose: true,
  });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
