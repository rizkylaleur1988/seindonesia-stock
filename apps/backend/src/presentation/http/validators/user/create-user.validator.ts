import { body, type ValidationChain } from "express-validator";
import { ValidationMessages } from "../../../../shared/constants/validation-message.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const createUserValidator: ValidationChain[] = [
  body("name")
    .notEmpty()
    .withMessage(ValidationMessages.REQUIRED)
    .isString()
    .withMessage(ValidationMessages.MUST_BE_STRING)
    .isLength({ min: 1, max: 255 })
    .withMessage(ValidationMessages.LENGTH_BETWEEN(1, 255)),
  body("email")
    .notEmpty()
    .withMessage(ValidationMessages.REQUIRED)
    .isString()
    .withMessage(ValidationMessages.MUST_BE_STRING)
    .isLength({ min: 1, max: 255 })
    .withMessage(ValidationMessages.LENGTH_BETWEEN(1, 255)),
  body("roles").notEmpty().withMessage(ValidationMessages.REQUIRED).isArray().withMessage(ValidationMessages.MUST_BE_ARRAY),
  body("stores").notEmpty().withMessage(ValidationMessages.REQUIRED).isArray().withMessage(ValidationMessages.MUST_BE_ARRAY),
];
