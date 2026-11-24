import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class InvalidBearerTokenError extends AppError {
  constructor() {
    super("Invalid bearer token", "INVALID_BEARER_TOKEN");
  }
}
