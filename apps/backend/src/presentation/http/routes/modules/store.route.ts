import { Router } from "express";
import { container } from "../../../../infrastructure/di/container.ts";
import { StoreController } from "../../controllers/store.controller.ts";
import { AuthenticateMiddleware } from "../../middlewares/authenticate.middleware.ts";
import { AuthorizeMiddleware } from "../../middlewares/authorize.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import { createStoreValidator } from "../../validators/store/create-store.validator.ts";
import { updateStoreValidator } from "../../validators/store/update-store.validator.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const controller = container.resolve(StoreController);
const authenticate = container.resolve(AuthenticateMiddleware);
const authenticateBinding = authenticate.handle.bind(authenticate);
const authorize = container.resolve(AuthorizeMiddleware);

const router = Router();

router.use(authenticateBinding);

router.get("/", authorize.handle("store:view").bind(authorize), controller.getStore.bind(controller));
router.get("/:id", authorize.handle("store:detail").bind(authorize), controller.getStoreById.bind(controller));
router.post("/", authorize.handle("store:store").bind(authorize), validation(createStoreValidator), controller.createStore.bind(controller));
router.put("/:id", authorize.handle("store:update").bind(authorize), validation(updateStoreValidator), controller.updateStore.bind(controller));
router.delete("/:id", authorize.handle("store:delete").bind(authorize), controller.destroyStore.bind(controller));

export { router as storeRouter };
