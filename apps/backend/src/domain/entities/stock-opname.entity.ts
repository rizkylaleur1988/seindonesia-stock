/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type StockOpname = {
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
};
