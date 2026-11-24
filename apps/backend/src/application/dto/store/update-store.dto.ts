/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type UpdateStoreRequestDto = { id: number; code: string; name: string; address: string };
export type UpdateStoreResponseDto = { id: number; code: string; name: string; address: string; created_at: Date; updated_at: Date };
