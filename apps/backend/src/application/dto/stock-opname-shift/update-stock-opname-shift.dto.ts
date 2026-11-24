/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type UpdateStockOpnameShiftRequestDto = { id: number; code: string; name: string; ordering: number };
export type UpdateStockOpnameShiftResponseDto = { id: number; code: string; name: string; ordering: number; created_at: Date; updated_at: Date };
