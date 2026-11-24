import type { StockOpname } from "../../../domain/entities/stock-opname.entity.ts";
import type { DatagridRequestType, DatagridResponseType } from "../pagination.dto.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type GetStockOpnameRequestDto = DatagridRequestType<StockOpname>;
export type GetStockOpnameResponseDto = DatagridResponseType<StockOpname>;
