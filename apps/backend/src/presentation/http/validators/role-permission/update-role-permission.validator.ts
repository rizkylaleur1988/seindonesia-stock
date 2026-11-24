import { body, type ValidationChain } from "express-validator";
import { ValidationMessages } from "../../../../shared/constants/validation-message.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const updateRolePermissionValidator: ValidationChain[] = [
  body("role_id").notEmpty().withMessage(ValidationMessages.REQUIRED).isInt({ min: 1 }).withMessage(ValidationMessages.MUST_BE_NUMBER),
  body("permission_id").notEmpty().withMessage(ValidationMessages.REQUIRED).isInt({ min: 1 }).withMessage(ValidationMessages.MUST_BE_NUMBER),
];
