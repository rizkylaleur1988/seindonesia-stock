import type { Request, Response } from "express";
import rateLimit, { MemoryStore } from "express-rate-limit";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { THROTTLE_LIMIT } from "../../../../infrastructure/config/env.config.ts";
import { NumberUtil } from "../../../../shared/utils/number.util.ts";
import { ApiResponse } from "../../responses/api-response.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const windowMs: number = NumberUtil.minutesToMilliseconds(1);
export const getThrottleLimit = () => THROTTLE_LIMIT;
export const limit: number = getThrottleLimit();
export const store = new MemoryStore();
export const handler = (_req: Request, res: Response) => {
  const response = new ApiResponse().setCode(StatusCodes.TOO_MANY_REQUESTS).setDescription(getReasonPhrase(StatusCodes.TOO_MANY_REQUESTS));
  res.status(StatusCodes.TOO_MANY_REQUESTS).send(response.response());
};

export const globalLimiter = rateLimit({ windowMs, limit, standardHeaders: true, legacyHeaders: false, handler, store });
