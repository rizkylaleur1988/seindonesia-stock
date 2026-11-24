import type { NextFunction, Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { AppError } from "../../../shared/errors/app.error.ts";
import { mapHttpStatus } from "../errors/http-error.mapper.ts";
import { ApiResponse } from "../responses/api-response.ts";
import { Middleware } from "./base/middleware.base.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class ErrorMiddleware extends Middleware {
  private readonly apiResponse: ApiResponse;

  constructor() {
    super();
    this.apiResponse = new ApiResponse();
  }

  handle(err: Error, req: Request, res: Response, _next?: NextFunction): void {
    const statusCode = mapHttpStatus(err);
    this.apiResponse
      .setCode(statusCode)
      .setDescription(err instanceof AppError ? err.message : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      .setError(err);
    res.status(statusCode).json(this.apiResponse.response());
  }
}
