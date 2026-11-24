import type { DatagridResponseType } from "../../application/dto/pagination.dto.ts";
import type { GetStockOpnameRequestDto } from "../../application/dto/stock-opname/get-stock-opname.dto.ts";
import type { StockOpname } from "../entities/stock-opname.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IStockOpnameRepository {
  findByStoreDateShiftActive(store_id: number, stock_opname_date: string, stock_opname_shift_id: number): Promise<StockOpname | null>;
  findByStoreDateShiftPending(store_id: number, stock_opname_date: string, stock_opname_shift_id: number): Promise<StockOpname | null>;
  create(
    payload: Pick<
      StockOpname,
      "store_id" | "stock_opname_shift_id" | "stock_opname_date" | "notes" | "status" | "statused_by" | "created_by" | "updated_by"
    >,
  ): Promise<StockOpname>;
  findLatestActiveByStoreDate(store_id: number, stock_opname_date: string): Promise<StockOpname | null>;
  lockByStoreDate(store_id: number, stock_opname_date: string): Promise<void>;
  datagrid(dto: GetStockOpnameRequestDto): Promise<DatagridResponseType<StockOpname>>;
  findById(id: number): Promise<StockOpname | null>;
  updateStatus(payload: Pick<StockOpname, "id" | "status" | "statused_by" | "notes">): Promise<StockOpname>;
  destroy(id: number): Promise<void>;
  update(
    payload: Pick<StockOpname, "id" | "store_id" | "stock_opname_shift_id" | "stock_opname_date" | "notes" | "updated_by">,
  ): Promise<StockOpname>;
  findByDateShift(stock_opname_shift_id: number, stock_opname_date: string): Promise<StockOpname[]>;
}
