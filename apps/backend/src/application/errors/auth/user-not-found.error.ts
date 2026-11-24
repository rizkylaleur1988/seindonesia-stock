import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class UserNotFoundError extends AppError {
  constructor() {
    super("User not found", "USER_NOT_FOUND");
  }
}
