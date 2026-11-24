import { Router } from "express";
import { container } from "../../../../infrastructure/di/container.ts";
import { RoleController } from "../../controllers/role.controller.ts";
import { AuthenticateMiddleware } from "../../middlewares/authenticate.middleware.ts";
import { AuthorizeMiddleware } from "../../middlewares/authorize.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import { createRoleValidator } from "../../validators/role/create-role.validator.ts";
import { updateRoleValidator } from "../../validators/role/update-role.validator.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const controller = container.resolve(RoleController);
const authenticate = container.resolve(AuthenticateMiddleware);
const authenticateBinding = authenticate.handle.bind(authenticate);
const authorize = container.resolve(AuthorizeMiddleware);

const router = Router();

router.use(authenticateBinding);

router.get("/", authorize.handle("role:view").bind(authorize), controller.getRole.bind(controller));
router.get("/:id", authorize.handle("role:detail").bind(authorize), controller.getRoleById.bind(controller));
router.post("/", authorize.handle("role:store").bind(authorize), validation(createRoleValidator), controller.createRole.bind(controller));
router.put("/:id", authorize.handle("role:update").bind(authorize), validation(updateRoleValidator), controller.updateRole.bind(controller));
router.delete("/:id", authorize.handle("role:delete").bind(authorize), controller.destroyRole.bind(controller));

export { router as roleRouter };
