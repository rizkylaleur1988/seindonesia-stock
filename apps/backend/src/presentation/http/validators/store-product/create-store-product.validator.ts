import { body, type ValidationChain } from "express-validator";
import { ValidationMessages } from "../../../../shared/constants/validation-message.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const createStoreProductValidator: ValidationChain[] = [
  body("store_id").notEmpty().withMessage(ValidationMessages.REQUIRED).isInt({ min: 1 }).withMessage(ValidationMessages.MUST_BE_NUMBER),
  body("product_id").notEmpty().withMessage(ValidationMessages.REQUIRED).isInt({ min: 1 }).withMessage(ValidationMessages.MUST_BE_NUMBER),
  body("stock").optional().isInt({ min: 0 }).withMessage(ValidationMessages.MUST_BE_NUMBER),
];
