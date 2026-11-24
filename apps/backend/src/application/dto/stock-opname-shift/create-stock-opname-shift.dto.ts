/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type CreateStockOpnameShiftRequestDto = { code: string; name: string; ordering: number };
export type CreateStockOpnameShiftResponseDto = { id: number; code: string; name: string; ordering: number; created_at: Date; updated_at: Date };
