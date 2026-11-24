import type { StockOpnameItem } from "../../../domain/entities/stock-opname-item.entity.ts";
import type { StockOpnameShift } from "../../../domain/entities/stock-opname-shift.entity.ts";
import type { StockOpname } from "../../../domain/entities/stock-opname.entity.ts";
import type { Store } from "../../../domain/entities/store.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type GetStockOpnameByIdResponseDto = StockOpname & {
  items: (StockOpnameItem & { product_name: string })[];
  store: Store | null;
  shift: StockOpnameShift | null;
  status_name: string | null;
  statused_by_user: string | null;
  created_by_user: string | null;
  updated_by_user: string | null;
};
