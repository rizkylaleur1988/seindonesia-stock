/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type UpdateStockOpnameItemRequestDto = {
  product_id: number;
  counted_qty: number;
};

export type UpdateStockOpnameRequestDto = {
  id: number;
  store_id: number;
  stock_opname_shift_id: number;
  stock_opname_date: string;
  notes?: string | null;
  items: UpdateStockOpnameItemRequestDto[];
};

export type UpdateStockOpnameItemResponseDto = {
  id: number;
  stock_opname_id: number;
  product_id: number;
  counted_qty: number;
  system_qty: number | null;
  notes: string | null;
};

export type UpdateStockOpnameResponseDto = {
  id: number;
  store_id: number;
  stock_opname_shift_id: number;
  stock_opname_date: string;
  notes: string | null;
  status: number;
  statused_by: number;
  statused_at: Date;
  created_by: number;
  created_at: Date;
  updated_by: number;
  updated_at: Date;
  items: UpdateStockOpnameItemResponseDto[];
};
