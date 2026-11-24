import type { NextFunction, Request, Response } from "express";
import * as httpContext from "express-http-context";
import { randomUUID } from "node:crypto";
import { Middleware } from "./base/middleware.base.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class RequestMiddleware extends Middleware {
  constructor() {
    super();
  }

  handle(req: Request, res: Response, next: NextFunction): void {
    httpContext.set("request-id", randomUUID());
    httpContext.set("ip-address", req.ip);
    httpContext.set("user-agent", req.header("user-agent") ?? null);
    next();
  }
}
