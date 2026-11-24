import { and, asc, count, desc, eq, ilike, inArray, ne, or, SQL } from "drizzle-orm";
import { inject, injectable } from "tsyringe";
import type { DatagridResponseType } from "../../../application/dto/pagination.dto.ts";
import type { GetStoreRequestDto } from "../../../application/dto/store/get-store.dto.ts";
import type { Store } from "../../../domain/entities/store.entity.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { database } from "../connection.ts";
import type { DbExecutor } from "../db-executor.type.ts";
import { stores } from "../schema/store.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class StoreRepository implements IStoreRepository {
  private readonly executor: DbExecutor;

  constructor(@inject(InjectionToken.DB_EXECUTOR) executor: DbExecutor) {
    this.executor = executor;
  }

  async findByCode(code: string): Promise<Store | null> {
    const [store] = await database.select().from(stores).where(eq(stores.code, code)).limit(1);
    return store ?? null;
  }

  async create(payload: Pick<Store, "code" | "name" | "address">): Promise<Store> {
    const [store] = await database.insert(stores).values(payload).returning();
    return store;
  }

  async findById(id: number): Promise<Store | null> {
    const [store] = await database.select().from(stores).where(eq(stores.id, id)).limit(1);
    return store ?? null;
  }

  async destroy(id: number): Promise<void> {
    await database.delete(stores).where(eq(stores.id, id));
  }

  async datagrid(dto: GetStoreRequestDto): Promise<DatagridResponseType<Store>> {
    const filters = dto.filters;
    const currentPage = Math.max(1, dto.page ?? 1);
    const perPage = Math.min(100, Math.max(1, dto.limit ?? 10));
    const offset = (currentPage - 1) * perPage;
    const sortColumn = {
      id: stores.id,
      code: stores.code,
      name: stores.name,
      address: stores.address,
      created_at: stores.created_at,
      updated_at: stores.updated_at,
    } as const;
    const column = dto.sortBy ? sortColumn[dto.sortBy as keyof typeof sortColumn] : stores.created_at;
    const orderBy = dto.sortType === "ASC" ? asc(column) : desc(column);

    const conditions: SQL[] = [];
    if (dto.search) {
      const searchConditions = or(
        ilike(stores.code, `%${dto.search}%`),
        ilike(stores.name, `%${dto.search}%`),
        ilike(stores.address, `%${dto.search}%`),
      );
      if (searchConditions) conditions.push(searchConditions);
    }

    if (filters?.id) conditions.push(eq(stores.id, filters.id));
    if (filters?.code) conditions.push(eq(stores.code, filters.code));
    if (filters?.name) conditions.push(ilike(stores.name, `%${filters.name}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalResult] = await Promise.all([
      database.select().from(stores).where(where).orderBy(orderBy).limit(perPage).offset(offset),
      database.select({ total: count() }).from(stores).where(where),
    ]);

    const total = totalResult[0].total;

    return { rows, pagination: { page: currentPage, limit: perPage, total, totalPages: Math.ceil(total / perPage) } };
  }

  async findByCodeUnlessId(id: number, code: string): Promise<Store | null> {
    const [store] = await database
      .select()
      .from(stores)
      .where(and(eq(stores.code, code), ne(stores.id, id)))
      .limit(1);
    return store ?? null;
  }

  async update(payload: Pick<Store, "id" | "code" | "name" | "address">): Promise<Store> {
    const [store] = await database
      .update(stores)
      .set({
        code: payload.code,
        name: payload.name,
        address: payload.address,
        updated_at: new Date(),
      })
      .where(eq(stores.id, payload.id))
      .returning();
    return store;
  }

  async findByIds(ids: number[]): Promise<Store[]> {
    return database.select().from(stores).where(inArray(stores.id, ids));
  }
}
