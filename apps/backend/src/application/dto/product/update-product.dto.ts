/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type UpdateProductRequestDto = { id: number; code: string; name: string };
export type UpdateProductResponseDto = { id: number; code: string; name: string; created_at: Date; updated_at: Date };
