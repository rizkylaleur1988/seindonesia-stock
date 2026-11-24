/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type StockOpnameItem = {
  id: number;
  stock_opname_id: number;
  product_id: number;
  counted_qty: number;
  system_qty: number | null;
  notes: string | null;
};
