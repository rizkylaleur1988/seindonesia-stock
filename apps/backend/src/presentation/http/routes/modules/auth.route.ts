import { Router } from "express";
import { container } from "../../../../infrastructure/di/container.ts";
import { AuthController } from "../../controllers/auth.controller.ts";
import { AuthenticateMiddleware } from "../../middlewares/authenticate.middleware.ts";
import { loginClientLimiter } from "../../middlewares/rate-limiters/login-client.limiter.ts";
import { loginIpLimiter } from "../../middlewares/rate-limiters/login-ip.limiter.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import { loginValidator } from "../../validators/auth/login.validator.ts";
import { refreshValidator } from "../../validators/auth/refresh.validator.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const controller = container.resolve(AuthController);
const authenticate = container.resolve(AuthenticateMiddleware);
const authenticateBinding = authenticate.handle.bind(authenticate);

const router = Router();

router.post("/login", loginIpLimiter, loginClientLimiter, validation(loginValidator), controller.login.bind(controller));
router.post("/logout", authenticateBinding, controller.logout.bind(controller));
router.post("/refresh", validation(refreshValidator), controller.refresh.bind(controller));
router.get("/me", authenticateBinding, controller.me.bind(controller));

export { router as authRouter };
