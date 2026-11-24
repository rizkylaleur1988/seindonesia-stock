import type { DatagridResponseType } from "../../application/dto/pagination.dto.ts";
import type { GetStockOpnameShiftRequestDto } from "../../application/dto/stock-opname-shift/get-stock-opname-shift.dto.ts";
import type { StockOpnameShift } from "../entities/stock-opname-shift.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IStockOpnameShiftRepository {
  findByCode(code: string): Promise<StockOpnameShift | null>;
  create(payload: Pick<StockOpnameShift, "code" | "name" | "ordering">): Promise<StockOpnameShift>;
  findById(id: number): Promise<StockOpnameShift | null>;
  destroy(id: number): Promise<void>;
  datagrid(dto: GetStockOpnameShiftRequestDto): Promise<DatagridResponseType<StockOpnameShift>>;
  findByCodeUnlessId(id: number, code: string): Promise<StockOpnameShift | null>;
  update(payload: Pick<StockOpnameShift, "id" | "code" | "name">): Promise<StockOpnameShift>;
  findByIds(ids: number[]): Promise<StockOpnameShift[]>;
  findPreviousShift(ordering: number): Promise<StockOpnameShift | null>;
  findByOrdering(ordering: number): Promise<StockOpnameShift | null>;
  findByOrderingUnlessId(id: number, ordering: number): Promise<StockOpnameShift | null>;
}
