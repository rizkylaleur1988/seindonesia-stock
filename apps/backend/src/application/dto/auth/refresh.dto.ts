import type { LoginResponseDto } from "./login.dto.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type RefreshRequestDto = { refreshToken: string };
export type RefreshResponseDto = LoginResponseDto;
