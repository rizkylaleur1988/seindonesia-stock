import { and, asc, count, desc, eq, ilike, inArray, ne, or, SQL } from "drizzle-orm";
import type { DatagridResponseType } from "../../../application/dto/pagination.dto.ts";
import type { GetRoleRequestDto } from "../../../application/dto/role/get-role.dto.ts";
import type { Role } from "../../../domain/entities/role.entity.ts";
import type { IRoleRepository } from "../../../domain/repositories/role.repository.ts";
import { database } from "../connection.ts";
import { roles } from "../schema/role.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class RoleRepository implements IRoleRepository {
  async findByIds(roleIds: number[]): Promise<Role[]> {
    return database.select().from(roles).where(inArray(roles.id, roleIds));
  }

  async findByCode(code: string): Promise<Role | null> {
    const [role] = await database.select().from(roles).where(eq(roles.code, code)).limit(1);
    return role ?? null;
  }

  async create(payload: Pick<Role, "code" | "name">): Promise<Role> {
    const [role] = await database.insert(roles).values(payload).returning();
    return role;
  }

  async findById(id: number): Promise<Role | null> {
    const [role] = await database.select().from(roles).where(eq(roles.id, id)).limit(1);
    return role ?? null;
  }

  async destroy(id: number): Promise<void> {
    await database.delete(roles).where(eq(roles.id, id));
  }

  async update(payload: Pick<Role, "id" | "code" | "name">): Promise<Role> {
    const [role] = await database
      .update(roles)
      .set({
        code: payload.code,
        name: payload.name,
        updated_at: new Date(),
      })
      .where(eq(roles.id, payload.id))
      .returning();
    return role;
  }

  async findByCodeUnlessId(id: number, code: string): Promise<Role | null> {
    const [role] = await database
      .select()
      .from(roles)
      .where(and(eq(roles.code, code), ne(roles.id, id)))
      .limit(1);
    return role ?? null;
  }

  async datagrid(dto: GetRoleRequestDto): Promise<DatagridResponseType<Role>> {
    const filters = dto.filters;
    const currentPage = Math.max(1, dto.page ?? 1);
    const perPage = Math.min(100, Math.max(1, dto.limit ?? 10));
    const offset = (currentPage - 1) * perPage;
    const sortColumn = {
      id: roles.id,
      code: roles.code,
      name: roles.name,
      created_at: roles.created_at,
      updated_at: roles.updated_at,
    } as const;
    const column = dto.sortBy ? sortColumn[dto.sortBy as keyof typeof sortColumn] : roles.created_at;
    const orderBy = dto.sortType === "ASC" ? asc(column) : desc(column);

    const conditions: SQL[] = [];
    if (dto.search) {
      const searchConditions = or(ilike(roles.code, `%${dto.search}%`), ilike(roles.name, `%${dto.search}%`));
      if (searchConditions) conditions.push(searchConditions);
    }

    if (filters?.id) conditions.push(eq(roles.id, filters.id));
    if (filters?.code) conditions.push(eq(roles.code, filters.code));
    if (filters?.name) conditions.push(ilike(roles.name, `%${filters.name}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalResult] = await Promise.all([
      database.select().from(roles).where(where).orderBy(orderBy).limit(perPage).offset(offset),
      database.select({ total: count() }).from(roles).where(where),
    ]);

    const total = totalResult[0].total;

    return { rows, pagination: { page: currentPage, limit: perPage, total, totalPages: Math.ceil(total / perPage) } };
  }
}
