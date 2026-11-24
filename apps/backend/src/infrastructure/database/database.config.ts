import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_TIMEZONE, DB_USER } from "../config/env.config.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  timezone: string;
}

export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    timezone: DB_TIMEZONE,
  };
}
