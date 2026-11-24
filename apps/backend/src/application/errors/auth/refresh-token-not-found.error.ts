import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class RefreshTokenNotFoundError extends AppError {
  constructor() {
    super("Refresh token not found", "REFRESH_TOKEN_NOT_FOUND");
  }
}
