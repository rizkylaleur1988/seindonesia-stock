import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class CodeExistsError extends AppError {
  constructor(message: string = "Stock opname code already exists") {
    super(message, "STOCK_OPNAME_CODE_ALREADY_EXISTS");
  }
}
