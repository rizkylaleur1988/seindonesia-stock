import type { Request, Response } from "express";
import rateLimit, { ipKeyGenerator, MemoryStore } from "express-rate-limit";
import { StatusCodes } from "http-status-codes";
import { NumberUtil } from "../../../../shared/utils/number.util.ts";
import { ApiResponse } from "../../responses/api-response.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const windowMs: number = NumberUtil.minutesToMilliseconds(5);
export const limit: number = 3;
export const store = new MemoryStore();
export const handler = (_req: Request, res: Response) => {
  const response = new ApiResponse().setCode(StatusCodes.TOO_MANY_REQUESTS).setDescription("too_many_request").setData({ windowMs, limit });
  res.status(StatusCodes.TOO_MANY_REQUESTS).send(response.response());
};
export const keyGenerator = (req: Request): string => {
  const clientID = req.header("x-client-id") ?? "unknown";
  return `login:client:${ipKeyGenerator(req.ip ?? "")}:${clientID}`;
};
export const resetLoginClientLimiter = (req: Request) => loginClientLimiter.resetKey(keyGenerator(req));

export const loginClientLimiter = rateLimit({ windowMs, limit, standardHeaders: true, legacyHeaders: false, handler, store, keyGenerator });
