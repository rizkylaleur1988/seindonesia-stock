import { eq } from "drizzle-orm";
import { inject, injectable } from "tsyringe";
import type { CreateStockOpnameItemRequestDto } from "../../../application/dto/stock-opname/create-stock-opname.dto.ts";
import type { StockOpnameItem } from "../../../domain/entities/stock-opname-item.entity.ts";
import type { IStockOpnameItemRepository } from "../../../domain/repositories/stock-opname-item.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { database } from "../connection.ts";
import type { DbExecutor } from "../db-executor.type.ts";
import { stockOpnameItems } from "../schema/stock-opname-item.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class StockOpnameItemRepository implements IStockOpnameItemRepository {
  private readonly executor: DbExecutor;

  constructor(@inject(InjectionToken.DB_EXECUTOR) executor: DbExecutor) {
    this.executor = executor;
  }

  async createMany(stockOpnameId: number, items: CreateStockOpnameItemRequestDto[]): Promise<StockOpnameItem[]> {
    if (items.length === 0) return [];
    const values = items.map((item) => ({ stock_opname_id: stockOpnameId, product_id: item.product_id, counted_qty: item.counted_qty }));
    return this.executor.insert(stockOpnameItems).values(values).returning();
  }

  async findByStockOpname(stockOpnameId: number): Promise<StockOpnameItem[]> {
    return await database.select().from(stockOpnameItems).where(eq(stockOpnameItems.stock_opname_id, stockOpnameId));
  }

  async destroyByStockOpname(stockOpnameId: number): Promise<void> {
    await database.delete(stockOpnameItems).where(eq(stockOpnameItems.stock_opname_id, stockOpnameId));
  }
}
