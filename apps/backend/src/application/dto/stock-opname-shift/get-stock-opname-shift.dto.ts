import type { StockOpnameShift } from "../../../domain/entities/stock-opname-shift.entity.ts";
import type { DatagridRequestType, DatagridResponseType } from "../pagination.dto.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type GetStockOpnameShiftRequestDto = DatagridRequestType<StockOpnameShift>;
export type GetStockOpnameShiftResponseDto = DatagridResponseType<StockOpnameShift>;
