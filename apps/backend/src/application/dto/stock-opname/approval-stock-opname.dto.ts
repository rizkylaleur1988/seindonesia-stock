import type { StockOpname } from "../../../domain/entities/stock-opname.entity.ts";
import type { StockOpnameStatusEnum } from "../../../domain/enums/stock-opname.status.enum.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type ApprovalStockOpnameRequestDto = { approval_code: keyof typeof StockOpnameStatusEnum; id: number; notes?: string | null };

export type ApprovalStockOpnameResponseDto = StockOpname;
