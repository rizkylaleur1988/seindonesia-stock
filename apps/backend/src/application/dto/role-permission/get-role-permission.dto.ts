import type { Permission } from "../../../domain/entities/permission.entity.ts";
import type { RolePermission } from "../../../domain/entities/role-permission.entity.ts";
import type { Role } from "../../../domain/entities/role.entity.ts";
import type { DatagridRequestType, DatagridResponseType } from "../pagination.dto.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type GetRolePermissionRequestDto = DatagridRequestType<RolePermission>;
export type GetRolePermissionResponseDto = DatagridResponseType<RolePermission & { role: Role | null; permission: Permission | null }>;
