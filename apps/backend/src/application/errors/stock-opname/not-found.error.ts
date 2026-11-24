import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(message, "NOT_FOUND");
  }
}
