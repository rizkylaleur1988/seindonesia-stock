import { body, type ValidationChain } from "express-validator";
import { ValidationMessages } from "../../../../shared/constants/validation-message.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const createStockOpnameValidator: ValidationChain[] = [
  body("store_id").notEmpty().withMessage(ValidationMessages.REQUIRED).isInt({ min: 1 }).withMessage(ValidationMessages.INTEGER_REQUIRED),
  body("stock_opname_shift_id")
    .notEmpty()
    .withMessage(ValidationMessages.REQUIRED)
    .isInt({ min: 1 })
    .withMessage(ValidationMessages.INTEGER_REQUIRED),
  body("stock_opname_date")
    .notEmpty()
    .withMessage(ValidationMessages.REQUIRED)
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage(ValidationMessages.INVALID_DATE),
  body("notes")
    .optional({ nullable: true })
    .isString()
    .withMessage(ValidationMessages.MUST_BE_STRING)
    .isLength({ max: 500 })
    .withMessage(ValidationMessages.MAX_LENGTH(500)),
  body("items").isArray({ min: 1 }).withMessage(ValidationMessages.MUST_BE_ARRAY),
  body("items.*.product_id").notEmpty().withMessage(ValidationMessages.REQUIRED).isInt({ min: 1 }).withMessage(ValidationMessages.INTEGER_REQUIRED),
  body("items.*.counted_qty").notEmpty().withMessage(ValidationMessages.REQUIRED).isInt({ min: 0 }).withMessage(ValidationMessages.INTEGER_REQUIRED),
];
