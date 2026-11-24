import { body, type ValidationChain } from "express-validator";
import { ValidationMessages } from "../../../../shared/constants/validation-message.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const approvalStockOpnameValidator: ValidationChain[] = [
  body("id").notEmpty().withMessage(ValidationMessages.REQUIRED).isInt({ min: 1 }).withMessage(ValidationMessages.INTEGER_REQUIRED),
  body("approval_code")
    .notEmpty()
    .withMessage(ValidationMessages.REQUIRED)
    .isString()
    .withMessage(ValidationMessages.MUST_BE_STRING)
    .bail()
    .isIn(["APPROVED", "REJECTED", "SUBMITTED", "CANCELLED"])
    .withMessage("Invalid approval code"),
  body("notes")
    .optional({ nullable: true })
    .isString()
    .withMessage(ValidationMessages.MUST_BE_STRING)
    .isLength({ max: 500 })
    .withMessage(ValidationMessages.MAX_LENGTH(500)),
];
