/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type UpdateRoleRequestDto = { id: number; code: string; name: string };
export type UpdateRoleResponseDto = { id: number; code: string; name: string; created_at: Date; updated_at: Date };
