import type { Request, Response } from "express";
import expressWinston from "express-winston";
import winston from "winston";
import { LOG_LEVEL } from "../config/env.config.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const ignoreRoute = (_req: Request, _res: Response) => false;

export const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
  transports: [new winston.transports.Console()],
});

export const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}} test",
  expressFormat: true,
  ignoreRoute,
  requestWhitelist: ["url", "method", "httpVersion", "originalUrl", "query", "body", "headers"],
  responseWhitelist: ["statusCode", "body"],
});

export const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
});
