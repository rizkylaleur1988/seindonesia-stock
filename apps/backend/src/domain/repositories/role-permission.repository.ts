import type { DatagridResponseType } from "../../application/dto/pagination.dto.ts";
import type { GetRolePermissionRequestDto } from "../../application/dto/role-permission/get-role-permission.dto.ts";
import type { RolePermission } from "../entities/role-permission.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IRolePermissionRepository {
  findByRoles(roleIds: number[]): Promise<RolePermission[]>;
  findByRolesPermission(roleIds: number[], permissionId: number): Promise<RolePermission[]>;
  findByRolePermission(roleId: number, permissionId: number): Promise<RolePermission | null>;
  create(payload: RolePermission): Promise<RolePermission>;
  destroy(roleId: number, permissionId: number): Promise<void>;
  datagrid(dto: GetRolePermissionRequestDto): Promise<DatagridResponseType<RolePermission>>;
}
