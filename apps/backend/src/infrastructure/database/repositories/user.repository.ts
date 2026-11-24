import { and, asc, count, desc, eq, getTableColumns, ilike, inArray, or, SQL } from "drizzle-orm";
import { inject, injectable } from "tsyringe";
import type { DatagridResponseType } from "../../../application/dto/pagination.dto.ts";
import type { GetUserRequestDto } from "../../../application/dto/user/get-user.dto.ts";
import type { User } from "../../../domain/entities/user.entity.ts";
import type { IUserRepository } from "../../../domain/repositories/user.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { database } from "../connection.ts";
import type { DbExecutor } from "../db-executor.type.ts";
import { users } from "../schema/user.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class UserRepository implements IUserRepository {
  private readonly executor: DbExecutor;

  constructor(@inject(InjectionToken.DB_EXECUTOR) executor: DbExecutor) {
    this.executor = executor;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await database.select().from(users).where(eq(users.email, email)).limit(1);
    return user ?? null;
  }

  async findById(id: number): Promise<User | null> {
    const [user] = await database.select().from(users).where(eq(users.id, id)).limit(1);
    return user ?? null;
  }

  async create(payload: Pick<User, "name" | "email" | "password">): Promise<User> {
    const [user] = await this.executor.insert(users).values(payload).returning();
    return user;
  }

  async destroy(id: number): Promise<void> {
    await this.executor.delete(users).where(eq(users.id, id));
  }

  async update(payload: Pick<User, "id" | "name" | "email">): Promise<User> {
    const [user] = await this.executor
      .update(users)
      .set({
        name: payload.name,
        email: payload.email,
        updated_at: new Date(),
      })
      .where(eq(users.id, payload.id))
      .returning();
    return user;
  }

  async datagrid(dto: GetUserRequestDto): Promise<DatagridResponseType<Omit<User, "password">>> {
    const filters = dto.filters;
    const currentPage = Math.max(1, dto.page ?? 1);
    const perPage = Math.min(100, Math.max(1, dto.limit ?? 10));
    const offset = (currentPage - 1) * perPage;
    const sortColumn = {
      id: users.id,
      name: users.name,
      email: users.email,
      created_at: users.created_at,
      updated_at: users.updated_at,
    } as const;
    const column = dto.sortBy ? sortColumn[dto.sortBy as keyof typeof sortColumn] : users.created_at;
    const orderBy = dto.sortType === "ASC" ? asc(column) : desc(column);

    const conditions: SQL[] = [];
    if (dto.search) {
      const searchConditions = or(ilike(users.name, `%${dto.search}%`), ilike(users.email, `%${dto.search}%`));
      if (searchConditions) conditions.push(searchConditions);
    }

    if (filters?.id) conditions.push(eq(users.id, filters.id));
    if (filters?.name) conditions.push(ilike(users.name, `%${filters.name}%`));
    if (filters?.email) conditions.push(eq(users.email, filters.email));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const { password, ...userColumns } = getTableColumns(users);
    const [rows, totalResult] = await Promise.all([
      database.select(userColumns).from(users).where(where).orderBy(orderBy).limit(perPage).offset(offset),
      database.select({ total: count() }).from(users).where(where),
    ]);

    const total = totalResult[0].total;

    return { rows, pagination: { page: currentPage, limit: perPage, total, totalPages: Math.ceil(total / perPage) } };
  }

  async findByIds(ids: number[]): Promise<User[]> {
    return await database.select().from(users).where(inArray(users.id, ids));
  }
}
