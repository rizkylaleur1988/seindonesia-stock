/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const StockOpnameStatusEnum = {
  DRAFT: 1,
  SUBMITTED: 2,
  APPROVED: 3,
  REJECTED: 4,
  CANCELLED: 5,
};

export type StockOpnameStatusEnum = (typeof StockOpnameStatusEnum)[keyof typeof StockOpnameStatusEnum];

export const getStockOpnameStatusName = (status: StockOpnameStatusEnum): string | null => {
  return Object.entries(StockOpnameStatusEnum).find(([, value]) => value === status)?.[0] ?? null;
};
