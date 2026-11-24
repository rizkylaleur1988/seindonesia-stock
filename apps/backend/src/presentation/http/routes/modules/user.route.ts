import { Router } from "express";
import { container } from "../../../../infrastructure/di/container.ts";
import { UserController } from "../../controllers/user.controller.ts";
import { AuthenticateMiddleware } from "../../middlewares/authenticate.middleware.ts";
import { AuthorizeMiddleware } from "../../middlewares/authorize.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import { createUserValidator } from "../../validators/user/create-user.validator.ts";
import { updateUserValidator } from "../../validators/user/update-user.validator.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const controller = container.resolve(UserController);
const authenticate = container.resolve(AuthenticateMiddleware);
const authenticateBinding = authenticate.handle.bind(authenticate);
const authorize = container.resolve(AuthorizeMiddleware);

const router = Router();

router.use(authenticateBinding);

router.get("/", authorize.handle("user:view").bind(authorize), controller.getUser.bind(controller));
router.get("/:id", authorize.handle("user:detail").bind(authorize), controller.getUserById.bind(controller));
router.post("/", authorize.handle("user:store").bind(authorize), validation(createUserValidator), controller.createUser.bind(controller));
router.put("/:id", authorize.handle("user:update").bind(authorize), validation(updateUserValidator), controller.updateUser.bind(controller));
router.delete("/:id", authorize.handle("user:delete").bind(authorize), controller.destroyUser.bind(controller));

export { router as userRouter };
