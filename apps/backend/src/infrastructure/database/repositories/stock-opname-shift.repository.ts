import { and, asc, count, desc, eq, ilike, inArray, ne, or, SQL } from "drizzle-orm";
import { inject, injectable } from "tsyringe";
import type { DatagridResponseType } from "../../../application/dto/pagination.dto.ts";
import type { GetStockOpnameShiftRequestDto } from "../../../application/dto/stock-opname-shift/get-stock-opname-shift.dto.ts";
import type { StockOpnameShift } from "../../../domain/entities/stock-opname-shift.entity.ts";
import type { IStockOpnameShiftRepository } from "../../../domain/repositories/stock-opname-shift.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { database } from "../connection.ts";
import type { DbExecutor } from "../db-executor.type.ts";
import { stockOpnameShifts } from "../schema/stock-opname-shift.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class StockOpnameShiftRepository implements IStockOpnameShiftRepository {
  private readonly executor: DbExecutor;

  constructor(@inject(InjectionToken.DB_EXECUTOR) executor: DbExecutor) {
    this.executor = executor;
  }

  async findByCode(code: string): Promise<StockOpnameShift | null> {
    const [stockOpnameShift] = await database.select().from(stockOpnameShifts).where(eq(stockOpnameShifts.code, code)).limit(1);
    return stockOpnameShift ?? null;
  }

  async create(payload: Pick<StockOpnameShift, "code" | "name" | "ordering">): Promise<StockOpnameShift> {
    const [stockOpnameShift] = await database.insert(stockOpnameShifts).values(payload).returning();
    return stockOpnameShift;
  }

  async findById(id: number): Promise<StockOpnameShift | null> {
    const [stockOpnameShift] = await database.select().from(stockOpnameShifts).where(eq(stockOpnameShifts.id, id)).limit(1);
    return stockOpnameShift ?? null;
  }

  async destroy(id: number): Promise<void> {
    await database.delete(stockOpnameShifts).where(eq(stockOpnameShifts.id, id));
  }

  async datagrid(dto: GetStockOpnameShiftRequestDto): Promise<DatagridResponseType<StockOpnameShift>> {
    const filters = dto.filters;
    const currentPage = Math.max(1, dto.page ?? 1);
    const perPage = Math.min(100, Math.max(1, dto.limit ?? 10));
    const offset = (currentPage - 1) * perPage;
    const sortColumn = {
      id: stockOpnameShifts.id,
      code: stockOpnameShifts.code,
      name: stockOpnameShifts.name,
      created_at: stockOpnameShifts.created_at,
      updated_at: stockOpnameShifts.updated_at,
    } as const;
    const column = dto.sortBy ? sortColumn[dto.sortBy as keyof typeof sortColumn] : stockOpnameShifts.created_at;
    const orderBy = dto.sortType === "ASC" ? asc(column) : desc(column);

    const conditions: SQL[] = [];
    if (dto.search) {
      const searchConditions = or(ilike(stockOpnameShifts.code, `%${dto.search}%`), ilike(stockOpnameShifts.name, `%${dto.search}%`));
      if (searchConditions) conditions.push(searchConditions);
    }

    if (filters?.id) conditions.push(eq(stockOpnameShifts.id, filters.id));
    if (filters?.code) conditions.push(eq(stockOpnameShifts.code, filters.code));
    if (filters?.name) conditions.push(ilike(stockOpnameShifts.name, `%${filters.name}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalResult] = await Promise.all([
      database.select().from(stockOpnameShifts).where(where).orderBy(orderBy).limit(perPage).offset(offset),
      database.select({ total: count() }).from(stockOpnameShifts).where(where),
    ]);

    const total = totalResult[0].total;

    return { rows, pagination: { page: currentPage, limit: perPage, total, totalPages: Math.ceil(total / perPage) } };
  }

  async findByCodeUnlessId(id: number, code: string): Promise<StockOpnameShift | null> {
    const [stockOpnameShift] = await database
      .select()
      .from(stockOpnameShifts)
      .where(and(eq(stockOpnameShifts.code, code), ne(stockOpnameShifts.id, id)))
      .limit(1);
    return stockOpnameShift ?? null;
  }

  async update(payload: Pick<StockOpnameShift, "id" | "code" | "name">): Promise<StockOpnameShift> {
    const [stockOpnameShift] = await database
      .update(stockOpnameShifts)
      .set({
        code: payload.code,
        name: payload.name,
        updated_at: new Date(),
      })
      .where(eq(stockOpnameShifts.id, payload.id))
      .returning();
    return stockOpnameShift;
  }

  async findByIds(ids: number[]): Promise<StockOpnameShift[]> {
    return await database.select().from(stockOpnameShifts).where(inArray(stockOpnameShifts.id, ids));
  }

  async findPreviousShift(ordering: number): Promise<StockOpnameShift | null> {
    const previousOrdering = ordering - 1;
    const [stockOpnameShift] = await database.select().from(stockOpnameShifts).where(eq(stockOpnameShifts.ordering, previousOrdering));
    return stockOpnameShift;
  }

  async findByOrdering(ordering: number): Promise<StockOpnameShift | null> {
    const [stockOpnameShift] = await database.select().from(stockOpnameShifts).where(eq(stockOpnameShifts.ordering, ordering)).limit(1);
    return stockOpnameShift ?? null;
  }

  async findByOrderingUnlessId(id: number, ordering: number): Promise<StockOpnameShift | null> {
    const [stockOpnameShift] = await database
      .select()
      .from(stockOpnameShifts)
      .where(and(eq(stockOpnameShifts.ordering, ordering), ne(stockOpnameShifts.id, id)))
      .limit(1);
    return stockOpnameShift ?? null;
  }
}
