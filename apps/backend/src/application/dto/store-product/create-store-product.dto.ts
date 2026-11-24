/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type CreateStoreProductRequestDto = { store_id: number; product_id: number; stock?: number | null };
export type CreateStoreProductResponseDto = { id: number; store_id: number; product_id: number; stock: number; created_at: Date; updated_at: Date };
