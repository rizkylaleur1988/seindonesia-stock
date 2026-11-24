import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class MissingBearerTokenError extends AppError {
  constructor() {
    super("Missing bearer token", "MISSING_BEARER_TOKEN");
  }
}
