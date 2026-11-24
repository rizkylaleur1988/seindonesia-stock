import type { MeResponseDto } from "./me.dto.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type LoginRequestDto = { email: string; password: string };
export type LoginResponseDto = {
  accessToken: string;
  accessTokenExpiryTime: number | null;
  refreshToken: string;
  refreshTokenExpiryTime: number | null;
  user: MeResponseDto;
};
