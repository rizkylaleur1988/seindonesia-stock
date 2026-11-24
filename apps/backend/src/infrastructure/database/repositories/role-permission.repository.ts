import { and, asc, count, desc, eq, inArray, SQL } from "drizzle-orm";
import type { DatagridResponseType } from "../../../application/dto/pagination.dto.ts";
import type { GetRolePermissionRequestDto } from "../../../application/dto/role-permission/get-role-permission.dto.ts";
import type { RolePermission } from "../../../domain/entities/role-permission.entity.ts";
import type { IRolePermissionRepository } from "../../../domain/repositories/role-permission.repository.ts";
import { database } from "../connection.ts";
import { rolePermissions } from "../schema/role-permission.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class RolePermissionRepository implements IRolePermissionRepository {
  async findByRoles(roleIds: number[]): Promise<RolePermission[]> {
    return database.select().from(rolePermissions).where(inArray(rolePermissions.role_id, roleIds));
  }

  async findByRolesPermission(roleIds: number[], permissionId: number): Promise<RolePermission[]> {
    return database
      .select()
      .from(rolePermissions)
      .where(and(inArray(rolePermissions.role_id, roleIds), eq(rolePermissions.permission_id, permissionId)));
  }

  async findByRolePermission(roleId: number, permissionId: number): Promise<RolePermission | null> {
    const [rolePermission] = await database
      .select()
      .from(rolePermissions)
      .where(and(eq(rolePermissions.role_id, roleId), eq(rolePermissions.permission_id, permissionId)));
    return rolePermission ?? null;
  }

  async create(payload: RolePermission): Promise<RolePermission> {
    const [rolePermission] = await database.insert(rolePermissions).values(payload).returning();
    return rolePermission;
  }

  async destroy(roleId: number, permissionId: number): Promise<void> {
    await database.delete(rolePermissions).where(and(eq(rolePermissions.role_id, roleId), eq(rolePermissions.permission_id, permissionId)));
  }

  async datagrid(dto: GetRolePermissionRequestDto): Promise<DatagridResponseType<RolePermission>> {
    const filters = dto.filters;
    const currentPage = Math.max(1, dto.page ?? 1);
    const perPage = Math.min(100, Math.max(1, dto.limit ?? 10));
    const offset = (currentPage - 1) * perPage;
    const sortColumn = {
      role_id: rolePermissions.role_id,
      permission_id: rolePermissions.permission_id,
    } as const;
    const column = dto.sortBy ? sortColumn[dto.sortBy as keyof typeof sortColumn] : rolePermissions.role_id;
    const orderBy = dto.sortType === "ASC" ? asc(column) : desc(column);

    const conditions: SQL[] = [];

    if (filters?.role_id) conditions.push(eq(rolePermissions.role_id, filters.role_id));
    if (filters?.permission_id) conditions.push(eq(rolePermissions.permission_id, filters.permission_id));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalResult] = await Promise.all([
      database.select().from(rolePermissions).where(where).orderBy(orderBy).limit(perPage).offset(offset),
      database.select({ total: count() }).from(rolePermissions).where(where),
    ]);

    const total = totalResult[0].total;

    return { rows, pagination: { page: currentPage, limit: perPage, total, totalPages: Math.ceil(total / perPage) } };
  }
}
