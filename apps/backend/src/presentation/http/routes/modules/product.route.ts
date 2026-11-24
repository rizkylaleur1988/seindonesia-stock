import { Router } from "express";
import { container } from "../../../../infrastructure/di/container.ts";
import { ProductController } from "../../controllers/product.controller.ts";
import { AuthenticateMiddleware } from "../../middlewares/authenticate.middleware.ts";
import { AuthorizeMiddleware } from "../../middlewares/authorize.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import { createProductValidator } from "../../validators/product/create-product.validator.ts";
import { updateProductValidator } from "../../validators/product/update-product.validator.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const controller = container.resolve(ProductController);
const authenticate = container.resolve(AuthenticateMiddleware);
const authenticateBinding = authenticate.handle.bind(authenticate);
const authorize = container.resolve(AuthorizeMiddleware);

const router = Router();

router.use(authenticateBinding);

router.get("/", authorize.handle("product:view").bind(authorize), controller.getProduct.bind(controller));
router.get("/:id", authorize.handle("product:detail").bind(authorize), controller.getProductById.bind(controller));
router.post("/", authorize.handle("product:store").bind(authorize), validation(createProductValidator), controller.createProduct.bind(controller));
router.put("/:id", authorize.handle("product:update").bind(authorize), validation(updateProductValidator), controller.updateProduct.bind(controller));
router.delete("/:id", authorize.handle("product:delete").bind(authorize), controller.destroyProduct.bind(controller));

export { router as productRouter };
