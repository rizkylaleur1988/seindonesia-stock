import { and, asc, count, desc, eq, ilike, inArray, or, SQL, sql } from "drizzle-orm";
import * as httpContext from "express-http-context";
import { inject, injectable } from "tsyringe";
import type { DatagridResponseType } from "../../../application/dto/pagination.dto.ts";
import type { GetStockOpnameRequestDto } from "../../../application/dto/stock-opname/get-stock-opname.dto.ts";
import type { StockOpname } from "../../../domain/entities/stock-opname.entity.ts";
import { StockOpnameStatusEnum } from "../../../domain/enums/stock-opname.status.enum.ts";
import type { IStockOpnameRepository } from "../../../domain/repositories/stock-opname.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { database } from "../connection.ts";
import type { DbExecutor } from "../db-executor.type.ts";
import { stockOpnameShifts } from "../schema/stock-opname-shift.schema.ts";
import { stockOpnames } from "../schema/stock-opname.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class StockOpnameRepository implements IStockOpnameRepository {
  private readonly executor: DbExecutor;

  constructor(@inject(InjectionToken.DB_EXECUTOR) executor: DbExecutor) {
    this.executor = executor;
  }

  async findByStoreDateShiftActive(store_id: number, stock_opname_date: string, stock_opname_shift_id: number): Promise<StockOpname | null> {
    const statuses = [StockOpnameStatusEnum.DRAFT, StockOpnameStatusEnum.SUBMITTED, StockOpnameStatusEnum.APPROVED] as const;
    const [stockOpname] = await database
      .select()
      .from(stockOpnames)
      .where(
        and(
          eq(stockOpnames.store_id, store_id),
          eq(stockOpnames.stock_opname_date, stock_opname_date),
          eq(stockOpnames.stock_opname_shift_id, stock_opname_shift_id),
          inArray(stockOpnames.status, statuses),
        ),
      )
      .limit(1);
    return stockOpname ?? null;
  }

  async findByStoreDateShiftPending(store_id: number, stock_opname_date: string, stock_opname_shift_id: number): Promise<StockOpname | null> {
    const statuses = [StockOpnameStatusEnum.DRAFT, StockOpnameStatusEnum.SUBMITTED] as const;
    const [stockOpname] = await database
      .select()
      .from(stockOpnames)
      .where(
        and(
          eq(stockOpnames.store_id, store_id),
          eq(stockOpnames.stock_opname_date, stock_opname_date),
          eq(stockOpnames.stock_opname_shift_id, stock_opname_shift_id),
          inArray(stockOpnames.status, statuses),
        ),
      )
      .limit(1);
    return stockOpname ?? null;
  }

  async create(
    payload: Pick<
      StockOpname,
      "store_id" | "stock_opname_shift_id" | "stock_opname_date" | "notes" | "status" | "statused_by" | "created_by" | "updated_by"
    >,
  ): Promise<StockOpname> {
    const [stockOpname] = await this.executor.insert(stockOpnames).values(payload).returning();
    return stockOpname;
  }

  async findLatestActiveByStoreDate(store_id: number, stock_opname_date: string): Promise<StockOpname | null> {
    const statuses = [StockOpnameStatusEnum.DRAFT, StockOpnameStatusEnum.SUBMITTED, StockOpnameStatusEnum.APPROVED] as const;
    const [stockOpname] = await database
      .select({ stockOpname: stockOpnames })
      .from(stockOpnames)
      .innerJoin(stockOpnameShifts, eq(stockOpnames.stock_opname_shift_id, stockOpnameShifts.id))
      .where(and(eq(stockOpnames.store_id, store_id), eq(stockOpnames.stock_opname_date, stock_opname_date), inArray(stockOpnames.status, statuses)))
      .orderBy(desc(stockOpnameShifts.ordering))
      .limit(1);
    return stockOpname?.stockOpname ?? null;
  }

  async lockByStoreDate(store_id: number, stock_opname_date: string): Promise<void> {
    const lockKey = `${store_id}:${stock_opname_date}`;
    await this.executor.execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`);
  }

  async datagrid(dto: GetStockOpnameRequestDto): Promise<DatagridResponseType<StockOpname>> {
    const filters = dto.filters;
    const currentPage = Math.max(1, dto.page ?? 1);
    const perPage = Math.min(100, Math.max(1, dto.limit ?? 10));
    const offset = (currentPage - 1) * perPage;
    const sortColumn = {
      id: stockOpnames.id,
      store_id: stockOpnames.store_id,
      stock_opname_shift_id: stockOpnames.stock_opname_shift_id,
      stock_opname_date: stockOpnames.stock_opname_date,
      notes: stockOpnames.notes,
      status: stockOpnames.status,
      statused_by: stockOpnames.statused_by,
      statused_at: stockOpnames.statused_at,
      created_by: stockOpnames.created_by,
      updated_by: stockOpnames.updated_by,
      created_at: stockOpnames.created_at,
      updated_at: stockOpnames.updated_at,
    } as const;

    const column = dto.sortBy ? sortColumn[dto.sortBy as keyof typeof sortColumn] : stockOpnames.created_at;
    const orderBy = dto.sortType === "ASC" ? asc(column) : desc(column);

    const conditions: SQL[] = [];
    if (dto.search) {
      const searchConditions = or(ilike(stockOpnames.notes, `%${dto.search}%`));
      if (searchConditions) conditions.push(searchConditions);
    }

    if (filters?.id) conditions.push(eq(stockOpnames.id, filters.id));
    if (filters?.store_id) conditions.push(eq(stockOpnames.store_id, filters.store_id));
    if (filters?.stock_opname_shift_id) conditions.push(eq(stockOpnames.stock_opname_shift_id, filters.stock_opname_shift_id));
    if (filters?.stock_opname_date) conditions.push(eq(stockOpnames.stock_opname_date, filters.stock_opname_date));
    if (filters?.notes) conditions.push(ilike(stockOpnames.notes, `%${filters.notes}%`));
    if (filters?.status) conditions.push(eq(stockOpnames.status, filters.status));
    if (filters?.statused_by) conditions.push(eq(stockOpnames.statused_by, filters.statused_by));
    if (filters?.created_by) conditions.push(eq(stockOpnames.created_by, filters.created_by));
    if (filters?.updated_by) conditions.push(eq(stockOpnames.updated_by, filters.updated_by));

    const { stores, roles } = httpContext.get("user");
    const storeIds = stores.map((item: { id: number }) => item.id);
    const roleCodes = roles.map((item: { code: string }) => item.code);

    if (storeIds.length > 0) conditions.push(inArray(stockOpnames.store_id, storeIds));
    if (roleCodes.length > 0) {
      if (!roleCodes.includes("STORE_STAFF") && roleCodes.includes("STORE_MANAGER")) {
        const statuses = [StockOpnameStatusEnum.SUBMITTED, StockOpnameStatusEnum.APPROVED, StockOpnameStatusEnum.REJECTED];
        conditions.push(inArray(stockOpnames.status, statuses));
      }
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalResult] = await Promise.all([
      database.select().from(stockOpnames).where(where).orderBy(orderBy).limit(perPage).offset(offset),
      database.select({ total: count() }).from(stockOpnames).where(where),
    ]);

    const total = totalResult[0].total;

    return { rows, pagination: { page: currentPage, limit: perPage, total, totalPages: Math.ceil(total / perPage) } };
  }

  async findById(id: number): Promise<StockOpname | null> {
    const [stockOpname] = await database.select().from(stockOpnames).where(eq(stockOpnames.id, id)).limit(1);
    return stockOpname ?? null;
  }

  async updateStatus(payload: Pick<StockOpname, "id" | "status" | "statused_by" | "notes">): Promise<StockOpname> {
    const [stockOpname] = await this.executor
      .update(stockOpnames)
      .set({
        notes: payload.notes,
        status: payload.status,
        statused_by: payload.statused_by,
        statused_at: new Date(),
      })
      .where(eq(stockOpnames.id, payload.id))
      .returning();
    return stockOpname;
  }

  async destroy(id: number): Promise<void> {
    await database.delete(stockOpnames).where(eq(stockOpnames.id, id));
  }

  async update(
    payload: Pick<StockOpname, "id" | "store_id" | "stock_opname_shift_id" | "stock_opname_date" | "notes" | "updated_by">,
  ): Promise<StockOpname> {
    const [stockOpname] = await this.executor
      .update(stockOpnames)
      .set({
        store_id: payload.store_id,
        stock_opname_shift_id: payload.stock_opname_shift_id,
        stock_opname_date: payload.stock_opname_date,
        notes: payload.notes,
        updated_by: payload.updated_by,
        updated_at: new Date(),
      })
      .where(eq(stockOpnames.id, payload.id))
      .returning();
    return stockOpname;
  }

  async findByDateShift(stock_opname_shift_id: number, stock_opname_date: string): Promise<StockOpname[]> {
    return await database
      .select()
      .from(stockOpnames)
      .where(and(eq(stockOpnames.stock_opname_shift_id, stock_opname_shift_id), eq(stockOpnames.stock_opname_date, stock_opname_date)));
  }
}
