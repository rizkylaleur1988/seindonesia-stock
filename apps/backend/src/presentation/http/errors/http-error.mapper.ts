import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export function mapHttpStatus(error: unknown): StatusCodes {
  if (!(error instanceof AppError)) {
    return StatusCodes.INTERNAL_SERVER_ERROR;
  }

  switch (error.code) {
    case "FORBIDDEN":
      return StatusCodes.FORBIDDEN;
    case "PRODUCT_CODE_ALREADY_EXISTS":
    case "PERMISSION_CODE_ALREADY_EXISTS":
    case "ROLE_CODE_ALREADY_EXISTS":
    case "STORE_CODE_ALREADY_EXISTS":
    case "STORE_PRODUCT_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS":
    case "STOCK_OPNAME_CODE_ALREADY_EXISTS":
    case "CONFLICT":
      return StatusCodes.CONFLICT;
    case "BAD_REQUEST":
      return StatusCodes.BAD_REQUEST;
    case "INVALID_CREDENTIALS":
    case "INVALID_BEARER_TOKEN":
    case "MISSING_BEARER_TOKEN":
    case "UNAUTHORIZED":
    case "INVALID_REFRESH_TOKEN":
      return StatusCodes.UNAUTHORIZED;
    case "USER_NOT_FOUND":
    case "REFRESH_TOKEN_NOT_FOUND":
    case "PRODUCT_NOT_FOUND":
    case "PERMISSION_NOT_FOUND":
    case "ROLE_NOT_FOUND":
    case "STORE_NOT_FOUND":
    case "STORE_PRODUCT_NOT_FOUND":
    case "STOCK_OPNAME_NOT_FOUND":
    case "NOT_FOUND":
      return StatusCodes.NOT_FOUND;
    case "TOKEN_GENERATION_ERROR":
      return StatusCodes.INTERNAL_SERVER_ERROR;
    default:
      return StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
