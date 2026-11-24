import { Router } from "express";
import { container } from "../../../../infrastructure/di/container.ts";
import { StoreProductController } from "../../controllers/store-product.controller.ts";
import { AuthenticateMiddleware } from "../../middlewares/authenticate.middleware.ts";
import { AuthorizeMiddleware } from "../../middlewares/authorize.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import { createStoreProductValidator } from "../../validators/store-product/create-store-product.validator.ts";
import { updateStoreProductValidator } from "../../validators/store-product/update-store-product.validator.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const controller = container.resolve(StoreProductController);
const authenticate = container.resolve(AuthenticateMiddleware);
const authenticateBinding = authenticate.handle.bind(authenticate);
const authorize = container.resolve(AuthorizeMiddleware);

const router = Router();

router.use(authenticateBinding);

router.get("/", authorize.handle("store-product:view").bind(authorize), controller.getStoreProduct.bind(controller));
router.get("/:id", authorize.handle("store-product:detail").bind(authorize), controller.getStoreProductById.bind(controller));
router.post(
  "/",
  authorize.handle("store-product:store").bind(authorize),
  validation(createStoreProductValidator),
  controller.createStoreProduct.bind(controller),
);
router.put(
  "/:id",
  authorize.handle("store-product:update").bind(authorize),
  validation(updateStoreProductValidator),
  controller.updateStoreProduct.bind(controller),
);
router.delete("/:id", authorize.handle("store-product:delete").bind(authorize), controller.destroyStoreProduct.bind(controller));

export { router as storeProductRouter };
