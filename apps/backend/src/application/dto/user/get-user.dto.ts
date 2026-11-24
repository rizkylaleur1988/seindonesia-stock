import type { User } from "../../../domain/entities/user.entity.ts";
import type { DatagridRequestType, DatagridResponseType } from "../pagination.dto.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type GetUserRequestDto = DatagridRequestType<User>;

export type GetUserResponseDto = DatagridResponseType<Omit<User, "password">>;
