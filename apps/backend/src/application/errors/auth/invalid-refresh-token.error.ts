import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class InvalidRefreshTokenError extends AppError {
  constructor() {
    super("Invalid Refresh Token", "INVALID_REFRESH_TOKEN");
  }
}
