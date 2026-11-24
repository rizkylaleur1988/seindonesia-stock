import type { DatagridResponseType } from "../../application/dto/pagination.dto.ts";
import type { GetPermissionRequestDto } from "../../application/dto/permission/get-permission.dto.ts";
import type { Permission } from "../entities/permission.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IPermissionRepository {
  findByPermissions(permissionIds: number[]): Promise<Permission[]>;
  findByCode(code: string): Promise<Permission | null>;
  datagrid(dto: GetPermissionRequestDto): Promise<DatagridResponseType<Permission>>;
  create(payload: Pick<Permission, "code" | "name">): Promise<Permission>;
  findById(id: number): Promise<Permission | null>;
  destroy(id: number): Promise<void>;
  findByCodeUnlessId(id: number, code: string): Promise<Permission | null>;
  update(payload: Pick<Permission, "id" | "code" | "name">): Promise<Permission>;
  findByIds(ids: number[]): Promise<Permission[]>;
}
