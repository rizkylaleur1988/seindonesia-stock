import type { Request, Response } from "express";
import rateLimit, { ipKeyGenerator, MemoryStore } from "express-rate-limit";
import { StatusCodes } from "http-status-codes";
import { NumberUtil } from "../../../../shared/utils/number.util.ts";
import { ApiResponse } from "../../responses/api-response.ts";
import { limit as clientLimit } from "./login-client.limiter.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const windowMs: number = NumberUtil.minutesToMilliseconds(5);
export const limit: number = clientLimit * 3;
export const store = new MemoryStore();
export const handler = (_req: Request, res: Response) => {
  const response = new ApiResponse().setCode(StatusCodes.TOO_MANY_REQUESTS).setDescription("too_many_request").setData({ windowMs, limit });
  res.status(StatusCodes.TOO_MANY_REQUESTS).send(response.response());
};
export const keyGenerator = (req: Request): string => {
  return `login:ip:${ipKeyGenerator(req.ip ?? "")}`;
};
export const resetLoginIpLimiter = (req: Request) => loginIpLimiter.resetKey(keyGenerator(req));

export const loginIpLimiter = rateLimit({ windowMs, limit, standardHeaders: true, legacyHeaders: false, handler, store, keyGenerator });
