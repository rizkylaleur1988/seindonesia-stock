import { Router } from "express";
import { container } from "../../../../infrastructure/di/container.ts";
import { PermissionController } from "../../controllers/permission.controller.ts";
import { AuthenticateMiddleware } from "../../middlewares/authenticate.middleware.ts";
import { AuthorizeMiddleware } from "../../middlewares/authorize.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import { createPermissionValidator } from "../../validators/permission/create-permission.validator.ts";
import { updatePermissionValidator } from "../../validators/permission/update-permission.validator.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const controller = container.resolve(PermissionController);
const authenticate = container.resolve(AuthenticateMiddleware);
const authenticateBinding = authenticate.handle.bind(authenticate);
const authorize = container.resolve(AuthorizeMiddleware);

const router = Router();

router.use(authenticateBinding);

router.get("/", authorize.handle("permission:view").bind(authorize), controller.getPermission.bind(controller));
router.get("/:id", authorize.handle("permission:detail").bind(authorize), controller.getPermissionById.bind(controller));
router.post(
  "/",
  authorize.handle("permission:store").bind(authorize),
  validation(createPermissionValidator),
  controller.createPermission.bind(controller),
);
router.put(
  "/:id",
  authorize.handle("permission:update").bind(authorize),
  validation(updatePermissionValidator),
  controller.updatePermission.bind(controller),
);
router.delete("/:id", authorize.handle("permission:delete").bind(authorize), controller.destroyPermission.bind(controller));

export { router as permissionRouter };
