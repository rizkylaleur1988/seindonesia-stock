import { and, asc, count, desc, eq, ilike, inArray, ne, or, SQL } from "drizzle-orm";
import type { DatagridResponseType } from "../../../application/dto/pagination.dto.ts";
import type { GetPermissionRequestDto } from "../../../application/dto/permission/get-permission.dto.ts";
import type { Permission } from "../../../domain/entities/permission.entity.ts";
import type { IPermissionRepository } from "../../../domain/repositories/permission.repository.ts";
import { database } from "../connection.ts";
import { permissions } from "../schema/permission.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class PermissionRepository implements IPermissionRepository {
  async findByPermissions(permissionIds: number[]): Promise<Permission[]> {
    return database.select().from(permissions).where(inArray(permissions.id, permissionIds));
  }

  async findByCode(code: string): Promise<Permission | null> {
    const [permission] = await database.select().from(permissions).where(eq(permissions.code, code)).limit(1);
    return permission ?? null;
  }

  async datagrid(dto: GetPermissionRequestDto): Promise<DatagridResponseType<Permission>> {
    const filters = dto.filters;
    const currentPage = Math.max(1, dto.page ?? 1);
    const perPage = Math.min(100, Math.max(1, dto.limit ?? 10));
    const offset = (currentPage - 1) * perPage;
    const sortColumn = {
      id: permissions.id,
      code: permissions.code,
      name: permissions.name,
      created_at: permissions.created_at,
      updated_at: permissions.updated_at,
    } as const;
    const column = dto.sortBy ? sortColumn[dto.sortBy as keyof typeof sortColumn] : permissions.created_at;
    const orderBy = dto.sortType === "ASC" ? asc(column) : desc(column);

    const conditions: SQL[] = [];
    if (dto.search) {
      const searchConditions = or(ilike(permissions.code, `%${dto.search}%`), ilike(permissions.name, `%${dto.search}%`));
      if (searchConditions) conditions.push(searchConditions);
    }

    if (filters?.id) conditions.push(eq(permissions.id, filters.id));
    if (filters?.code) conditions.push(eq(permissions.code, filters.code));
    if (filters?.name) conditions.push(ilike(permissions.name, `%${filters.name}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalResult] = await Promise.all([
      database.select().from(permissions).where(where).orderBy(orderBy).limit(perPage).offset(offset),
      database.select({ total: count() }).from(permissions).where(where),
    ]);

    const total = totalResult[0].total;

    return { rows, pagination: { page: currentPage, limit: perPage, total, totalPages: Math.ceil(total / perPage) } };
  }

  async create(payload: Pick<Permission, "code" | "name">): Promise<Permission> {
    const [permission] = await database.insert(permissions).values(payload).returning();
    return permission;
  }

  async findById(id: number): Promise<Permission | null> {
    const [permission] = await database.select().from(permissions).where(eq(permissions.id, id)).limit(1);
    return permission ?? null;
  }

  async destroy(id: number): Promise<void> {
    await database.delete(permissions).where(eq(permissions.id, id));
  }

  async findByCodeUnlessId(id: number, code: string): Promise<Permission | null> {
    const [permission] = await database
      .select()
      .from(permissions)
      .where(and(eq(permissions.code, code), ne(permissions.id, id)))
      .limit(1);
    return permission ?? null;
  }

  async update(payload: Pick<Permission, "id" | "code" | "name">): Promise<Permission> {
    const [permission] = await database
      .update(permissions)
      .set({
        code: payload.code,
        name: payload.name,
        updated_at: new Date(),
      })
      .where(eq(permissions.id, payload.id))
      .returning();
    return permission;
  }

  async findByIds(ids: number[]): Promise<Permission[]> {
    return await database.select().from(permissions).where(inArray(permissions.id, ids));
  }
}
