import dotenv from "dotenv";
import { EnvironmentEnum } from "../../shared/enums/environment.enum.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

dotenv.config();

// app
export const NODE_ENV: EnvironmentEnum = (process.env.NODE_ENV as EnvironmentEnum) ?? EnvironmentEnum.LOCAL;
export const APP_NAME: string = process.env.APP_NAME ?? "authentication";
export const PORT: number = process.env.PORT ? Number(process.env.PORT) : 3000;
export const THROTTLE_LIMIT: number = process.env.THROTTLE_LIMIT ? Number(process.env.THROTTLE_LIMIT) : 60;
export const LOG_LEVEL: string = process.env.LOG_LEVEL ?? "info";
// api response
export const API_RESPONSE_WITH_WRAPPER: boolean = (process.env.API_RESPONSE_WITH_WRAPPER ?? "false") === "true";
export const API_RESPONSE_KEY_WRAPPER: string = process.env.API_RESPONSE_KEY_WRAPPER ?? "response";
export const API_RESPONSE_KEY_CODE: string = process.env.API_RESPONSE_KEY_CODE ?? "code";
export const API_RESPONSE_KEY_MESSAGE: string = process.env.API_RESPONSE_KEY_MESSAGE ?? "message";
export const API_RESPONSE_KEY_DATA: string = process.env.API_RESPONSE_KEY_DATA ?? "data";
// database
export const DB_HOST: string = process.env.DB_HOST ?? "localhost";
export const DB_PORT: number = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;
export const DB_USER: string = process.env.DB_USER ?? "";
export const DB_PASSWORD: string = process.env.DB_PASSWORD ?? "";
export const DB_DATABASE: string = process.env.DB_DATABASE ?? "";
export const DB_TIMEZONE: string = process.env.DB_TIMEZONE ?? "";
// JWT
export const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY ?? "";
