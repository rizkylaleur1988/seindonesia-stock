import "express";
import type { Role, Store } from "../application/dto/auth/authenticate.dto.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      email: string;
      stores: Store[];
      roles: Role[];
    };
  }
}
