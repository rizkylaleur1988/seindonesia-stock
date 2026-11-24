import { Router } from "express";
import { container } from "../../../../infrastructure/di/container.ts";
import { RolePermissionController } from "../../controllers/role-permission.controller.ts";
import { AuthenticateMiddleware } from "../../middlewares/authenticate.middleware.ts";
import { AuthorizeMiddleware } from "../../middlewares/authorize.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import { createRolePermissionValidator } from "../../validators/role-permission/create-role-permission.validator.ts";
import { updateRolePermissionValidator } from "../../validators/role-permission/update-role-permission.validator.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const controller = container.resolve(RolePermissionController);
const authenticate = container.resolve(AuthenticateMiddleware);
const authenticateBinding = authenticate.handle.bind(authenticate);
const authorize = container.resolve(AuthorizeMiddleware);

const router = Router();

router.use(authenticateBinding);

router.get("/", authorize.handle("role-permission:view").bind(authorize), controller.getRolePermission.bind(controller));
router.get("/:role_id/:permission_id", authorize.handle("role-permission:detail").bind(authorize), controller.getRolePermissionById.bind(controller));
router.post(
  "/",
  authorize.handle("role-permission:store").bind(authorize),
  validation(createRolePermissionValidator),
  controller.createRolePermission.bind(controller),
);
router.put(
  "/:role_id/:permission_id",
  authorize.handle("role-permission:update").bind(authorize),
  validation(updateRolePermissionValidator),
  controller.updateRolePermission.bind(controller),
);
router.delete(
  "/:role_id/:permission_id",
  authorize.handle("role-permission:delete").bind(authorize),
  controller.destroyRolePermission.bind(controller),
);

export { router as rolePermissionRouter };
