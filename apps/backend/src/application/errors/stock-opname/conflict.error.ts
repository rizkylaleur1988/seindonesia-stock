import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, "CONFLICT");
  }
}
