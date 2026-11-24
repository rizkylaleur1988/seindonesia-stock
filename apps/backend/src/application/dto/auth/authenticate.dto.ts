import type { JwtTokenType } from "../../interfaces/security/jwt.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type AuthenticateRequestDto = { tokenType: JwtTokenType; token: string };
export type Store = { id: number; code: string; name: string };
export type Role = { id: number; code: string; name: string };
export type AuthenticateResponseDto = { user_id: number; email: string; stores: Store[]; roles: Role[] };
