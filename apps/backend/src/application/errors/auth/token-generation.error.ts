import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class TokenGenerationError extends AppError {
  constructor() {
    super("Token generation error", "TOKEN_GENERATION_ERROR");
  }
}
