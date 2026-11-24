/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type CreateStoreRequestDto = { code: string; name: string; address: string };
export type CreateStoreResponseDto = { id: number; code: string; name: string; address: string; created_at: Date; updated_at: Date };
