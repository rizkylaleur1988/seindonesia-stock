import { Router } from "express";
import { container } from "../../../../infrastructure/di/container.ts";
import { StockOpnameShiftController } from "../../controllers/stock-opname-shift.controller.ts";
import { AuthenticateMiddleware } from "../../middlewares/authenticate.middleware.ts";
import { AuthorizeMiddleware } from "../../middlewares/authorize.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import { createStockOpnameShiftValidator } from "../../validators/stock-opname-shift/create-stock-opname-shift.validator.ts";
import { updateStockOpnameShiftValidator } from "../../validators/stock-opname-shift/update-stock-opname-shift.validator.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const controller = container.resolve(StockOpnameShiftController);
const authenticate = container.resolve(AuthenticateMiddleware);
const authenticateBinding = authenticate.handle.bind(authenticate);
const authorize = container.resolve(AuthorizeMiddleware);

const router = Router();

router.use(authenticateBinding);

router.get("/", authorize.handle("stock-opname-shift:view").bind(authorize), controller.getStockOpnameShift.bind(controller));
router.get("/:id", authorize.handle("stock-opname-shift:detail").bind(authorize), controller.getStockOpnameShiftById.bind(controller));
router.post(
  "/",
  authorize.handle("stock-opname-shift:store").bind(authorize),
  validation(createStockOpnameShiftValidator),
  controller.createStockOpnameShift.bind(controller),
);
router.put(
  "/:id",
  authorize.handle("stock-opname-shift:update").bind(authorize),
  validation(updateStockOpnameShiftValidator),
  controller.updateStockOpnameShift.bind(controller),
);
router.delete("/:id", authorize.handle("stock-opname-shift:delete").bind(authorize), controller.destroyStockOpnameShift.bind(controller));

export { router as stockOpnameShiftRouter };
