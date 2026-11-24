/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type UpdatePermissionRequestDto = { id: number; code: string; name: string };
export type UpdatePermissionResponseDto = { id: number; code: string; name: string; created_at: Date; updated_at: Date };
