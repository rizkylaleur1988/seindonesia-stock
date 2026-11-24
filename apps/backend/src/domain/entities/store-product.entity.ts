/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type StoreProduct = {
  id: number;
  store_id: number;
  product_id: number;
  previous_stock: number;
  stock: number;
  created_at: Date;
  updated_at: Date;
};
