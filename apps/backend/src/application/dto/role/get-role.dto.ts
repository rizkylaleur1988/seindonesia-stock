import type { Role } from "../../../domain/entities/role.entity.ts";
import type { DatagridRequestType, DatagridResponseType } from "../pagination.dto.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type GetRoleRequestDto = DatagridRequestType<Role>;
export type GetRoleResponseDto = DatagridResponseType<Role>;
