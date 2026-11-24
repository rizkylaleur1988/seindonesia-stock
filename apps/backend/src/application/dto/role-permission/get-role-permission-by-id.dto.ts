import type { RolePermission } from "../../../domain/entities/role-permission.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type GetRolePermissionByIdRequestDto = { role_id: number; permission_id: number };
export type GetRolePermissionByIdResponseDto = RolePermission;
