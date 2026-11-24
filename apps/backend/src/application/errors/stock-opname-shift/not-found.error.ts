import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class NotFoundError extends AppError {
  constructor() {
    super("Stock opname not found", "STOCK_OPNAME_NOT_FOUND");
  }
}
