import { body, type ValidationChain } from "express-validator";
import { ValidationMessages } from "../../../../shared/constants/validation-message.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const loginValidator: ValidationChain[] = [
  body("email")
    .notEmpty()
    .withMessage(ValidationMessages.REQUIRED)
    .isString()
    .withMessage(ValidationMessages.MUST_BE_STRING)
    .isEmail()
    .withMessage(ValidationMessages.INVALID_EMAIL),
  body("password").notEmpty().withMessage(ValidationMessages.REQUIRED).isString().withMessage(ValidationMessages.MUST_BE_STRING),
];
