import type { EmptyRelations } from "drizzle-orm";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import { EnvironmentEnum } from "../../shared/enums/environment.enum.ts";
import { NODE_ENV } from "../config/env.config.ts";
import { getDatabaseConfig, type DatabaseConfig } from "./database.config.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export function createDatabase(customConfig: DatabaseConfig = getDatabaseConfig()): {
  pool: Pool;
  db: NodePgDatabase<EmptyRelations> & {
    $client: Pool;
  };
} {
  const config: PoolConfig = {
    host: customConfig.host,
    port: customConfig.port,
    user: customConfig.user,
    password: customConfig.password,
    database: customConfig.database,
    options: customConfig.timezone ? `-c timezone=${customConfig.timezone}` : undefined,
  };
  const pool = new Pool(config);
  const db = drizzle({ client: pool, logger: NODE_ENV === EnvironmentEnum.LOCAL });
  return { pool, db };
}

export async function testConnection(): Promise<void> {
  try {
    await pool.query("SELECT 1");
    console.log(`✅ POSTGRE connected -> ${getDatabaseConfig().host}:${getDatabaseConfig().port}/${getDatabaseConfig().database}`);
  } catch (error) {
    console.error("❌ Failed connect POSTGRE", error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  await pool.end();
  console.log(`✅ POSTGRE disconnected -> ${getDatabaseConfig().host}:${getDatabaseConfig().port}/${getDatabaseConfig().database}`);
}

export const { pool, db: database } = createDatabase();
