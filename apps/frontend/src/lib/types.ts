/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type Pagination = { page: number; limit: number; total: number; totalPages: number };

export type Product = {
  id: number;
  code: string;
  name: string;
  stock: number;
};

export type Profile = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
};

export type StoreProduct = {
  id: number;
  store_id: number;
  product_id: number;
  stock: number;
  store: { name: string };
  product: { name: string };
};

export type Store = {
  id: number;
  code: string;
  name: string;
  address: string;
};

export type Permission = {
  id: number;
  code: string;
  name: string;
};

export type Role = {
  id: number;
  code: string;
  name: string;
};

export type StockOpnameShift = {
  id: number;
  code: string;
  name: string;
  ordering: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  roles: number[];
  stores: number[];
};

export type StockOpname = {
  id: number;
  store_id: number;
  stock_opname_shift_id: number;
  stock_opname_date: string;
  notes: string | null;
  status: number;
  statused_by: number;
  statused_at: string;
  created_by: number;
  created_at: string;
  updated_by: number;
  updated_at: string;
  store: Store;
  stock_opname_shift: StockOpnameShift;
  statused_by_user: User;
  created_by_user: User;
  updated_by_user: User;
  status_name: string;
};

export type GetStockOpnameItem = {
  id: number;
  stock_opname_id: number;
  product_id: number;
  counted_qty: number;
  system_qty: number | null;
  notes: string | null;
  product_name: string | null;
};

export type GetStockOpname = {
  id: number;
  store_id: number;
  stock_opname_shift_id: number;
  stock_opname_date: string;
  notes: string;
  status: number;
  statused_by: number;
  statused_at: string;
  created_by: number;
  created_at: string;
  updated_by: number;
  updated_at: string;
  items: GetStockOpnameItem[];
  store: Store;
  shift: StockOpnameShift;
  status_name: string | null;
  statused_by_user: string | null;
  created_by_user: string | null;
  updated_by_user: string | null;
};

export type RolePermission = {
  role_id: number;
  permission_id: number;
  role?: Role;
  permission?: Permission;
};
