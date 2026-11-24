import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Wrong email or password", "INVALID_CREDENTIALS");
  }
}
