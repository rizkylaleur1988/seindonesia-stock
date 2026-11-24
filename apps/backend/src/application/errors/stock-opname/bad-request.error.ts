import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, "BAD_REQUEST");
  }
}
