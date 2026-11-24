import { body, type ValidationChain } from "express-validator";
import { ValidationMessages } from "../../../../shared/constants/validation-message.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const updatePermissionValidator: ValidationChain[] = [
  body("code")
    .notEmpty()
    .withMessage(ValidationMessages.REQUIRED)
    .isString()
    .withMessage(ValidationMessages.MUST_BE_STRING)
    .isLength({ min: 1, max: 50 })
    .withMessage(ValidationMessages.LENGTH_BETWEEN(1, 50)),
  body("name")
    .notEmpty()
    .withMessage(ValidationMessages.REQUIRED)
    .isString()
    .withMessage(ValidationMessages.MUST_BE_STRING)
    .isLength({ min: 1, max: 255 })
    .withMessage(ValidationMessages.LENGTH_BETWEEN(1, 255)),
];
