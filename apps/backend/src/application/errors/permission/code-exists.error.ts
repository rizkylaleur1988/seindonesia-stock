import { AppError } from "../../../shared/errors/app.error.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class CodeExistsError extends AppError {
  constructor() {
    super("Permission code already exists", "PERMISSION_CODE_ALREADY_EXISTS");
  }
}
