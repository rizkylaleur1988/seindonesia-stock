import { Router } from "express";
import { authRouter } from "./modules/auth.route.ts";
import { permissionRouter } from "./modules/permission.route.ts";
import { productRouter } from "./modules/product.route.ts";
import { rolePermissionRouter } from "./modules/role-permission.route.ts";
import { roleRouter } from "./modules/role.route.ts";
import { stockOpnameShiftRouter } from "./modules/stock-opname-shift.route.ts";
import { stockOpnameRouter } from "./modules/stock-opname.route.ts";
import { storeProductRouter } from "./modules/store-product.route.ts";
import { storeRouter } from "./modules/store.route.ts";
import { userRouter } from "./modules/user.route.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/permissions", permissionRouter);
router.use("/roles", roleRouter);
router.use("/stores", storeRouter);
router.use("/store-products", storeProductRouter);
router.use("/users", userRouter);
router.use("/stock-opname-shifts", stockOpnameShiftRouter);
router.use("/stock-opnames", stockOpnameRouter);
router.use("/role-permissions", rolePermissionRouter);

export { router as apiRouter };
