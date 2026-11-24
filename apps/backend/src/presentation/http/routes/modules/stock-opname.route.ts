import { Router } from "express";
import { container } from "../../../../infrastructure/di/container.ts";
import { StockOpnameController } from "../../controllers/stock-opname.controller.ts";
import { AuthenticateMiddleware } from "../../middlewares/authenticate.middleware.ts";
import { AuthorizeMiddleware } from "../../middlewares/authorize.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import { approvalStockOpnameValidator } from "../../validators/stock-opname/approval-stock-opname.validator.ts";
import { createStockOpnameValidator } from "../../validators/stock-opname/create-stock-opname.validator.ts";
import { updateStockOpnameValidator } from "../../validators/stock-opname/update-stock-opname.validator.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const controller = container.resolve(StockOpnameController);
const authenticate = container.resolve(AuthenticateMiddleware);
const authenticateBinding = authenticate.handle.bind(authenticate);
const authorize = container.resolve(AuthorizeMiddleware);

const router = Router();

router.use(authenticateBinding);

router.get("/", authorize.handle("stock-opname:view").bind(authorize), controller.getStockOpname.bind(controller));
router.get("/:id", authorize.handle("stock-opname:detail").bind(authorize), controller.getStockOpnameById.bind(controller));
router.post(
  "/",
  authorize.handle("stock-opname:store").bind(authorize),
  validation(createStockOpnameValidator),
  controller.createStockOpname.bind(controller),
);
router.post(
  "/approval",
  authorize.handle("stock-opname:approval").bind(authorize),
  validation(approvalStockOpnameValidator),
  controller.approvalStockOpname.bind(controller),
);
router.put(
  "/:id",
  authorize.handle("stock-opname:update").bind(authorize),
  validation(updateStockOpnameValidator),
  controller.updateStockOpname.bind(controller),
);
router.delete("/:id", authorize.handle("stock-opname:delete").bind(authorize), controller.destroyStockOpname.bind(controller));

export { router as stockOpnameRouter };
