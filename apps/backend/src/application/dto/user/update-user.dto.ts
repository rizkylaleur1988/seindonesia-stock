/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type UpdateUserRequestDto = { id: number; name: string; email: string; roles: number[]; stores: number[] };
export type UpdateUserResponseDto = { id: number; name: string; email: string; created_at: Date; updated_at: Date };
