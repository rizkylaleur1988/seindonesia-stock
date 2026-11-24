import type { User } from "../../../domain/entities/user.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type GetUserByIdResponseDto = Omit<User, "password">;
