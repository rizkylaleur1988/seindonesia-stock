import type { CreateStockOpnameItemRequestDto } from "../../application/dto/stock-opname/create-stock-opname.dto.ts";
import type { StockOpnameItem } from "../entities/stock-opname-item.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IStockOpnameItemRepository {
  createMany(stockOpnameId: number, items: CreateStockOpnameItemRequestDto[]): Promise<StockOpnameItem[]>;
  findByStockOpname(stockOpnameId: number): Promise<StockOpnameItem[]>;
  destroyByStockOpname(stockOpnameId: number): Promise<void>;
}
